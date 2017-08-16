# -*- coding: utf-8 -*-
# This file is part of Shuup.
#
# Copyright (c) 2012-2017, Shoop Commerce Ltd. All rights reserved.
#
# This source code is licensed under the OSL-3.0 license found in the
# LICENSE file in the root directory of this source tree.
from django.db import models
from django.utils.translation import ugettext_lazy as _
from enumfields.enums import Enum
from enumfields.fields import EnumIntegerField

from shuup.core.fields import CurrencyField, MoneyValueField, UnsavedForeignKey
from shuup.core.models._service_payment import PaymentMethod
from shuup.utils.analog import define_log_model
from shuup.utils.properties import MoneyProperty, MoneyPropped

__all__ = ("Payment",)


class PaymentStates(Enum):
    NONE = 0
    AUTHORIZED = 1
    PENDING = 2
    CANCELED = 3
    REFUNDED = 4
    PARTIALLY_REFUNDED = 5
    REFUSED = 6
    MANUAL = 7
    CHARGED_BACK = 8
    ERROR = 10

    class Labels:
        NONE = _('Untouched')
        AUTHORIZED = _('Authorized')
        PENDING = _('Pending')
        CANCELED = _('Canceled')
        REFUNDED = _('Refunded')
        PARTIALLY_REFUNDED = _('Partially refunded')
        REFUSED = _('Refused')
        MANUAL = _('Manual')
        CHARGED_BACK = _('Charged back')
        ERROR = _('Error')


class PaymentTypes(Enum):
    PAYMENT = 0
    REFUND = 1

    class Labels:
        PAYMENT = _('Payment')
        REFUND = _('Refund')


# TODO (2.0): Rename this to Payment
class AbstractPayment(MoneyPropped, models.Model):
    created_on = models.DateTimeField(auto_now_add=True, verbose_name=_('created on'))
    gateway_id = models.CharField(max_length=32, verbose_name=_('gateway ID'))  # TODO: do we need this?
    payment_identifier = models.CharField(max_length=96, unique=True, verbose_name=_('identifier'))

    amount = MoneyProperty('amount_value', 'currency')
    foreign_amount = MoneyProperty('foreign_amount_value', 'foreign_currency')

    amount_value = MoneyValueField(verbose_name=_('amount'))
    foreign_amount_value = MoneyValueField(default=None, blank=True, null=True, verbose_name=_('foreign amount'))
    foreign_currency = CurrencyField(default=None, blank=True, null=True, verbose_name=_('foreign amount currency'))

    description = models.CharField(max_length=256, blank=True, verbose_name=_('description'))

    class Meta:
        abstract = True


# TODO (2.0): Rename this to OrderPayment
class Payment(AbstractPayment):
    order = models.ForeignKey("Order", related_name='payments', on_delete=models.PROTECT, verbose_name=_('order'))
    parent_payment = models.ForeignKey('Payment', null=True, blank=True, related_name='child_payments')
    payment_method = UnsavedForeignKey(
        PaymentMethod, blank=True, null=True,
        default=None, on_delete=models.PROTECT,
        verbose_name=_('payment method'))
    psp_reference = models.CharField(max_length=255, unique=True, null=True)
    note = models.TextField(null=True, blank=True)
    currency = CurrencyField(verbose_name=_('currency'))
    state = EnumIntegerField(PaymentStates, default=PaymentStates.NONE)
    type = EnumIntegerField(PaymentTypes, default=PaymentTypes.PAYMENT)
    expected_amount = MoneyProperty('expected_amount_value', 'currency')
    expected_amount_value = MoneyValueField(verbose_name=_('expected amount'))

    def refund(self, amount):
        self.payment_method.payment_processor.refund(self.psp_reference, amount)

    @property
    def refundable(self):
        return self.payment_method and hasattr(self.payment_method.payment_processor, 'refund')

    @property
    def refunds(self):
        return self.child_payments.filter(type=PaymentTypes.REFUND)

    class Meta:
        verbose_name = _('payment')
        verbose_name_plural = _('payments')


PaymentLogEntry = define_log_model(Payment)
