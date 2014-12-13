from django.conf.urls import patterns, include, url
from djangoautoconf.auto_conf_urls import add_default_root_url
from djangoautoconf.tastypie_utils import create_tastypie_resource
from django_sheet.models import Sheet, Cell, DateCellValue, FloatCellValue, StringCellValue, IntegerCellValue, SheetFile
from views import SpreadSheetTemplateView

__author__ = 'weijia'


urlpatterns = patterns('',
    url(r'^$', SpreadSheetTemplateView.as_view(), name='demo_home'),
    url(r'^api/', include(create_tastypie_resource(SheetFile).urls)),
    url(r'^api/', include(create_tastypie_resource(Sheet).urls)),
    url(r'^api/', include(create_tastypie_resource(Cell).urls)),
    url(r'^api/', include(create_tastypie_resource(DateCellValue).urls)),
    url(r'^api/', include(create_tastypie_resource(FloatCellValue).urls)),
    url(r'^api/', include(create_tastypie_resource(StringCellValue).urls)),
    url(r'^api/', include(create_tastypie_resource(IntegerCellValue).urls)),
)

add_default_root_url("^django_sheet/")
