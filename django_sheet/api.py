from tastypie.authorization import DjangoAuthorization
from tastypie.contrib.contenttypes.fields import GenericForeignKeyField
from tastypie.resources import ModelResource
from djangoautoconf.req_with_auth import DjangoUserAuthentication
from models import StringCellValue, Cell, Sheet
from djangoautoconf.tastypie_utils import create_tastypie_resource_class
from tastypie import fields
__author__ = 'weijia'


string_cell_value_resource_class = create_tastypie_resource_class(StringCellValue)
sheet_resource_class = create_tastypie_resource_class(Sheet)

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


"""
def return_true():
    return True
"""


class CellResource(ModelResource):
    #authentication = return_true
    #authorization = return_true
    cell_value = GenericForeignKeyField({
        StringCellValue: string_cell_value_resource_class,
    }, 'cell_value', full=True)
    sheet = fields.ForeignKey(sheet_resource_class, 'sheet')

    class Meta:
        resource_name = 'cell'
        queryset = Cell.objects.all()
        authentication = DjangoUserAuthentication()
        authorization = DjangoAuthorization()
