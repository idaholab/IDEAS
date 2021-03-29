# Excel Writer
import xlsxwriter


def build_xls(risk):
    
    """
        Accepts a risk object and parses it into the desired NRIC format in a .xlsx file.
    """


    print(risk)

    workbook = xlsxwriter.Workbook('risk-assessment-form.xlsx')
    worksheet = workbook.add_worksheet()
    worksheet.merge_range('D1:G1', risk['revision'])
    print("Saving Workbook")
    workbook.close()