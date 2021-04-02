from helpers.enumerators import risk_enumerators

def reference(workbook):

    # Reference Worksheet
    worksheet = workbook.add_worksheet('Reference_Data')

    # Risk Category
    worksheet.merge_range('E2:H2', "Risk Category")
    worksheet.write_row('E3', risk_enumerators['risk_breakdown_structure'])

    worksheet.write_column('E4', risk_enumerators['risk_sub_category'][0]) # Project
    worksheet.write_column('F4', risk_enumerators['risk_sub_category'][1]) # Technical
    worksheet.write_column('G4', risk_enumerators['risk_sub_category'][2]) # Safety
    worksheet.write_column('H4', risk_enumerators['risk_sub_category'][3]) # Reaction

    # Impacted WBS Elements
    worksheet.write_column('J2', risk_enumerators['impacted_wbs_elements'][0])
    worksheet.write_column('J3', risk_enumerators['impacted_wbs_elements'][1])
    worksheet.write_column('J7', risk_enumerators['impacted_wbs_elements'][2])
    worksheet.write_column('J14', risk_enumerators['impacted_wbs_elements'][3])
    worksheet.write_column('J22', risk_enumerators['impacted_wbs_elements'][4])
    worksheet.write_column('J26', risk_enumerators['impacted_wbs_elements'][5])
    worksheet.write_column('J32', risk_enumerators['impacted_wbs_elements'][6])

    # Heatmap
    worksheet.add_table('A13:F18', {
        'data': [
            ['', 'Negligible', 'Marginal', 'Significant', 'Critical/Exceptional', 'Crisis/Outstanding'],
            ['Very Unlikely', 'Low', 'Low', 'Low', 'Low', 'Low', 'Low'],
            ['Unlikely', 'Low', 'Low', 'Moderate', 'Moderate', 'High'],
            ['50/50', 'Low', 'Low', 'Moderate', 'High', 'High'],
            ['Likely', 'Low', 'Moderate', 'Moderate', 'Moderate', 'High', 'High'],
            ['Very Likely', 'Low', 'Moderate', 'High', 'High', 'High']
        ],
        'header_row': False
    })