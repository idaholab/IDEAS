def build_xls(workbook, risk):
    
    """
        Accepts a risk object and parses it into the desired NRIC format in a .xlsx file.
    """

    # Risk Worksheet
    worksheet = workbook.add_worksheet(risk['risk_title'])


    # Formatting
    title = workbook.add_format({'bold': True, 'text_wrap': True})
    merge = workbook.add_format({'text_wrap': True, 'align': 'center'})
    red = workbook.add_format({'font_color': 'red'})
    date_format = workbook.add_format({'num_format': 'yyyy-mm-dd'})

    worksheet.set_column('A:A', 25)
    worksheet.set_column('D:D', 30)
    worksheet.set_column('H:H', 20)
    worksheet.set_column('J:J', 20)

    

    print(risk)

    

    worksheet.merge_range('D1:G1', "RISK ASSESSMENT FORM")

    # Risk ID
    worksheet.write_string('A3', "Risk ID:", title)
    worksheet.merge_range('B3:C3', risk['risk_id'], merge)

    # Revision
    worksheet.write('D3', "Revision:", title)
    worksheet.write('E3', risk['revision'])

    # Last Evaluated Date
    worksheet.merge_range('F3:G3', "Last Date Evaluated:", title)
    print(risk['last_date_evaluated'])
    worksheet.write_datetime('H3', risk['last_date_evaluated'], date_format)

    # Status
    worksheet.write('I3', "Status:", title)
    worksheet.merge_range("J3:K3", risk['status'], red)

    # Schedule ID
    worksheet.write('A4', "Schedule ID:", title)
    worksheet.merge_range('B4:E4', risk['schedule_id'], merge)

    # Watch List
    worksheet.merge_range('F4:G4', "Watch List:", title)
    worksheet.write('H4', risk['watch_list'])

    # Risk Owner
    worksheet.write('I4', "Risk Owner:", title)
    worksheet.merge_range('J4:K4', risk['risk_owner'], merge)

    # Risk Title
    worksheet.write('A5', "Risk Title:", title)
    worksheet.merge_range('B5:H5', risk['risk_title'], merge)

    # Project
    worksheet.write('I5', "Project", title)
    worksheet.merge_range('J5:K5', risk['project'], merge)

    # Risk Statement
    worksheet.write('A6', "Risk Statement", title)
    worksheet.merge_range('B6:K6', risk['risk_statement'], merge)

    # Risk Assumptions
    worksheet.write('A7', "Risk Assumptions", title)
    worksheet.merge_range('B7:K7', risk['risk_assumptions'], merge)

    # Type
    worksheet.write('A8', "Type: (Threat or Opportunity)", title)
    type_dropdown = worksheet.data_validation('B8', {'validate': 'list', 'source': risk['type']})
    worksheet.merge_range('B8:C8', type_dropdown)
    
    # Risk Breakdown Structure (RBS)
    worksheet.merge_range('D8:E8', "Risk Breakdown Structure (RBS):", title)
    rbs_dropdown = worksheet.data_validation('F8', {'validate': 'list', 'source': risk['risk_breakdown_structure']})
    worksheet.merge_range('F8:G8', rbs_dropdown)

    # Risk Sub-Category
    worksheet.merge_range('H8:I8', "Risk Sub-Category:", title)
    rsc_dropdown = worksheet.data_validation('J8', {'validate': 'list', 'source': risk['risk_sub_category']})
    worksheet.merge_range('J8:K8', rsc_dropdown)

    # Date Risk Identified
    worksheet.write('A9', "Date Risk Identified:", title)
    worksheet.merge_range('B9:C9', risk['date_risk_identified'], merge)

    # Date Risk Opened
    worksheet.merge_range('D9:E9', "Date Risk Opened:", title)
    worksheet.write_datetime('F9:G9', risk['date_risk_opened'], date_format)

    # Date Risk Closes
    worksheet.merge_range('H9:I9', "Date Risk Closes:", title)
    worksheet.write_blank('F9:G9', risk['date_risk_closes'])

    # Impacted WBS Elements
    worksheet.write('A10', "Impacted WBS Element(s):", title)
    # TODO: Get Impacted WBS Elements options from NRIC
    wbs_dropdown = worksheet.data_validation('B10', {'validate': 'list', 'source': risk['impacted_wbs_elements']})
    worksheet.merge_range('B10:G10', wbs_dropdown, merge)

    # Secondary Risks
    worksheet.merge_range('H10:I10', "Secondary Risk(s):", title)
    worksheet.merge_range('J10:K10', risk['secondary_risks'], merge)

    # Initial Likelihood Risk
    worksheet.write('A11', "Initial Likelihood Risk:", title)
    ilr_dropdown = worksheet.data_validation('B11', {'validate': 'list', 'source': risk['initial_risk_likelihood']})
    worksheet.merge_range('B11:C11', ilr_dropdown)

    # Trigger Event
    worksheet.merge_range('D11:E11', "Trigger Event:", title)
    worksheet.merge_range('F11:G11', risk['trigger_event'], merge)
    
    # Residual Risk Likelihood
    worksheet.merge_range('H11:I11', "Residual Risk Likelihood:", title)
    rrl_dropdown = worksheet.data_validation('J11', {'validate': 'list', 'source': risk['residual_risk_likelihood']})
    worksheet.merge_range('J11:K11', rrl_dropdown)

    # Initial Consequence
    worksheet.write('A12', "Initial Consequence:", title)
    ic_dropdown = worksheet.data_validation('B12', {'validate': 'list', 'source': risk['initial_consequence']})
    worksheet.merge_range('B12:C12', ic_dropdown)

    # Handling Strategy
    worksheet.merge_range('D12:E12', "Handling Strategy:", title)
    hs_dropdown = worksheet.data_validation('F12', {'validate': 'list', 'source': risk['handling_strategy']})
    worksheet.merge_range('F12:G12', hs_dropdown)

    # Residual Consequence
    worksheet.merge_range('H12:I12', "Residual Consequence:", title)
    rc_dropdown = worksheet.data_validation('J12', {'validate': 'list', 'source': risk['residual_consequence']})
    worksheet.merge_range('J12:K12', rc_dropdown)

    # Initial Risk Rating
    worksheet.write('A13', "Initial Risk Rating:", title)
    worksheet.merge_range('B13:C13', risk['initial_risk_rating'], merge)

    # Handling Strategy Implementation Cost ($K)
    worksheet.merge_range('D13:E13', "Handling Strategy Implementation Cost ($K):", title)
    worksheet.merge_range('F13:G13', risk['handling_strategy_implementation_cost'], merge)

    # Residual Risk Rating
    worksheet.merge_range('H13:I13', "Residual Risk Rating:", title)
    worksheet.merge_range('J13:K13', risk['residual_risk_rating'], merge)

    # Initial Impact ($)
    worksheet.write('A14', "Initial Impact ($):", title)
    worksheet.merge_range('B14:E14', risk['initial_impact'], merge)

    # Residual Impact ($)
    worksheet.merge_range('F14:G14', "Residual Impact ($):", title)
    worksheet.merge_range('H14:K14', risk['residual_impact'], merge)

    # Initial Schedule Impact (Workdays)
    worksheet.write('A15', "Initial Schedule Impact (Workdays):", title)
    worksheet.merge_range('B15:E15', risk['initial_schedule_impact'], merge)

    # Residual Schedule Impact (Workdays)
    worksheet.merge_range('F15:G15', "Residual Schedule Impact (Workdays):", title)
    worksheet.merge_range('H15:K15', risk['residual_schedule_impact'], merge)

    # Basis of Residual Impact
    worksheet.merge_range('A16:B16', "Basis of Residual Impact:", title)
    worksheet.merge_range('C16:K16', risk['basis_of_residual_impact'], merge)

    # Handling Actions (Include Due Date)
    worksheet.merge_range('A17:B17', "Handling Actions:", title)
    worksheet.merge_range('C17:K17', risk['handling_actions'], merge)

    # Success Metric for Overall Handling Strategy
    worksheet.merge_range('A18:B18', "Success Metric fr Overall Handling Strategy:", title)
    worksheet.merge_range('C18:K18', risk['success_metric'], merge)

    # Status Comments
    worksheet.merge_range('A19:B19', "Status Comments:", title)
    worksheet.merge_range('C19:K19', risk['status_comments'], merge)

    # Historical Comments and Notes
    worksheet.merge_range('A20:B20', "Historical Comments and Notes:", title)
    worksheet.merge_range('C20:K20', risk['historical_comments'], merge)

    print("Saving Workbook")
    workbook.close()