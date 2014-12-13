# -*- coding: utf-8 -*-

from django.db import models
from django.contrib.contenttypes import generic
from django.contrib.contenttypes.models import ContentType


class SheetFile(models.Model):
    filename = models.CharField(max_length=512)


class Sheet(models.Model):
    sheet_name = models.CharField(max_length=512)
    sheet_file = models.ForeignKey(SheetFile)


class Cell(models.Model):
    cell_row = models.IntegerField(help_text="0 based row")
    cell_column = models.IntegerField(help_text="0 based col")
    content_type = models.ForeignKey(ContentType)
    object_id = models.PositiveIntegerField()
    cell_value = generic.GenericForeignKey('content_type', 'object_id')
    created = models.DateTimeField(auto_now_add=True)
    sheet = models.ForeignKey(Sheet)


class DateCellValue(models.Model):
    value = models.DateTimeField()


class FloatCellValue(models.Model):
    value = models.FloatField()


class StringCellValue(models.Model):
    value = models.CharField(max_length=4096)


class IntegerCellValue(models.Model):
    value = models.IntegerField()
