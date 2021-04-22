# Data that we 

risk_enumerators = {
    'type': ['Threat', "Opportunity"],
    'risk_breakdown_structure': ['Project', 'Technical', 'Safety', 'Reaction'],
    'risk_sub_category': (
        ['Scope', 'Cost', 'Schedule'],
        ['Design', 'Construction', 'Experiments', 'Infrastructure', 'Environmental', 'Safeguards & Security', 'Quality', 'D&D'],
        ['Worker', 'Public', 'Environment'],
        ['From Public', 'From Stakeholders', 'From DOE']
    ),
    'impacted_wbs_elements': (
        ['C.C.05.52  NRIC-DOME Demonstration of Operational Microreactor Experiments'],

        ['C.C.05.52.10  Common Services',
        'C.C.05.52.10.10  Project Management',
        'C.C.05.52.10.10.10  Project Management',
        'C.C.05.52.10.10.20  Project Reviews'],

        ['C.C.05.52.10.20  Project Documentation',
        'C.C.05.52.10.20.10  Project Docs Control Account Management',
        'C.C.05.52.10.20.20  Mission Need (CD-0)',
        'C.C.05.52.10.20.30  Alternative Analysis (CD-1)',
        'C.C.05.52.10.20.40  Approve Performance Baseline/Start of Construction (CD-2/3)',
        'C.C.05.52.10.20.50  Project Completion (CD-4)',
        'C.C.05.52.10.20.60  PM Documents and Closeout'],

        ['C.C.05.52.10.30  Test Bed Design',
        'C.C.05.52.10.30.10  Design Control Account Management',
        'C.C.05.52.10.30.20  BEA Design Integration',
        'C.C.05.52.10.30.30  Conceptual Design',
        'C.C.05.52.10.30.40  Preliminary Design',
        'C.C.05.52.10.30.50  Final Design',
        'C.C.05.52.10.30.60  QA Strategy/Approach',
        'C.C.05.52.10.30.70  Commissioning Strategy/Approach'],

        ['C.C.05.52.10.40  Environmental',
        'C.C.05.52.10.40.10  Environmental Control Account Management',
        'C.C.05.52.10.40.20  Environmental Compliance Permit (ECP)',
        'C.C.05.52.10.40.30  Environmental Permits and Analyses'],

        ['C.C.05.52.10.50  Nuclear Safety',
        'C.C.05.52.10.50.10  Nuclear Safety Control Account Management',
        'C.C.05.52.10.50.20  Safety Design Strategy',
        'C.C.05.52.10.50.30  Supporting Analyses',
        'C.C.05.52.10.50.40  Preliminary Documented Safety Analysis (PDSA)',
        'C.C.05.52.10.50.50  Final DSA/SAR'],

        ['C.C.05.52.10.60  BEA Construction Integration',
        'C.C.05.52.10.60.10  BEA Construction Follow - Control Account Management',
        'C.C.05.52.10.60.20  BEA Construction Follow - Construction Management',
        'C.C.05.52.10.60.30  BEA Construction Follow - Test and Inspect',
        'C.C.05.52.10.60.40  BEA Construction Follow - Quality',
        'C.C.05.52.10.60.50  BEA Construction Follow - Title III Field Engineering',
        'C.C.05.52.10.60.60  BEA Construction Follow - Security',
        'C.C.05.52.10.60.70  BEA Construction Follow - Facility Operations and Management',
        'C.C.05.52.10.60.80  BEA Construction Follow - General',
        'C.C.05.52.10.60.90  BEA Construction Follow - Commissioning Agent']
    ), 
    'handling_strategy': ['Avoid', 'Mitigate', 'Transfer', 'Accept', 'Exploit', 'Share', 'Enhance'],
    'initial_risk_likelihood': ['Very Unlikely', 'Unlikely', '50/50', 'Likely', 'Very Likely'],
    'residual_risk_likelihood': ['Very Unlikely', 'Unlikely', '50/50', 'Likely', 'Very Likely'],
    'initial_consequence': ['Negligible', 'Marginal', 'Significant', 'Critical/Exceptional', 'Crisis/Outstanding'],
    'residual_consequence': ['Negligible', 'Marginal', 'Significant', 'Critical/Exceptional', 'Crisis/Outstanding']
}