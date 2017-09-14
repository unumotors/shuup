# -*- coding: utf-8 -*-
# Generated by Django 1.9.13 on 2017-09-14 12:36
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shuup', '0029_auto_20170812_1526'),
        ('default_tax', '0002_postal_code_pattern_to_text'),
    ]

    operations = [
        migrations.AddField(
            model_name='taxrule',
            name='shops',
            field=models.ManyToManyField(to='shuup.Shop'),
        ),
    ]
