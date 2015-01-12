from django.conf.urls import patterns, include, url
from api import CellResource, string_cell_value_resource_class
#from api import StringCellValueResourceM
#from api import cell_resource_class_inst
#from django_sheet.api import cell_resource_class_inst, class_inst
from djangoautoconf.auto_conf_urls import add_default_root_url
from djangoautoconf.tastypie_utils import create_tastypie_resource
from django_sheet.models import Sheet, Cell, DateCellValue, FloatCellValue, StringCellValue, IntegerCellValue, SheetFile
from views import JqSheetSpreadSheetTemplateView, update_cell, HandsonTableSpreadSheetTemplateView

__author__ = 'weijia'

#string_value_res = StringCellValueResourceM()
cell_resource = CellResource()

urlpatterns = patterns('',
    url(r'^$', JqSheetSpreadSheetTemplateView.as_view(), name='demo_home'),
    #url(r'^$', HandsonTableSpreadSheetTemplateView.as_view(), name='demo_home'),
    url(r'^update_cell', update_cell),
    #url(r'^api/', include(string_value_res.urls)),
    url(r'^api/', include(cell_resource.urls)),
    url(r'^api/', include(string_cell_value_resource_class().urls)),
    #url(r'^api/', include(cell_resource_class_inst().urls)),
    url(r'^api/', include(create_tastypie_resource(SheetFile).urls)),
    url(r'^api/', include(create_tastypie_resource(Sheet).urls)),
    #url(r'^api/', include(create_tastypie_resource(Cell).urls)),
    url(r'^api/', include(create_tastypie_resource(DateCellValue).urls)),
    url(r'^api/', include(create_tastypie_resource(FloatCellValue).urls)),
    #url(r'^api/', include(create_tastypie_resource(StringCellValue).urls)),
    url(r'^api/', include(create_tastypie_resource(IntegerCellValue).urls)),
)
