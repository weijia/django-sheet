from tastypie.contrib.contenttypes.fields import GenericForeignKeyField
from tastypie.resources import ModelResource
from models import StringCellValue, Cell
from djangoautoconf.tastypie_utils import create_tastypie_resource_class

__author__ = 'weijia'


string_cell_value_resource_class = create_tastypie_resource_class(StringCellValue)

"""

cell_resource_class_inst = create_tastypie_resource_class(Cell)

cell_resource_class_inst.cell_value = GenericForeignKeyField({
                                                                      StringCellValue: class_inst,
                                                                  }, 'cell_value')


class StringCellValueResourceM(ModelResource):
    class Meta:
        resource_name = 'string_cell'
        queryset = StringCellValue.objects.all()
"""

class CellResource(ModelResource):
    cell_value = GenericForeignKeyField({
        StringCellValue: string_cell_value_resource_class,
    }, 'cell_value', full=True)

    class Meta:
        resource_name = 'cell'
        queryset = Cell.objects.all()
