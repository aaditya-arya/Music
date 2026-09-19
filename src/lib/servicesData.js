export const servicesData = [
  {
    id: 1,
    slug: 'tpi',
    title: 'Third Party Inspection (TPI)',
    tagline: 'Independent Witnessing & Hold-Point Quality Surveillance Across Fabrication Stages',
    badge: 'ISO 17020 Compliant',
    image: '/assets/service_tpi.jpg',
    shortDesc: 'Independent witness and hold point inspection ensuring complete compliance with EPC specifications and international codes.',
    overview: 'Akshar Engineering Services provides independent Third-Party Inspection (TPI) services to act as your eyes and ears at vendor manufacturing shops and site installations. Our certified inspectors ensure that materials, fabrication practices, weldments, and final testing strictly conform to approved Quality Assurance Plans (QAP), Inspection and Test Plans (ITP), and statutory codes.',
    standards: ['ASME Sec VIII Div 1 & 2', 'ASME Sec I & IX', 'EN 10204 Type 3.2', 'ISO 9001:2015', 'API 510 / 570', 'AWS D1.1'],
    deliverables: [
      'Comprehensive raw material identification and Positive Material Identification (PMI) witnessing.',
      'Fit-up, dimensional, and weld root inspection before final pass.',
      'Witnessing of non-destructive examination (RT, UT, MPT, DPT) and film interpretation.',
      'Hydrostatic, pneumatic, and helium leak test verification.',
      'Final Inspection Release Note (IRN) sign-off and stamping prior to dispatch.'
    ],
    methodology: [
      { step: '01', title: 'QAP & ITP Vetting', desc: 'Pre-inspection alignment meeting (PIM) to freeze witness/hold points with the manufacturer.' },
      { step: '02', title: 'In-Process Surveillance', desc: 'Stage-wise verification of welding, heat treatment, tolerances, and calibration certificates.' },
      { step: '03', title: 'Final Testing & Punch-Listing', desc: 'Witnessing critical hydro-tests, dimensional layouts, and zero-defect punch-list clearance.' },
      { step: '04', title: 'IRN & Dossier Endorsement', desc: 'Issuance of tamper-proof Inspection Release Note and EN 10204 3.2 certification.' }
    ],
    benefits: [
      'Zero deviation from project specifications and EPC contract terms.',
      'Early detection of manufacturing flaws, preventing costly site rework.',
      'Transparent real-time flash reports delivered within 24 hours of inspection.'
    ]
  },
  {
    id: 2,
    slug: 'vendor-assessment',
    title: 'Vendor Assessment & Capacity Audits',
    tagline: 'Rigorous Technical Capability & Quality System Audits Before Vendor Empanelment',
    badge: 'Supply Chain Assurance',
    image: '/assets/service_vendor_audit.jpg',
    shortDesc: 'Technical capability and quality audits to mitigate supply chain risks and qualify reliable manufacturers.',
    overview: 'Supply chain vulnerabilities can jeopardize major EPC timelines. Akshar Engineering Services conducts comprehensive on-site vendor capability assessments, machine capacity audits, quality management system audits, and financial/technical reliability profiling across domestic and global equipment manufacturers.',
    standards: ['ISO 9001:2015', 'ISO 19011:2018', 'ASME Quality Control System', 'API Q1 / Q2 Spec', 'VDA 6.3 Standards'],
    deliverables: [
      'Detailed shop floor infrastructure, machinery tonnage, and crane capacity audits.',
      'Evaluation of QA/QC calibration logs, certified manpower (ASNT/CSWIP), and welder rosters.',
      'Raw material traceability, storage preservation, and scrap segregation audits.',
      'Sub-vendor control evaluation and historical on-time delivery (OTD) analysis.',
      'Final Vendor Capability Assessment Report with scoring matrix and risk ratings.'
    ],
    methodology: [
      { step: '01', title: 'Desktop Document Audit', desc: 'Review of certifications, shop layouts, design software, and financial health.' },
      { step: '02', title: 'On-Site Shop Floor Audit', desc: 'Direct physical verification of machine capabilities, crane handling, and testing labs.' },
      { step: '03', title: 'Process & Manpower Audit', desc: 'Interviews with QA managers, welders, NDT technicians, and calibration record checks.' },
      { step: '04', title: 'Audit Scorecard & Recommendations', desc: 'Objective categorization: Approved, Conditionally Approved, or Rejected.' }
    ],
    benefits: [
      'Eliminate high-risk and counterfeit vendors from your approved vendor list (AVL).',
      'Benchmark suppliers against global aerospace, nuclear, and oil & gas standards.',
      'Clear roadmap for vendor capacity upskilling and corrective action requests (CAR).'
    ]
  },
  {
    id: 3,
    slug: 'qa-qc-documentation',
    title: 'QA/QC Documentation & MRB Compilation',
    tagline: 'Flawless Manufacturing Record Book (MRB) Compilation & Code Compliance Dossiers',
    badge: 'EN 10204 3.2 Endorsed',
    image: '/assets/service_qa_qc.jpg',
    shortDesc: 'Manufacturing Record Book compilation, inspection reports collation, and EN 10204 3.2 certification.',
    overview: 'A high-pressure vessel or offshore spool is only as good as its documentation. AES specializes in compiling, validating, and certifying end-to-end QA/QC dossiers, Manufacturing Record Books (MRB), Final Inspection Packages, and statutory clearance dossiers for global energy projects.',
    standards: ['EN 10204 3.1 & 3.2', 'ASME Boiler & Pressure Vessel Code', 'PED 2014/68/EU', 'NACE MR0175 / ISO 15156', 'IBR Regulations'],
    deliverables: [
      'Material Test Certificate (MTC) cross-matching with heat numbers and ladle analysis.',
      'WPS, PQR, and Welder Performance Qualification (WPQ) correlation with weld maps.',
      'Collation of NDT reports (RT, UT, MPT, DPT, PMI, Ferrite) signed by certified inspectors.',
      'PWHT time-temperature charts, calibration records, and hydrostatic pressure graphs.',
      'Indexed, digitized, and audit-ready Manufacturing Record Book (MRB).'
    ],
    methodology: [
      { step: '01', title: 'Traceability Indexing', desc: 'Building comprehensive Bill of Materials (BOM) cross-referenced to heat numbers.' },
      { step: '02', title: 'Report Validation', desc: 'Checking chemistry, mechanical tensile/charpy tests against ASME Sec II requirements.' },
      { step: '03', title: 'Third-Party Endorsement', desc: 'Notified Body / TPIA stampings across all 3.2 inspection records.' },
      { step: '04', title: 'Digital Handover', desc: 'Archived PDF package with hyperlinked table of contents for seamless client handover.' }
    ],
    benefits: [
      'Accelerate commercial milestone sign-offs and final invoice clearance.',
      'Zero rejections from EPC consultant technical document control desks.',
      'Permanent digital traceability for future plant audits and insurance renewals.'
    ]
  },
  {
    id: 4,
    slug: 'pre-shipment-inspection',
    title: 'Pre-Shipment Inspection & Dispatch Clearance',
    tagline: 'Final Physical Verification, Protective Packaging, Painting & IRN Sign-Off',
    badge: 'Zero Transit Defect',
    image: '/assets/service_pre_dispatch.jpg',
    shortDesc: 'Final packing, crating, preservation, container stuffing, and Inspection Release Note sign-off.',
    overview: 'Pre-Shipment Inspection (PSI) is the ultimate quality safeguard before finished equipment departs the vendor works. AES ensures that equipment dimensions, blast/paint profile, nitrogen purging, wooden crating, sea-worthy preservation, and container lashing strictly prevent transit damage and corrosion.',
    standards: ['ISPM 15 (Wood Packaging)', 'SSPC / NACE Coating Standards', 'IMO Cargo Lashing Code', 'Client Dispatch Specifications'],
    deliverables: [
      'Final visual and dimensional checks against approved General Arrangement (GA) drawings.',
      'Dry Film Thickness (DFT), adhesion tape test, and holiday testing on painted surfaces.',
      'Flange face preservation, rust preventive coating, and desiccant placement verification.',
      'Wooden crate compliance with ISPM-15 heat treatment markings and vapor barrier lining.',
      'Container stuffing, weight distribution, and cargo securing surveillance.'
    ],
    methodology: [
      { step: '01', title: 'Final Surface & Coating QA', desc: 'Verifying final color shade (RAL), DFT micrometer readings, and zero mechanical scratches.' },
      { step: '02', title: 'Preservation & Blanking', desc: 'Checking machined flange covers, rubber gaskets, silica gel bags, and nitrogen pad gauges.' },
      { step: '03', title: 'Packing & Crate Tagging', desc: 'Validating center-of-gravity markers, lifting lugs, barcode labels, and packing slips.' },
      { step: '04', title: 'Official IRN Clearance', desc: 'Affixing AES security seal and releasing the green Dispatch Clearance Note.' }
    ],
    benefits: [
      'Guarantee cargo arrives at port/site in factory-mint condition without sea-spray corrosion.',
      'Smooth customs clearance with accurate packaging marks and weight certificates.',
      'Protection against costly logistics disputes and insurance claim rejections.'
    ]
  },
  {
    id: 5,
    slug: 'welding-engineering',
    title: 'Welding Engineering & WPS/PQR Qualification',
    tagline: 'Welding Metallurgy, Procedure Qualification Records & Welder Performance Testing',
    badge: 'CSWIP / AWS Certified',
    image: '/assets/service_welding_nde.jpg',
    shortDesc: 'WPS/PQR vetting, welder performance qualification (WPQ), and coupon destructive testing.',
    overview: 'Welding integrity is the foundation of pressure equipment, piping, and structural safety. AES provides end-to-end welding engineering consultancy, Procedure Qualification Record (PQR) development, Welding Procedure Specification (WPS) vetting, and Welder Qualification (WPQ) witness across all arc, TIG, MIG, and SAW processes.',
    standards: ['ASME Section IX', 'AWS D1.1 / D1.6', 'ISO 15614 Series', 'ISO 9606-1 / 9606-2', 'API 1104 Pipelines'],
    deliverables: [
      'Preparation and technical review of preliminary WPS for carbon, stainless, duplex, and nickel alloys.',
      'On-site witnessing of PQR test coupon fit-up, preheat, interpass temperature, and heat input control.',
      'Witnessing of destructive coupon tests (tensile, guided bend, charpy V-notch, hardness, macro-etch).',
      'Welder Performance Qualification (WPQ) test witnessing and Welder ID card issuance.',
      'Welding defect root cause analysis (RCA) and mitigation protocols.'
    ],
    methodology: [
      { step: '01', title: 'Design & Code Analysis', desc: 'Selecting optimum filler wires, shielding gases, and welding parameters for the base metal.' },
      { step: '02', title: 'Test Coupon Witnessing', desc: 'Rigorous logging of voltage, current, travel speed, and interpass heat inputs.' },
      { step: '03', title: 'Lab Mechanical Testing', desc: 'Witnessing coupon mechanical tests at NABL-accredited metallurgical testing laboratories.' },
      { step: '04', title: 'PQR & WPS Endorsement', desc: 'Formal stamping and approval of code-compliant WPS/PQR dossiers.' }
    ],
    benefits: [
      'Achieve 100% first-time weld clearance on high-alloy and heavy-wall weldments.',
      'Mitigate hydrogen-induced cracking, reheat cracking, and micro-structural distortion.',
      'Ensure strict adherence to client specification and international pressure vessel codes.'
    ]
  },
  {
    id: 6,
    slug: 'ndt-inspection',
    title: 'NDT Inspection (UT, RT, MPT, DPT, PMI)',
    tagline: 'Volumetric & Surface Flaw Detection by Certified ASNT & PCN Level II/III Specialists',
    badge: 'ASNT Level II / III',
    image: '/assets/service_ndt_flaw.jpg',
    shortDesc: 'ASNT Level II & III volumetric and surface testing (UT, RT, MPT, DPT, PMI, Ferrite).',
    overview: 'AES delivers advanced Non-Destructive Testing (NDT) surveillance and audit services. Our ASNT Level III and II certified engineers perform, witness, and cross-evaluate radiographic film interpretation, ultrasonic thickness/flaw scans, magnetic particle testing, dye penetrant inspection, and PMI alloy verification.',
    standards: ['ASME Section V (NDT)', 'ASNT SNT-TC-1A', 'ISO 9712', 'ASTM E165, E709, E1444', 'API 570 / 510 NDE Rules'],
    deliverables: [
      'Radiographic Testing (RT) film interpretation with density checks and sensitivity audits.',
      'Ultrasonic Testing (UT) for weld seams, plate lamination, and thickness gauging.',
      'Magnetic Particle Testing (MPT) for surface and sub-surface cracks on ferromagnetic steels.',
      'Liquid Penetrant Testing (DPT) for non-porous materials, austenitic stainless steels, and welds.',
      'XRF / Optical Emission Positive Material Identification (PMI) and Ferrite Content measurement.'
    ],
    methodology: [
      { step: '01', title: 'Procedure Calibration', desc: 'Verification of NDT procedures, probe calibration blocks, and equipment valid certification.' },
      { step: '02', title: 'Execution & Witnessing', desc: 'Conducting or witnessing flaw detection scans according to acceptance criteria.' },
      { step: '03', title: 'Defect Evaluation', desc: 'Accurate sizing, mapping, and categorization of flaws against ASME Section VIII Div 1.' },
      { step: '04', title: 'Technical NDT Report', desc: 'Detailed test report with defect sketches, indication logs, and disposition advice.' }
    ],
    benefits: [
      'Reliable detection of planar flaws, lack of fusion, inclusions, and fatigue cracks.',
      'High-resolution PMI alloy sorting prevents costly grade mix-ups during fabrication.',
      'Certified ASNT Level III procedure approvals and dispute resolution.'
    ]
  },
  {
    id: 7,
    slug: 'expediting',
    title: 'Expediting & Production Tracking',
    tagline: 'Active On-Site Procurement Surveillance to Guarantee On-Time EPC Project Delivery',
    badge: 'Schedule Recovery',
    image: '/assets/service_expediting.jpg',
    shortDesc: 'On-site bottleneck resolution, material supply tracking, and procurement schedule recovery.',
    overview: 'Delayed equipment delivery disrupts site commissioning and causes cascading liquidated damages. AES expeditors conduct proactive, on-the-ground interventions at vendor manufacturing plants to track raw material procurement, foundry casting schedules, machining bottlenecks, and hydro-test milestones.',
    standards: ['Project Master Schedule (Level 3/4)', 'CPA (Critical Path Analysis)', 'ISO 9001 Expediting Protocols'],
    deliverables: [
      'Verification of sub-supplier purchase order placements and raw material delivery dates.',
      'Shop floor physical progress audits versus planned milestone schedules (Earned Value).',
      'Early bottleneck identification: machining backlog, NDT delays, or heat-treatment queues.',
      'Root-cause delay analysis and collaborative recovery schedule formulations.',
      'Weekly/Bi-weekly detailed Expediting Status Reports with photographic evidence.'
    ],
    methodology: [
      { step: '01', title: 'Baseline Schedule Alignment', desc: 'Breaking down manufacturing milestones into verifiable weekly hold points.' },
      { step: '02', title: 'Unannounced Shop Floor Visits', desc: 'Physical verification of material stock, sub-assembly progress, and manpower allocation.' },
      { step: '03', title: 'Bottleneck Elimination', desc: 'Direct engagement with vendor management to resolve supply or design hold-ups.' },
      { step: '04', title: 'Real-Time Schedule Forecasting', desc: 'Providing EPC management with accurate dispatch forecasts and risk mitigation plans.' }
    ],
    benefits: [
      'Mitigate project cost overruns by maintaining on-time critical equipment delivery.',
      'Transparent milestone tracking eliminates vendor over-promising and schedule surprises.',
      'Seamless integration between procurement desks, site engineers, and manufacturing plants.'
    ]
  },
  {
    id: 8,
    slug: 'design-examination',
    title: 'Design Examination & Calculation Vetting',
    tagline: 'ASME Section VIII, PD 5500, TEMA & EN 13445 Structural & Thermal Engineering Review',
    badge: 'Code Integrity',
    image: '/assets/service_design_calc.jpg',
    shortDesc: 'ASME Section VIII, PD 5500, and TEMA pressure vessel calculation review and GA drawing vetting.',
    overview: 'Before steel is cut, design calculations must be verified for statutory and mechanical integrity. AES provides third-party design examination, finite element analysis (FEA) verification, and mechanical calculation vetting for pressure vessels, heat exchangers, storage tanks, and structural skids.',
    standards: ['ASME Section VIII Div 1 & Div 2', 'TEMA Standards (RCB)', 'EN 13445 Pressure Vessels', 'PD 5500 Specification', 'API 650 & API 620'],
    deliverables: [
      'Shell, head, nozzle reinforcement, and flange rating thickness calculations vetting.',
      'Wind, seismic, nozzle external load, and lifting lug mechanical stress calculations review.',
      'Heat exchanger tubesheet, baffle spacing, and vibration analysis verification.',
      'General Arrangement (GA), fabrication detail, and nozzle orientation drawing approvals.',
      'Design Verification Certificate and compliance report with statutory design codes.'
    ],
    methodology: [
      { step: '01', title: 'Design Basis Document Review', desc: 'Vetting operating pressure, design temperature, corrosion allowances, and wind zones.' },
      { step: '02', title: 'Independent Calculation Checks', desc: 'Cross-verifying software outputs (PV Elite, Compress) with hand calculations and code equations.' },
      { step: '03', title: 'Drawing & Welding Details Audit', desc: 'Checking weld joint efficiencies, nozzle weld details, and PWHT requirements.' },
      { step: '04', title: 'Design Approval Endorsement', desc: 'Issuance of formal Design Approval Dossier endorsed by Chartered Engineers.' }
    ],
    benefits: [
      'Eliminate material over-design or dangerous under-sizing prior to steel procurement.',
      'Ensure 100% compliance with client specifications and local regulatory authorities.',
      'Prevent costly redesigns and manufacturing rejections during shop fabrication.'
    ]
  },
  {
    id: 9,
    slug: 'project-shutdown-qa',
    title: 'Project & Plant Shutdown QA',
    tagline: '24/7 Rapid-Response Quality Assurance & Asset Integrity for Refinery & Plant Turnarounds',
    badge: 'Zero Downtime',
    image: '/assets/service_plant_shutdown.jpg',
    shortDesc: 'Fast-turnaround surveillance for refinery and chemical plant integrity during critical turnarounds.',
    overview: 'Industrial plant turnarounds and maintenance shutdowns operate under tight round-the-clock schedules where every hour counts. AES deploys dedicated task forces of senior inspection engineers to provide 24/7 quality surveillance on column revamps, piping replacements, heat exchanger retubing, and boiler overhauls.',
    standards: ['API 510 (Vessel Inspection)', 'API 570 (Piping Inspection)', 'API 653 (Tank Inspection)', 'ASME PCC-2 (Repair of Pressure Equipment)'],
    deliverables: [
      'Internal visual and endoscopic inspection of towers, reactors, boilers, and furnaces.',
      'Corrosion mapping, remaining wall thickness calculation, and degradation profiling.',
      'Witnessing weld overlay, nozzle modifications, and hot-tap repair operations.',
      'Bolt torquing, gasket seating, and flange face clearance sign-offs.',
      'Final hydro-testing, pneumatic tightness witness, and box-up certification.'
    ],
    methodology: [
      { step: '01', title: 'Pre-Shutdown Planning', desc: 'Drafting shutdown inspection matrices, safety work permits, and mobilization rosters.' },
      { step: '02', title: '24/7 Shift Surveillance', desc: 'Continuous on-site day/night shift monitoring of welding, NDT, and mechanical repairs.' },
      { step: '03', title: 'Critical Hold-Point Sign-Off', desc: 'Immediate witnessing of hydro-tests, torque checks, and blind list removals.' },
      { step: '04', title: 'Turnaround Close-Out Dossier', desc: 'Handover of certified box-up clearance and updated equipment history records.' }
    ],
    benefits: [
      'Achieve zero post-startup leaks and avoid emergency plant shutdowns.',
      'Complete turnaround inspections within scheduled shutdown windows.',
      'Comprehensive remaining life assessment for predictive maintenance scheduling.'
    ]
  },
  {
    id: 10,
    slug: 'international-sourcing',
    title: 'International Sourcing QA Surveillance',
    tagline: 'Global Factory Acceptance Testing (FAT) & Vendor Quality Audits Across Continents',
    badge: 'Global Reach',
    image: '/assets/service_global_sourcing.jpg',
    shortDesc: 'Overseas vendor quality surveillance and factory acceptance test (FAT) audits worldwide.',
    overview: 'Sourcing specialized valves, forgings, alloy pipes, and turbine components from overseas manufacturers introduces distance, language, and cultural quality barriers. AES provides boots-on-the-ground surveillance across international manufacturing hubs (Middle East, Europe, East Asia, and USA) to safeguard quality.',
    standards: ['ISO 17020 Global Norms', 'IEC / IEEE Standards', 'EN & DIN International Codes', 'Client Global Sourcing Specs'],
    deliverables: [
      'On-site Factory Acceptance Testing (FAT) witnessing for pumps, compressors, and electrical panels.',
      'Material traceability and mill test report (MTR) authentication for imported forgings.',
      'Valve cryogenic, fire-safe (API 607/6FA), and fugitive emission (ISO 15848-1) test witnessing.',
      'Overseas packaging and export sea-container stuffing surveillance.',
      'Daily multi-lingual flash reporting and real-time client coordination.'
    ],
    methodology: [
      { step: '01', title: 'Pre-Inspection Alignment', desc: 'Reviewing foreign manufacturer drawings and aligning acceptance criteria with international standards.' },
      { step: '02', title: 'Factory Visit & Inspection', desc: 'Direct physical presence during critical casting, machining, assembly, and FAT stages.' },
      { step: '03', title: 'Non-Conformance Resolution', desc: 'Issuing real-time NCRs and monitoring corrective actions on the factory floor.' },
      { step: '04', title: 'Export Clearance Release', desc: 'Final seal application and release of international shipping authorization dossier.' }
    ],
    benefits: [
      'Eliminate the high cost and travel burden of sending your internal team overseas.',
      'Ensure imported equipment complies with your domestic statutory and engineering standards.',
      'Protect your capital investments from unapproved material substitutions.'
    ]
  },
  {
    id: 11,
    slug: 'performance-hydro-tests',
    title: 'Performance & Hydrostatic Pressure Testing',
    tagline: 'Proof Testing, Proof Load Testing, Pump Performance & Helium Leak Test Surveillance',
    badge: 'Pressure Proof',
    image: '/assets/service_hydrotest.jpg',
    shortDesc: 'Hydrostatic pressure, pneumatic proof testing, and pump performance curve witness testing.',
    overview: 'Hydrostatic and performance tests are the most critical safety verification stages for pressurized systems and rotating equipment. AES inspectors witness and certify hydrostatic pressure tests, pneumatic proof tests, vacuum hold tests, and pump performance curve validations under strict safety protocols.',
    standards: ['ASME Boiler & Pressure Vessel Code', 'API 610 (Centrifugal Pumps)', 'API 598 (Valve Inspection & Testing)', 'ISO 9906 (Hydraulic Performance)'],
    deliverables: [
      'Verification of test water chloride content, temperature, and test gauge calibration records.',
      'Monitoring pressure step-up increments, hold durations, and visual leak inspections.',
      'Pump flow rate, head, power consumption, and vibration/bearing temperature curve recording.',
      'Valve seat leakage, shell hydro-test, and back-seat pressure verification.',
      'Certified Pressure Test Chart, Test Dossier, and Pass Certification.'
    ],
    methodology: [
      { step: '01', title: 'Test Manifold & Gauge Check', desc: 'Inspecting dual calibrated pressure gauges, relief valves, and blind flange ratings.' },
      { step: '02', title: 'Pressurization Surveillance', desc: 'Witnessing 1.3x to 1.5x design pressure hold cycles with continuous recording.' },
      { step: '03', title: 'Comprehensive 360° Leak Check', desc: 'Close examination of all weld seams, flange joints, and nozzle connections for sweating/leaks.' },
      { step: '04', title: 'Depressurization & Drain QA', desc: 'Verifying vacuum breaker venting, complete drainage, and internal drying.' }
    ],
    benefits: [
      'Prevent catastrophic pressure boundary failures and hazardous fluid leaks during startup.',
      'Accurate calibration guarantees equipment performance curves match guaranteed EPC ratings.',
      'Official third-party certified hydro-test charts recognized by insurance and statutory bodies.'
    ]
  },
  {
    id: 12,
    slug: 'process-qualification',
    title: 'Process Qualification & Surface Protection QA',
    tagline: 'PWHT Thermal Profiling, Blast Profile & NACE Coating/Corrosion Protection Audits',
    badge: 'NACE / SSPC Standards',
    image: '/assets/service_coating.jpg',
    shortDesc: 'PWHT time-temperature calibration, NACE coating, and surface blast profile checks.',
    overview: 'Thermal and surface treatment processes directly govern equipment fatigue life and corrosion resistance in sour environments. AES provides specialized surveillance for Post Weld Heat Treatment (PWHT), blast cleaning surface profile inspection, thermal spray aluminium (TSA), and multi-coat paint systems.',
    standards: ['ASME Section VIII Div 1 (PWHT)', 'NACE CIP / SSPC-SP 10 (Near-White Metal)', 'ISO 8501-1 / ISO 8502', 'ASTM D4417 & ASTM D4541 (Adhesion)'],
    deliverables: [
      'PWHT thermocouple layout, rate of heating/cooling, and soak time-temperature chart audits.',
      'Surface cleanliness and surface roughness profile (anchor pattern) micrometer verification.',
      'Ambient conditions monitoring: relative humidity, dew point, and steel substrate temperature.',
      'Wet Film Thickness (WFT), Dry Film Thickness (DFT), and cross-cut adhesion pull-off testing.',
      'Holiday porosity spark testing on internal tank and pipe lining.'
    ],
    methodology: [
      { step: '01', title: 'Pre-Treatment Verification', desc: 'Calibrating heat treatment recorders and testing abrasive blast grit cleanliness.' },
      { step: '02', title: 'In-Process Thermal/Blast QA', desc: 'Continuous tracking of heating profiles or blast profile anchor depth (50-75 microns).' },
      { step: '03', title: 'Coating Layer-by-Layer QA', desc: 'Inspecting primer, intermediate, and topcoat curing, DFT, and over-coating intervals.' },
      { step: '04', title: 'Final Certification Dossier', desc: 'Endorsing thermal treatment records and NACE-compliant surface protection passports.' }
    ],
    benefits: [
      'Eliminate stress corrosion cracking (SCC) through verified PWHT stress relief.',
      'Maximize asset lifespan in aggressive offshore, marine, and chemical atmospheres.',
      'Prevent premature coating delamination, blistering, and corrosion under insulation (CUI).'
    ]
  },
  {
    id: 13,
    slug: 'api-tank-inspection',
    title: 'API 650/653 Storage Tank Inspection',
    tagline: 'Storage Tank Erection, Vacuum Box Testing, Settlement Surveys & Out-of-Roundness QA',
    badge: 'API 650 / 653 Certified',
    image: '/assets/service_api_tank.jpg',
    shortDesc: 'API 650/653 storage tank erection, vacuum box, settlement surveys, and floating roof QA.',
    overview: 'Atmospheric and low-pressure storage tanks for petroleum, chemicals, and water require specialized dimensional and weld integrity surveillance. AES provides certified API tank inspection for new tank construction (API 650/620) and in-service repair/maintenance integrity assessments (API 653).',
    standards: ['API 650 (Welded Tanks for Oil Storage)', 'API 653 (Tank Inspection, Repair & Alteration)', 'API 620 (Low-Pressure Storage Tanks)', 'API 2000 (Venting Requirements)'],
    deliverables: [
      'Annular plate, bottom sketch plate fit-up, and vacuum box weld seam testing.',
      'Shell course plumbness, peaking/banding, and roundness optical laser surveys.',
      'Floating roof seal, pontoons, guide poles, and roof drainage slope inspection.',
      'Hydro-test settlement survey (edge settlement, tilt, and bottom dish deflection monitoring).',
      'Final Tank Calibration, Quality Dossier, and Integrity Clearance Certificate.'
    ],
    methodology: [
      { step: '01', title: 'Foundation & Bottom Plate QA', desc: 'Verifying concrete ring-wall levels, bitumen sand cushion, and bottom lap weld vacuum testing.' },
      { step: '02', title: 'Shell Erection & Welding QA', desc: 'Monitoring vertical/horizontal seam fit-ups, back-gouging, and RT/UT examination.' },
      { step: '03', title: 'Roof & Accessories Inspection', desc: 'Inspecting fixed cone/dome roof rafters, floating roof seals, and stairways.' },
      { step: '04', title: 'Full Hydrostatic Test & Settlement', desc: 'Recording settlement levels during full water fill, 24-hour hold, and dewatering.' }
    ],
    benefits: [
      'Ensure total containment safety and prevent catastrophic tank ruptures or soil seepage.',
      'Guarantee shell verticality and floating roof smooth travel without binding.',
      'Complete compliance with statutory environmental and explosive safety regulations.'
    ]
  },
  {
    id: 14,
    slug: 'owners-engineer',
    title: "Owner's Engineer & EPC Technical Oversight",
    tagline: 'Direct Client Representation, Design Vetting & EPC Quality Surveillance On-Site',
    badge: 'Executive Oversight',
    image: '/assets/service_civil_renew.jpg',
    shortDesc: 'Direct client technical representation, EPC contractor oversight, and milestone verification.',
    overview: 'As your Owner’s Engineer, AES acts as your dedicated technical representative and fiduciary guardian across major capital project lifecycles. We review EPC contractor designs, audit quality systems on site, resolve engineering claims, and ensure project execution meets your exact financial and quality goals.',
    standards: ['FIDIC Contract Conditions', 'Project Specific Basis of Design', 'ISO 9001 / ISO 14001 / ISO 45001', 'International EPC Best Practices'],
    deliverables: [
      'Technical evaluation of EPC bids, contractor claims, and change order requests.',
      'Comprehensive design vetting and interface management across civil, mechanical, and piping.',
      'On-site field quality surveillance, safety audits, and milestone completion audits.',
      'Participation in Hazard and Operability (HAZOP) studies and model reviews.',
      'Independent executive monthly progress and risk mitigation reporting to project sponsors.'
    ],
    methodology: [
      { step: '01', title: 'Project Charter & Governance', desc: 'Establishing clear quality metrics, communication protocols, and review timelines.' },
      { step: '02', title: 'Engineering & Design Review', desc: 'Rigorous vetting of contractor calculations, GA drawings, and equipment specs.' },
      { step: '03', title: 'Continuous Site Surveillance', desc: 'Resident engineers monitoring site fabrication, erection, alignment, and testing.' },
      { step: '04', title: 'Commissioning & Handover QA', desc: 'Witnessing performance guarantee tests and punch-list closeouts prior to commercial handover.' }
    ],
    benefits: [
      'Protect project CAPEX by avoiding unmerited contractor variation claims.',
      'Ensure facility is constructed with high-tier materials for decades of trouble-free operation.',
      'Bridge the gap between executive owners and field contractors with unbiased technical authority.'
    ]
  },
  {
    id: 15,
    slug: 'process-piping',
    title: 'Process Piping (ASME B31.3) Inspection',
    tagline: 'Spool Fabrication, Flange Alignment, Torque Witnessing & Hydro-Test Clearance',
    badge: 'ASME B31.3 Compliant',
    image: '/assets/service_piping_spool.jpg',
    shortDesc: 'ASME B31.3 spool fit-up, torque witness, weld mapping, and hydro-testing surveillance.',
    overview: 'High-pressure chemical, cryogenic, and refinery process piping networks demand zero-defect fabrication and erection. AES provides comprehensive inspection across isometric drawings, spool fabrication, pipe support installation, flange bolt torquing, weld mapping, and hydro-test pack clearance under ASME B31.3.',
    standards: ['ASME B31.3 (Process Piping)', 'ASME B31.1 (Power Piping)', 'ASME B16.5 & B16.47 (Flanges)', 'API 570 (Piping Inspection Code)'],
    deliverables: [
      'Piping isometric drawing cross-matching, spool dimension, and material grade verification.',
      'Weld fit-up, root gap, purge gas monitoring, and final visual inspection.',
      'Radiography and ultrasonic testing cross-interpretation for normal and severe cyclic fluid service.',
      'Flange face finish, gasket rating, and bolt torque sequence witnessing.',
      'Test pack compilation, blind list management, and hydro-test sign-off.'
    ],
    methodology: [
      { step: '01', title: 'Shop Spool Fabrication QA', desc: 'Verifying pipe bevels, branch reinforcements (Weldolets), and spool tolerances.' },
      { step: '02', title: 'Weld Traceability Mapping', desc: 'Assigning welder IDs, heat numbers, and NDT percentages to every isometric spool joint.' },
      { step: '03', title: 'Field Erection & Support QA', desc: 'Checking pipe slopes, spring hanger presets, expansion loops, and anchor points.' },
      { step: '04', title: 'Test Pack & Hydro-Test Clearance', desc: 'Isolating test boundaries, witnessing test pressure holds, and line reinstatement.' }
    ],
    benefits: [
      'Eliminate flange leaks, gasket blowouts, and pipe alignment stresses on connected pumps.',
      '100% auditable weld maps and NDT records for statutory plant licensing.',
      'Fast-track piping test pack sign-offs to accelerate plant pre-commissioning.'
    ]
  },
  {
    id: 16,
    slug: 'training',
    title: 'QA/QC & ASNT NDT Training Programs',
    tagline: 'Upskilling Industrial Engineers with Practical ASNT Level II & Welding Inspection Certifications',
    badge: 'Industry Certified',
    image: '/assets/service_ndt_training.jpg',
    shortDesc: 'Corporate technical upskilling and certification in NDT, welding inspection, and ISO auditing.',
    overview: 'High-performing engineering organizations require continuous technical upskilling. AES provides certified corporate and individual training programs in Non-Destructive Testing (ASNT Level II in UT/RT/MPT/DPT), Welding Inspection, ASME Boiler & Pressure Vessel Codes, and ISO 9001/17020 Quality Auditing.',
    standards: ['ASNT SNT-TC-1A Guidelines', 'ISO 9712 NDT Framework', 'ASME & AWS Codes', 'ISO 9001:2015 & ISO 17020:2012 Standards'],
    deliverables: [
      'Comprehensive theoretical classroom and intensive hands-on practical defect scanning sessions.',
      'Flaw detection on custom flawed weld specimens with calibrated flaw detectors.',
      'ASNT Level II Examination (General, Specific, and Practical) conducted by ASNT Level III examiners.',
      'Course manual, code reference handbook, and official Training Completion Certificate.',
      'Corporate in-house customized curriculum tailored to your specific product lines.'
    ],
    methodology: [
      { step: '01', title: 'Curriculum Tailoring', desc: 'Customizing training modules to match your industry equipment (pressure vessels, piping, or casting).' },
      { step: '02', title: 'Classroom Theory & Physics', desc: 'Deep-dive into acoustic physics, radiation safety, magnetic flux behavior, and code formulas.' },
      { step: '03', title: 'Hands-On Flaw Scanning', desc: 'Extensive practical hours on actual industrial flawed coupons, UT calibration, and RT film viewing.' },
      { step: '04', title: 'Rigorous Level II Exam', desc: 'Proctored examination and issuance of internationally recognized certification.' }
    ],
    benefits: [
      'Build internal QA/QC competence, reducing reliance on expensive external consultants.',
      'Empower your inspectors to detect fabrication flaws accurately and avoid client rejections.',
      'Official credentials that enhance your corporate pre-qualification profiles with EPC clients.'
    ]
  }
];

export function getServiceBySlug(slug) {
  return servicesData.find(s => s.slug === slug) || servicesData[0];
}
