# -*- coding: utf-8 -*-
# Generated by Django 1.9.13 on 2018-01-19 17:09
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('campaigns', '0009_auto_20171122_1655'),
    ]

    operations = [
        migrations.AlterField(
            model_name='coupon',
            name='code',
            field=models.CharField(max_length=30, unique=True),
        ),
    ]
