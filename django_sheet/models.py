# -*- coding: utf-8 -*-

from django.db import models
from django.contrib.contenttypes import generic
from django.contrib.contenttypes.models import ContentType


class SheetFile(models.Model):
    filename = models.CharField(max_length=512)

    def __unicode__(self):
        return unicode("%s" % self.filename)


class Sheet(models.Model):
    sheet_name = models.CharField(max_length=512)
    sheet_file = models.ForeignKey(SheetFile)
    sheet_prop = models.TextField(blank=True, null=True)

    def __unicode__(self):
        return unicode("%s - %s" % (self.sheet_file, self.sheet_name))


class Cell(models.Model):
    cell_row = models.IntegerField(help_text="0 based row")
    cell_column = models.IntegerField(help_text="0 based col")
    content_type = models.ForeignKey(ContentType)
    object_id = models.PositiveIntegerField()
    cell_value = generic.GenericForeignKey('content_type', 'object_id')
    created = models.DateTimeField(auto_now_add=True)
    sheet = models.ForeignKey(Sheet)

    def __unicode__(self):
        return unicode(u"%s - %s (%d, %d) - %s" % (self.sheet.sheet_file.filename, self.sheet.sheet_name,
                                                  self.cell_row, self.cell_column, unicode(self.cell_value)))


class DateCellValue(models.Model):
    value = models.DateTimeField()

    def __unicode__(self):
        return unicode("%s" % str(self.value))


class FloatCellValue(models.Model):
    value = models.FloatField()

    def __unicode__(self):
        return unicode("%s" % str(self.value))


class StringCellValue(models.Model):
    value = models.CharField(max_length=4096)

    def __unicode__(self):
        try:
            return self.value
        except:
            return "Invalid encoded string cell value"


class IntegerCellValue(models.Model):
    value = models.IntegerField()

    def __unicode__(self):
        return unicode("%s" % str(self.value))