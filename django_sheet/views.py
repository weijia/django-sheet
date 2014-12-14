import json
from django.http import HttpResponse
from django.views.generic import TemplateView
from django_sheet.models import StringCellValue, Cell, Sheet, SheetFile
from djangoautoconf.django_utils import retrieve_param

__author__ = 'weijia'


class JqSheetSpreadSheetTemplateView(TemplateView):
    template_name = "django_sheet/spread_sheet.html"

    def get_context_data(self, **kwargs):
        data = retrieve_param(self.request)
        sheet_name = "First sheet"
        if "sheet_name" in data:
            sheet_name = data["sheet_name"]
            sheet_file, is_file_created = SheetFile.objects.get_or_create(filename="TestFile")
            sheet, is_sheet_created = Sheet.objects.get_or_create(sheet_name=sheet_name, sheet_file=sheet_file)
        kwargs = super(JqSheetSpreadSheetTemplateView, self).get_context_data(**kwargs)
        kwargs["sheet_name"] = sheet_name
        return kwargs


class HandsonTableSpreadSheetTemplateView(TemplateView):
    template_name = "django_sheet/handson_sheet.html"

    def get_context_data(self, **kwargs):
        data = retrieve_param(self.request)
        sheet_name = "First sheet"
        if "sheet_name" in data:
            sheet_name = data["sheet_name"]
            sheet_file, is_file_created = SheetFile.objects.get_or_create(filename="TestFile")
            sheet, is_sheet_created = Sheet.objects.get_or_create(sheet_name=sheet_name, sheet_file=sheet_file)
        kwargs = super(HandsonTableSpreadSheetTemplateView, self).get_context_data(**kwargs)
        kwargs["sheet_name"] = sheet_name
        return kwargs




def update_cell(request):
    data = retrieve_param(request)
    json_str = ""
    if "json_obj" in data:
        json_str = data["json_obj"]
    else:
        for item in data:
            json_str = item
            break
    json_obj = json.loads(json_str)
    s = StringCellValue(value=json_obj["value"])
    s.save()
    sheet_name = json_obj["sheet"]
    sheet_file, is_file_created = SheetFile.objects.get_or_create(filename="TestFile")
    sheet, is_sheet_created = Sheet.objects.get_or_create(sheet_name=sheet_name, sheet_file=sheet_file)
    existing_cell = Cell.objects.filter(cell_row=json_obj["cell_row"], cell_column=json_obj["cell_column"],
                                        sheet=sheet)
    if existing_cell.exists():
        existing_cell[0].cell_value = s
    else:
        c = Cell(cell_row=json_obj["cell_row"], cell_column=json_obj["cell_column"],
                 sheet=sheet, cell_value=s)
        c.save()
    return HttpResponse("OK")
