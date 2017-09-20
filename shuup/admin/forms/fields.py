# This file is part of Shuup.
#
# Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
#
# This source code is licensed under the OSL-3.0 license found in the
# LICENSE file in the root directory of this source tree.
from decimal import Decimal
from numbers import Number

import logging
from django.forms import DecimalField, Field, SelectMultiple


class PercentageField(DecimalField):
    MULTIPLIER = Decimal(100)

    def prepare_value(self, value):
        # Percentage values are 0..1 in database, so multiply by 100
        if value is not None and isinstance(value, Number):
            value *= self.MULTIPLIER
        return super(PercentageField, self).prepare_value(value)

    def to_python(self, value):
        value = super(PercentageField, self).to_python(value)
        if value is not None:
            # We got a value, so divide it by 100 to get the 0..1 range value
            value /= self.MULTIPLIER
        return value

    def widget_attrs(self, widget):
        attrs = super(PercentageField, self).widget_attrs(widget)
        if self.min_value is not None:
            attrs['min'] = self.min_value * self.MULTIPLIER
        if self.max_value is not None:
            attrs['max'] = self.max_value * self.MULTIPLIER
        return attrs


logger = logging.getLogger(__name__)


class Select2MultipleField(Field):
    widget = SelectMultiple

    def __init__(self, model, *args, **kwargs):
        self.model = model
        self.label_attr = kwargs.pop('label_attr', None)

        logger.warning('Field init: {} {} '.format(self.model, self.label_attr))
        super(Select2MultipleField, self).__init__(*args, **kwargs)

    def to_python(self, value):
        value = super(Select2MultipleField, self).to_python(value)
        # Here we have sometimes None which will cause errors when
        # saving related fields so let's fallback to empty list
        return value or []

    def widget_attrs(self, widget):
        attrs = super(Select2MultipleField, self).widget_attrs(widget)
        model_name = "%s.%s" % (self.model._meta.app_label, self.model._meta.model_name)

        logger.warning('Widget_Attrs: {} {} '.format(model_name, self.label_attr))
        attrs.update({
            "data-model": model_name,
            "data-label": self.label_attr
        })
        return attrs
