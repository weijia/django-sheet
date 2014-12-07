from django.conf.urls import patterns, include, url
from djangoautoconf.auto_conf_urls import add_default_root_url
from views import SpreadSheetTemplateView

__author__ = 'weijia'


urlpatterns = patterns('',
    url(r'^$', SpreadSheetTemplateView.as_view(), name='demo_home'),
)

add_default_root_url("^django_sheet/")
