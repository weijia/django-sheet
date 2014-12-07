from django.views.generic import TemplateView

__author__ = 'weijia'


class SpreadSheetTemplateView(TemplateView):
    template_name = "django_sheet/spread_sheet.html"

    def get_context_data(self, **kwargs):
        return super(SpreadSheetTemplateView, self).get_context_data(**kwargs)