import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

export const LanguageContext = createContext({
  lang: 'en',
  setLang: () => {},
  t: (key, fallback) => fallback || key,
  formatNumber: (n) => String(n),
  formatCurrency: (n) => `Rs. ${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
});

export const TRANSLATIONS = {
  en: {
    // Header & Navigation
    app_name: 'Financial Pilot',
    hero_badge: 'The AI Financial Co-Pilot for Growing Businesses',
    hero_title_1: 'Stop Flying Blind on Your',
    hero_title_2: 'Financial Runway',
    hero_banner_title_1: 'The AI Financial Co-Pilot for',
    hero_banner_title_2: 'Growing Businesses',
    btn_view_cash_forecast: 'View Cash Forecast',
    btn_calc_credit_score: 'Calculate Credit Score',
    hero_subtitle: 'Financial Pilot gives you real-time cash flow forecasting, business credit readiness scoring, anomaly detection, and Gemini-powered executive explanations — all in one unified platform.',
    hero_launch_dashboard: 'Launch Live Dashboard',
    hero_explore_forecast: 'Explore Forecast Engine',
    nav_dashboard: 'Morning Dashboard',
    nav_cash_flow: 'Cash Flow Forecaster',
    nav_credit_score: 'Credit Readiness Score',
    nav_scenario: 'Scenario Planner',
    nav_whatsapp: 'WhatsApp Collection Agent',
    nav_anomaly: 'Anomaly & Fraud Guard',
    nav_tax: 'Tax & Compliance Assistant',
    nav_accountant: 'Accountant & Lender Portal',
    nav_inventory: 'Inventory Alerts',
    nav_pricing: 'Pricing Advisor',
    nav_negotiation: 'Negotiation Copilot',
    crisis_mode: 'Crisis Mode',
    crisis_injecting: 'Injecting...',
    reset_data: 'Reset',
    syncing: 'Syncing...',
    scan_invoice: 'Scan',
    launch_hub: 'Launch Hub',
    menu_open: 'Menu',
    group_cash: 'Cash & Financial Health',
    group_compliance: 'Compliance & Governance',
    group_supply: 'Supply Chain & Commerce',
    badge_core: 'Core Engine',
    badge_security: 'Security Shield',
    badge_growth: 'Growth & Margin',
    desc_dashboard: '7/30/90-day cash summary cards & daily runway health',
    desc_cash_flow: '30/60/90-day cash trajectory projection with volatility modeling',
    desc_credit_score: '0–100 bankability score with 4 underwriting pillars & Gemini tips',
    desc_scenario: 'Monte Carlo what-if cash flow simulation models',
    desc_whatsapp: 'AI-automated overdue follow-ups & 1-click cash reconciliation',
    desc_anomaly: 'Detect suspicious transactions & duplicate invoices',
    desc_tax: 'Sales tax calculation, dynamic quarterly reserve estimator & filing calendar',
    desc_accountant: 'Read-only financial view, auditor verification & 1-click PDF lender dossier',
    desc_inventory: 'Low stock warnings & automated reorder thresholds',
    desc_pricing: 'Margin optimization & price elasticity analysis',
    desc_negotiation: 'AI-generated supplier negotiation briefs',
    desc_procure: 'Supplier spend intelligence & lead-time analytics',
    trusted_brands: "Trusted by Pakistan's leading textile & retail enterprises",

    // Section Header & Hub
    live_engine_status: 'Live Data Engine • Python Backend Connected',
    real_time_financial: 'Real-Time Financial',
    intelligence_hub: 'Intelligence Hub',
    live_metrics_calc: 'Live metrics calculated directly by Pandas from your local CSV data contracts, paired with instant Gemini AI executive analysis.',

    // Low Cash Warning Banner
    low_cash_title: 'Low Cash Reserve Warning',
    action_required: 'Action Required',
    low_cash_desc_prefix: 'Projected cash dips below $5,000 threshold on',
    low_cash_desc_suffix: '. Click here to open the Cash Flow Forecaster and view runway trajectory.',
    inspect_runway: 'Inspect Runway',

    // Controls: Horizon Selector
    forecast_horizon: 'Forecast Horizon:',
    days_ahead: 'Days Ahead',

    // Cross-Module Quick Jump Hub
    module_anomaly: 'Anomaly Guard',
    module_anomaly_sub: 'Duplicate & outlier audit',
    module_tax: 'Tax Assistant',
    module_tax_sub: 'Deductions & CPA memo',
    module_scenario: 'Scenario Planner',
    module_scenario_sub: 'Sales, hiring & price shocks',
    module_accountant: 'Accountant Portal',
    module_accountant_sub: 'Auditor & Lender exports',
    module_whatsapp: 'WhatsApp Agent',
    module_whatsapp_sub: 'Overdue reminders & cash',
    badge_flags: 'Flags',
    badge_active: 'Active',
    badge_due: 'Due',
    badge_monte_carlo: 'Monte Carlo',
    badge_gaap: 'GAAP Certified',
    badge_ai_collections: 'AI Collections',

    // Quick Drawer Links
    quick_tools: 'Quick Navigation & Tools',
    live_engines: 'Live Underwriting Engines',
    forecaster_tool: 'Forecaster',
    forecaster_sub: '30-90d projection',
    score_engine_tool: 'Score Engine',
    score_engine_sub: 'Bankability 0-100',
    scenario_tool: 'Scenario Planner',
    scenario_sub: 'Monte Carlo models',
    fraud_guard_tool: 'Fraud Guard',
    fraud_sub: 'Duplicate invoice AI',
    tax_assistant_tool: 'Tax Assistant',
    tax_sub: 'Quarterly reserves',
    accountant_tool: 'Accountant Portal',
    accountant_sub: 'Auditor & Lender exports',
    whatsapp_tool: 'WhatsApp Agent',
    whatsapp_sub: 'Overdue reminders & cash',

    // Dashboard Metrics Cards
    starting_cash: 'Starting Cash',
    current_liquid_pos: 'Current liquid position',
    projected: 'Projected',
    projected_end_bal: 'Projected end balance',
    daily_avg_inflow: 'Daily Avg Inflow',
    historical_90d: 'Historical 90d baseline',
    pending_invoices: 'Pending Invoices',
    unpaid_bills: 'Unpaid & overdue bills',
    day_window: 'Day Window',
    cash_trajectory: 'Projected Cash Trajectory',
    cash_trajectory_desc: 'Daily net income vs expense flow projection',
    buffer_threshold: 'Red dashed indicator = $5,000 liquidity buffer threshold',
    detailed_simulation: 'Detailed 90-Day Simulation',
    credit_readiness: 'Credit Readiness',
    composite_score: 'Composite Readiness Score',
    view_pillars_tips: 'View 4 Underwriting Pillars & Tips',
    underwriting_desc: 'Based on historical cash consistency, operating profit margins, invoice turn, and cost control.',
    score_factors_title: 'Score Factor Breakdown',
    score_factors_desc: 'The four core underwriting pillars measured by Financial Pilot',
    revenue_consistency: 'Revenue Consistency',
    profit_margin: 'Profit Margin',
    payment_behavior: 'Payment Behavior',
    expense_control: 'Expense Control',
    grade: 'Grade',
    pts: 'pts',
    gemini_insights_title: 'Gemini AI Financial Co-Pilot Insights',
    gemini_insights_desc: 'Live contextual explanation synthesized from your numbers',
    cash_exec_summary: 'Cash Flow Executive Summary:',
    credit_opt_tips: 'Credit Score Optimization Tips:',
    ai_connecting: 'AI analysis connecting...',

    // Risk Banner
    risk_priority_alert: '🚨 Autonomous Priority Alert',
    risk_signal_alert: '⚡ Actionable Risk Signal',
    threshold_breach_on: 'Threshold breach on:',
    high_severity_anomalies: 'High-Severity Anomalies',
    modal_agent_draft: 'Autonomous Agent Collection Draft',
    modal_gemini_synth: 'Gemini Synthesized',
    modal_debt_settlement: 'Automated debt settlement notice with early-pay discount & wire routing',
    modal_notice_success: 'Notice successfully queued and transmitted to target accounts payable server!',
    modal_recipient: 'Recipient (AP Contact):',
    modal_target_invoice: 'Target Invoice & Value:',
    modal_subject: 'Subject Line:',
    modal_body_title: 'Executive Email Body (Editable):',
    modal_wire_incentive: 'Includes 2% wire settlement incentive',
    modal_copied_draft: '✓ Copied Draft',
    modal_copy_text: 'Copy Text',
    modal_download_txt: 'Download .txt',
    modal_cancel: 'Cancel',
    modal_transmit: '⚡ Transmit Notice',

    // Modal navigation
    home_landing: 'Home Landing',
    ocr_invoice_scanner: 'OCR Invoice Scanner',
    api_docs: 'FastAPI Backend Docs',
    lender_dossier: 'Lender Dossier',
    reset_demo_data: 'Reset Demo Data',
    launch_hub_arrow: 'Launch Financial Pilot Hub →',
    complete_financial_suite: 'Complete Financial Suite',
    live: 'Live',
    active_state: 'Active',

    // WhatsApp Collector
    whatsapp_title: 'WhatsApp Debt Collection Agent',
    whatsapp_badge: 'Autonomous Accounts Receivable',
    whatsapp_desc: 'Automated accounts receivable follow-ups powered by Gemini AI. Preview polite, tailored reminder copy, launch direct WhatsApp Click-to-Chat intent links, and instantly reconcile payments into your cash flow ledger.',
    refresh_queue: 'Refresh Queue',
    total_overdue: 'Total Overdue Capital',
    outstanding_receivables: 'Outstanding past-due receivables',
    active_clients: 'Active Pending Clients',
    pending_invoices_queue: 'total pending invoices in queue',
    avg_overdue: 'Avg. Days Overdue',
    delinquency_velocity: 'Delinquency velocity',
    days_overdue: 'days overdue',
    days: 'days',
    reconciled_session: 'Reconciled This Session',
    invoices_cleared: 'invoices cleared to cash',
    active_collection_targets: 'Active Collection Targets',
    targets: 'targets',
    send_all_reminders: '🚀 Send All Reminders',
    dispatching: 'Dispatching...',
    table_desc: 'Click "Send WhatsApp Reminder" to preview and dispatch tailored Gemini message links.',
    search_placeholder: 'Search client or invoice...',
    col_client: 'Client Name',
    col_invoice: 'Invoice ID',
    col_amount: 'Amount',
    col_due_date: 'Due Date',
    col_status: 'Status Badge',
    col_actions: 'Actions',
    btn_auto_send: 'Auto-Send',
    btn_auto_send_bot: 'Auto-Send Headless',
    open_manual: 'Manual Link',
    btn_send_whatsapp: 'Send WhatsApp Reminder',
    btn_resend_whatsapp: 'Resend WhatsApp',
    btn_mark_paid: 'Mark as Paid',
    btn_reconciling: 'Reconciling...',
    status_overdue: 'Overdue',
    status_dispatched: 'Dispatched',
    all_reconciled: 'All Invoices Fully Reconciled',
    no_overdue_found: 'No active overdue balances found. Your accounts receivable ledger is completely up to date.',
    clear_filter: 'Clear search filter',
    batch_dispatched_toast: '🚀 Batch dispatch executed! All active reminders marked as Dispatched via WhatsApp queue.',

    // WhatsApp Device Linking
    conn_status_connected: 'Connected Dispatcher',
    conn_status_disconnected: 'No Device Linked',
    btn_connect_whatsapp: '📲 Connect WhatsApp',
    btn_switch_device: 'Switch Device',
    btn_unlink_device: 'Unlink',
    conn_active_sub: 'All reminders dispatch headlessly from this WhatsApp number',
    conn_inactive_sub: 'Connect your mobile WhatsApp to dispatch automated reminders',
    connect_modal_title: 'Connect WhatsApp Sender Account',
    connect_modal_subtitle: 'Scan the QR code with WhatsApp on your phone to link your account.',
    step_1_title: 'Open WhatsApp',
    step_1_desc: 'Open WhatsApp on your phone and tap Menu (⋮) or Settings',
    step_2_title: 'Linked Devices',
    step_2_desc: 'Tap Linked Devices > Link a Device',
    step_3_title: 'Scan QR Code',
    step_3_desc: 'Point your camera at this screen to scan the QR code',
    phone_label_custom: 'Or link phone number directly:',
    btn_confirm_device_linked: '✓ Activate & Link Device',
    qr_refreshing: 'Refreshing QR code...',
    btn_refresh_qr: 'Refresh QR',
    pairing_success_toast: '🎉 WhatsApp Device Connected Successfully! All automated reminders will dispatch from this number.',
    unlinked_toast: '✓ WhatsApp device unlinked successfully.',
    btn_open_desktop_qr: '🖥️ Open WhatsApp Web Login Window',
    btn_direct_send: '📲 Direct Send (wa.me)',
    desktop_window_launched: '⚡ WhatsApp Web window opened on your desktop! Scan the QR code to finish linking.',

    // Modal
    preview_modal_title: 'Gemini AI WhatsApp Reminder Preview',
    recipient_phone: 'Recipient WhatsApp Number',
    ai_message_draft: 'Gemini Autonomous Message Draft',
    copy_message: 'Copy Text',
    copied: 'Copied!',
    open_whatsapp: 'Open WhatsApp Web Link',
    close: 'Close',
    cfo_title: 'AI CFO Assistant',
    cfo_sub: 'Real-time financial intelligence',
    cfo_suggestions: 'Quick suggestions:',
    cfo_placeholder: 'Ask your AI CFO a question...',
    cfo_send: 'Send',

    // Value Propositions
    val_heading_1: 'Replace Complex Spreadsheets With a',
    val_heading_2: 'Smart Financial Co-Pilot',
    val_subheading: 'Everything your growing business needs to monitor runway, qualify for financing, and optimize expenses — in one unified dashboard.',
    val_card1_title: 'Cash Flow Intelligence',
    val_card1_item1: '30/60/90-Day Cash Projections',
    val_card1_item2: 'Early Warning for Low Liquidity',
    val_card1_item3: 'Automatic Receivables Tracking',
    val_card2_title: 'Credit Readiness',
    val_card2_item1: 'Financial Pilot Credit Score (0–100)',
    val_card2_item2: '4-Factor Financial Health Breakdown',
    val_card2_item3: 'Gemini AI Improvement Roadmap',
    val_card3_title: 'Compliance & Guard',
    val_card3_item1: 'Anomaly & Irregularity Detector',
    val_card3_item2: 'Live Tax Liability Estimates',
    val_card3_item3: 'Export-Ready Accountant Portal',
    val_card4_title: 'Procurement AI',
    val_card4_item1: 'Vendor Reorder Alerts',
    val_card4_item2: 'Group Buying Opportunities',
    val_card4_item3: 'Supplier Negotiation Co-Pilot',

    // Business Needs (5 Pillars)
    bn_heading_1: 'The 5 Financial Pillars Every',
    bn_heading_2: 'Business Needs',
    bn_subheading: 'Structured modules designed to solve the cash visibility gap for modern growing businesses.',
    bn_p1_title: 'VISIBILITY',
    bn_p1_desc: "Know exactly where your cash is coming from and going — in real time, not at month-end when it's too late to act.",
    bn_p2_title: 'FORECASTING',
    bn_p2_desc: 'See 30, 60, and 90 days into the future so you can plan payroll, negotiate supplier terms, and avoid cash crunches.',
    bn_p3_title: 'CREDIT HEALTH',
    bn_p3_desc: "Build and monitor a strong business credit profile so you're always ready when a loan or credit line arrives.",
    bn_p4_title: 'COMPLIANCE',
    bn_p4_desc: 'Stay ahead of taxes, detect anomalies before they become audits, and keep your books clean with automated monitoring.',
    bn_p5_title: 'INTELLIGENCE',
    bn_p5_desc: 'Turn raw financial data into strategic decisions with an AI co-pilot that speaks plain English, not accounting jargon.',

    // Pricing Section
    pricing_heading_1: 'Pricing Built For',
    pricing_heading_2: 'Business Growth',
    pricing_subheading: 'Start your free 14-day trial, scale as you grow. No credit card required. Cancel anytime.',
    pricing_monthly: 'Monthly',
    pricing_yearly: 'Yearly',
    pricing_save: 'Save 20%',
    pricing_plan_essentials: 'Essentials',
    pricing_desc_essentials: 'Essential financial runway visibility for solo founders & micro-businesses.',
    pricing_plan_growth: 'Growth',
    pricing_desc_growth: 'Full financial intelligence for scaling businesses ready to qualify for credit.',
    pricing_popular: 'Most Popular',
    pricing_plan_scale: 'Scale',
    pricing_desc_scale: 'Enterprise-grade financial analytics and multi-ledger intelligence.',
    pricing_start_trial: 'Start 14-Day Free Trial',
    pricing_per_month: '/month',

    // FAQ Section
    faq_heading_1: 'Frequently Asked',
    faq_heading_2: 'Questions',
    faq_subheading: 'Everything you need to know about Financial Pilot’s architecture and financial co-pilot engine.',
    faq_q1: 'How does the Cash Flow Forecaster project my balance?',
    faq_a1: 'Financial Pilot analyzes your historical ledger transactions stored in local CSV files, calculates 90-day moving averages of income and operational expenses, and applies statistical volatility modeling to generate 7 to 90-day projections with automatic early warning flags.',
    faq_q2: 'What is the Credit Readiness Score based on?',
    faq_a2: 'The 0–100 score benchmarks four core lending criteria: monthly revenue consistency, net profit margin, accounts receivable collection speed, and cost discipline ratios. Gemini AI then generates custom 90-day improvement action steps.',
    faq_q3: 'Where is my financial data stored?',
    faq_a3: 'During our Phase 1 MVP, all data resides locally on your machine in the /backend/data/ directory using standard Pandas CSV contracts. No proprietary banking credentials or sensitive ledger details leave your server.',
    faq_q4: 'How does Financial Pilot decouple its data architecture and modules?',
    faq_a4: 'Financial Pilot enforces a strict Function Contract: all analytical modules expose pure Python functions returning pure JSON-serializable dictionaries or DataFrames. UI pages only call those pure functions via FastAPI endpoints.',

    // Call To Action & Footer
    cta_heading_1: 'Ready to Stop Flying Blind on Your',
    cta_heading_2: 'Business Finances?',
    cta_subheading: 'Join forward-thinking business owners who use Financial Pilot to project cash flow, build lender credit readiness, and navigate runway with confidence.',
    cta_launch_btn: 'Launch Live Dashboard',
    cta_api_docs: 'Explore Backend API',
    footer_tagline: 'Empowering growing businesses through intelligent financial forecasting and credit readiness co-piloting.',
    footer_col_engines: 'Financial Engines',
    footer_col_ops: 'Operations Suite',
    footer_col_system: 'System Architecture',
    footer_active_status: 'FastAPI Engine: Active',
    footer_local_csv: 'Local CSV Contract: Synced',
    footer_rights: 'Financial Pilot AI. All rights reserved. Strict Function Contract & Pandas Architecture.',

    // Inner Pages Common & Specific
    cf_badge: 'Predictive Liquidity Engine',
    cf_title_1: 'Cash Flow',
    cf_title_2: 'Forecaster',
    cf_subtitle: 'Algorithmic cash runway projection powered by Pandas & Gemini AI',
    cf_alert_title: 'Cash Reserve Alert',
    cf_baseline_balance: 'Historical baseline balance',
    cf_after_forecast: 'After forecast period',
    cf_daily_rate: 'Last 90-day daily rate',
    cf_receivables: 'Accounts receivable',
    cf_curve_title: 'Cash Projection Curve',
    cf_curve_subtitle: 'Simulated with standard volatility modeling',
    cf_exec_title: 'Executive Cash Flow Analysis',
    cf_gemini_by: 'Synthesized by Google Gemini AI',

    ag_badge: 'Audit & Forensic Risk Engine',
    ag_title_1: 'Anomaly & Fraud',
    ag_title_2: 'Guard',
    ag_subtitle: 'Real-time ledger audit detecting duplicate invoices, statistical payment outliers (z > 2.5), and supplier price spikes',
    ag_rescan: 'Re-scan Ledger',
    ag_total_flagged: 'Total Flagged',
    ag_across_algos: 'Across 3 audit algorithms',
    ag_high_severity: 'High Severity Risks',
    ag_cpa_review: 'Requires immediate CPA review',
    ag_potential_exposure: 'Potential Exposure',
    ag_cumulative_value: 'Cumulative value under review',
    ag_engine_active: 'Detection Engine',
    ag_active_100: 'Active • 100%',
    ag_filter_all: 'All Anomalies',
    ag_filter_high: 'High Severity Only',
    ag_filter_dup: 'Duplicate Invoices',
    ag_filter_pay: 'Unusual Payments',
    ag_filter_price: 'Price Spikes',
    ag_search: 'Search by ID, vendor, description...',
    ag_col_id: 'Ref / ID',
    ag_col_category: 'Category',
    ag_col_entity: 'Entity / Vendor',
    ag_col_amount: 'Amount',
    ag_col_severity: 'Severity',
    ag_col_reason: 'Audit Flag Reason',
    ag_col_action: 'Action',
    ag_btn_review: 'Mark Reviewed',
    ag_btn_reviewed: '✓ Reviewed',
    ag_badge_high: 'High Severity',
    ag_badge_medium: 'Medium Severity',
    ag_badge_low: 'Low Severity',
    ag_no_records: 'No matching anomaly records found',

    tax_badge: 'Dynamic Compliance & Reserve Engine',
    tax_title_1: 'Tax & Regulatory',
    tax_title_2: 'Assistant',
    tax_subtitle: 'Automated corporate income tax reserves, sales tax obligations, and IRS/FBR filing timelines',
    tax_gross_rev: 'Gross Revenue (YTD)',
    tax_deductibles: 'Deductible Expenses',
    tax_taxable_inc: 'Net Taxable Income',
    tax_next_filing: 'Next Regulatory Filing',
    tax_download_report: 'Download Tax Memo (.txt)',
    tax_copy_cpa: 'Copy Memo for CPA',
    tax_all_deadlines: 'All Deadlines',
    tax_federal: 'Federal Obligations',
    tax_state_payroll: 'State & Payroll',
    tax_cpa_memo_title: 'Gemini CPA Advisory Memo',
    tax_rate_breakdown: 'Federal 21% + State 5% + Sales Tax',
    tax_irc_eligible: 'Eligible IRC Sec. 162 & COGS Write-offs',
    tax_rev_less_ded: 'Revenue',
    tax_less_ded: 'less Deductions',
    tax_net_due: 'Net Outstanding Due:',
    tax_liability_breakdown: 'Tax Liability & Deductible Breakdown',
    tax_cost_accounting_guide: 'Garment manufacturing cost accounting according to statutory guidelines',
    tax_combined_rate: 'Combined 26.0% Rate',
    tax_est_corp_tax: 'Estimated Corporate Income Tax',
    tax_fed_state: 'Federal (21%) + State Franchise (5%)',
    tax_sales_provision: 'Sales & Use Tax Provision',
    tax_sales_goods: '~4.0% provision on finished goods sales',
    tax_qualifying_deductibles: 'Qualifying Deductible Expenses',
    tax_total: 'Total',
    tax_std_ded: 'Standard Deduction',
    tax_cogs_label: 'Raw Materials & Textiles (COGS)',
    tax_cogs_sub: 'Direct fabric, trim & thread spend',
    tax_payroll_label: 'Manufacturing Payroll',
    tax_payroll_sub: 'Sewing operators, cutters, patternmakers',
    tax_lease_label: 'Plant Facility Lease',
    tax_lease_sub: 'Factory floor and warehouse space',
    tax_power_label: 'Industrial Steam & Power',
    tax_power_sub: 'High-voltage cutting & plant electricity',
    tax_marketing_label: 'Wholesale Promotion',
    tax_marketing_sub: 'Trade shows & apparel showrooms',
    tax_prior_prepayments: 'Recorded Tax Prepayments / Withholdings:',
    tax_ai_memo_badge: 'Gemini AI Advisory • Audit-Ready CPA Workpaper',
    tax_ai_memo_title: 'Executive Tax Memorandum & Compliance Summary',
    tax_copy_memo: 'Copy Memo',
    tax_copied: 'Copied',
    tax_download_report_btn: 'Download Report',
    tax_memo_to: 'To: Recipient',
    tax_cpa_team: 'Lead Corporate CPA',
    tax_advisory_team: '& Financial Advisory Team',
    tax_memo_entity: 'Entity / Organization',
    tax_apparel_ops: 'Apparel Operations',
    tax_memo_period: 'Reporting Period',
    tax_books_verified: 'Books Closed & Verified',
    tax_memo_audit: 'Audit Authority',
    tax_safe_harbor: 'Safe-Harbor Compliant',
    tax_sec1_title: 'Executive Summary & Tax Liability Posture',
    tax_net_bal_label: 'Net Balance:',
    tax_gross_rev_col: 'Gross Revenue',
    tax_net_tax_base: 'Net Taxable Base',
    tax_est_tot_tax: 'Est. Total Tax',
    tax_prior_remit: 'Prior Remittances',
    tax_sec2_title: 'Deductible Expense Classification & Audit Readiness',
    tax_qualified: 'Qualified',
    tax_sec2_desc: 'Operational deductions reflect audited garment manufacturing cost allocations across statutory categories:',
    tax_cogs_title: 'Raw Materials & Supplies (COGS)',
    tax_cogs_memo_sub: 'Direct textile, trim, and fabric procurement. Under IRC Sec. 471, maintain closing inventory reconciliations.',
    tax_direct_payroll: 'Direct & Operational Payroll',
    tax_payroll_memo_sub: 'Plant floor sewing operators, machine mechanics, and supervisors. Reconciled with quarterly Form 941 filings.',
    tax_facility_overhead: 'Facility & Production Overhead',
    tax_lease_memo_sub: 'Factory warehouse lease and high-voltage cutting power.',
    tax_wholesale_dist: 'Wholesale Distribution & SG&A',
    tax_wholesale_sub: 'Apparel trade show exhibits, showroom space, and B2B catalog marketing campaigns.',
    tax_sec3_title: 'Regulatory Filing Calendar & Safe-Harbor Action Plan',
    tax_days_next: 'Days to Next Filing',
    tax_plan_1: 'Prepayment Safe-Harbor: Remit quarterly installment to satisfy 100% prior-year safe harbor',
    tax_required: 'Required',
    tax_plan_2: 'COGS Documentation: Preserve itemized supplier invoices for all fabric disbursements > $2,500',
    tax_audit_record: 'Audit Record',
    tax_plan_3: 'Form 941 Reconciliation: Tie payroll clearing entries to State Unemployment insurance filings',
    tax_scheduled: 'Scheduled',
    tax_generating: 'Generating tax summary...',
    tax_irc_verified: 'Calculations verified against IRC Sec. 162 & Manufacturing COGS provisions',
    tax_download_success: 'Tax & Compliance Executive Summary Report downloaded successfully to your computer.',
    tax_engine_error: 'Tax Engine Error',

    sp_badge: 'Monte Carlo Predictive Engine • 500 Stochastic Paths',
    sp_title_1: 'Scenario',
    sp_title_2: 'Planner',
    sp_subtitle: 'Simulate revenue shifts, headcount expansion, and material cost volatility across confidence percentiles',
    sp_sales_change: 'Sales Volume Shock',
    sp_new_hires: 'New Monthly Hires',
    sp_procurement: 'Procurement Cost Shift',
    sp_ar_delay: 'Receivables Payment Delay',
    sp_reset_params: 'Reset Baseline',
    sp_run_simulation: 'Run Simulation',
    sp_simulating: 'Simulating...',
    sp_dynamic_levers: 'Dynamic Stress Levers',
    sp_dynamic_levers_sub: 'Adjust variables to test balance resilience against downside risks',
    sp_recalculating: 'Live Recalculating 500 Paths...',
    sp_days: 'Days',
    sp_sales_revenue_shift: 'Sales Revenue Shift',
    sp_recession: 'Recession',
    sp_surge: 'Surge',
    sp_baseline: 'Baseline',
    sp_headcount: 'Headcount / Hiring',
    sp_hires: 'Hires',
    sp_staff: 'Staff',
    sp_est_payroll: 'Est. Payroll:',
    sp_procurement_costs: 'Procurement Costs',
    sp_discount: 'Discount',
    sp_flat: 'Flat',
    sp_inflation: 'Inflation',
    sp_collections_shift: 'Collections Shift',
    sp_fast: 'Fast',
    sp_normal: 'Normal',
    sp_delinquent: 'Delinquent',
    sp_delay: 'Delay',
    sp_kpi_ending_cash: 'Expected Ending Cash (P50)',
    sp_kpi_vs_baseline: 'vs Baseline',
    sp_kpi_worst_case: 'Worst-Case Stress (P10)',
    sp_kpi_bearish_floor: '10th Percentile Bearish Floor',
    sp_kpi_buffer_risk: 'Buffer Breach Risk',
    sp_kpi_buffer_desc: 'Probability of dipping < $5,000 threshold',
    sp_kpi_spend_shift: 'Procurement Spend Shift',
    sp_fan_chart_title: 'Monte Carlo Cash Runway Fan Chart',
    sp_fan_chart_sub: 'Percentile dispersion showing median path (P50), 50% confidence band (P25–P75), and 80% confidence band (P10–P90)',
    sp_legend_median: 'P50 (Median)',
    sp_legend_band: 'P25–P75 Band',
    sp_legend_stress: 'P10 Stress Floor',
    sp_legend_baseline: 'Baseline',
    sp_min_reserve: 'Min Reserve $5k',
    sp_gemini_advisory: 'Gemini AI Predictive Advisory',
    sp_gemini_executive: 'Executive Scenario & Stress Analysis',
    sp_insight_runway: 'Runway & Liquidity Trajectory',
    sp_insight_sensitivity: 'Sensitivity & Cost Drivers',
    sp_insight_recommendations: 'Strategic Recommendations',
    sp_sim_paths_label: 'Simulating 500 stochastic paths...',
    sp_preset_base: 'Baseline Case',
    sp_preset_bull: 'Bull Market (+20%)',
    sp_preset_shock: 'Supply Crunch (+25% Cost)',
    sp_preset_recession: 'Severe Recession (-30% Sales)',
    sp_bullish_p90: '90th Pct (Bullish)',
    sp_median_p50: 'Median (Expected P50)',
    sp_stress_p10: '10th Pct (Stress Test)',
    sp_gemini_analysis: 'Gemini Scenario Risk Assessment',

    ap_badge: 'GAAP Certified Workpapers • External Underwriting Portal',
    ap_title_1: 'Accountant & Lender',
    ap_title_2: 'Portal',
    ap_subtitle: 'Read-only external portal for CPA auditors, bank lenders, and credit underwriters',
    ap_export_csv: 'Export CSV',
    ap_export_pkg: 'Export Statement Package',
    ap_generate_dossier: '⚡ Generate Lender-Ready Dossier',
    ap_compiling: 'Compiling...',
    ap_readonly_badge: 'Certified Read-Only View',
    ap_write_locked: 'Write Controls Locked',
    ap_checksum: 'Cryptographically signed snapshot • Checksum:',
    ap_viewing_as: 'Viewing as:',
    ap_role_auditor: 'Auditor',
    ap_role_lender: 'Lender',
    ap_role_accountant: 'Accountant',
    ap_underwriting_lens: 'Active Underwriting Lens:',
    ap_controls_rating: 'Controls Rating:',
    ap_balance_sheet: 'Balance Sheet',
    ap_income_statement: 'Income Statement (P&L)',
    ap_cash_flow: 'Cash Flow Statement',
    ap_in_usd: 'In PKR',
    ap_accrual_basis: 'Accrual Basis',
    ap_current_assets: 'Current Assets',
    ap_cash_equiv: 'Cash and Cash Equivalents',
    ap_ar_net: 'Accounts Receivable (Net)',
    ap_inventory: 'Inventory (Lower of Cost or Market)',
    ap_total_current_assets: 'TOTAL CURRENT ASSETS',
    ap_liab_equity: 'Liabilities & Equity',
    ap_ap_supplier: 'Accounts Payable (Supplier AP)',
    ap_accrued_opex: 'Accrued Operational Expenses',
    ap_short_term_debt: 'Short-term Debt Obligations',
    ap_total_current_liab: 'Total Current Liabilities',
    ap_retained_equity: 'Retained Earnings & Equity',
    ap_total_liab_equity: 'TOTAL LIABILITIES & EQUITY',
    ap_balanced_verified: 'Accounting Equation Verified: Assets = Liabilities + Equity (Balanced)',
    ap_variance: '0 Variance',
    ap_statement_ops: 'Statement of Operations (P&L)',
    ap_fiscal_accrual: 'Fiscal Year-to-Date Accrual Accounting',
    ap_net_margin: 'Net Margin:',
    ap_gross_revenue: 'GROSS REVENUE',
    ap_cogs: 'Less: Cost of Goods Sold (Raw Material COGS)',
    ap_gross_profit: 'GROSS PROFIT',
    ap_opex_header: 'Operating Expenditures (SG&A)',
    ap_opex_payroll: '• Direct & Operational Payroll',
    ap_opex_rent: '• Factory Facility Leases (Rent)',
    ap_opex_utilities: '• Industrial Steam & Power (Utilities)',
    ap_opex_marketing: '• Wholesale Promotion & SG&A (Marketing)',
    ap_operating_income: 'OPERATING INCOME (EBITDA)',
    ap_tax_provision: 'Less: Accrued Tax Provisions',
    ap_net_income: 'NET INCOME',
    ap_cf_title: 'Statement of Cash Flows',
    ap_cf_reconciliation: 'Cash Accounting Reconciliation',
    ap_cf_operating: 'Cash Flows from Operating Activities',
    ap_cf_investing: 'Cash Flows from Investing Activities',
    ap_cf_financing: 'Cash Flows from Financing Activities',
    ap_cf_ending: 'Ending Cash & Liquid Reserves',
    ap_consent_title: 'Data Consent & Sharing Link',
    ap_active_grant: 'Active Grant',
    ap_token_label: 'Consent Access Token',
    ap_granted_by: 'Granted By',
    ap_access_exp: 'Access Expiration',
    ap_copied: 'Sharing Link Copied to Clipboard',
    ap_copy_link: 'Copy External Read-Only Link',
    ap_audit_title: 'Immutable Portal Access Audit Log',
    ap_audit_subtitle: 'Timestamped ledger access events',
    ap_col_timestamp: 'Timestamp',
    ap_col_actor_role: 'Actor & Role',
    ap_col_action: 'Action',
    ap_col_verification: 'Verification',
    ap_export_success: 'Verified financial statements exported successfully.',
    ap_dossier_success: 'Comprehensive Lender-Ready Compliance Dossier compiled with SHA-256 seal and downloaded successfully!',

    scan_title: 'Invoice & Receipt Scanner',
    scan_subtitle: 'AI Vision & OCR automatic ledger extraction',
    scan_dropzone: 'Drop invoice or receipt here, or browse',
    scan_supported: 'Supports PDF, PNG, JPG receipts up to 25MB',
    scan_or_test: 'Or test with sample mock invoice:',
    scan_sample_1: 'Acme Freight Bill ($3,480)',
    scan_sample_2: 'Cloud Infrastructure ($1,850)',
    scan_parsing: 'Parsing',
    scan_with_ocr: 'with OCR Vision…',
    scan_extracting: 'Extracting vendor, line items, and payment terms',
    scan_detected_vendor: 'Detected Vendor',
    scan_confidence: 'Confidence',
    scan_issue_date: 'Issue Date',
    scan_due_date: 'Due Date',
    scan_category: 'Category',
    scan_extracted_items: 'Extracted Line Items',
    scan_total_amount: 'Total Amount',
    scan_another: 'Scan Another',
    scan_confirm_sync: 'Confirm & Sync to Ledger',
    scan_recorded_alert: 'Invoice successfully recorded to /backend/data/invoices.csv!',
    scan_scanning: 'Extracting line items and merchant data...',
    scan_result_title: 'Verified Receipt Ledger Entry',
    scan_save: 'Commit to Ledger',
    scan_cancel: 'Cancel',

    // WhatsApp & Scenario Edit Mode
    add_target: 'Add Target',
    edit_target: 'Edit Target',
    btn_edit: 'Edit',
    save_changes: 'Save Changes',
    delete_target: 'Delete Target',
    cancel: 'Cancel',
    custom_projections_title: 'Live Demo Custom Projections (Cash-In & Cash-Out)',
    custom_projections_desc: 'Add one-off grants, equity, capex, or supplier bulk purchases to immediately recalculate 500 Monte Carlo paths',
    add_line_item: 'Add Line Item',
    item_name_placeholder: 'e.g. Government Grant / Machinery Capex',
    item_amount: 'Amount ($)',
    inflow: 'Cash-In (+)',
    outflow: 'Cash-Out (-)',
    active: 'Active',
    inactive: 'Inactive',
    net_custom_impact: 'Net Custom Cash Impact',
    total_custom_inflows: 'Total Custom Inflows',
    total_custom_outflows: 'Total Custom Outflows',
  },

  ur: {
    app_name: 'Financial Pilot',
    hero_badge: 'ترقی پذیر کاروبار کے لیے اے آئی فنانشل کوپائلٹ',
    hero_title_1: 'اپنے مالیاتی رن وے پر',
    hero_title_2: 'اندھیرے میں سفر بند کریں',
    hero_banner_title_1: 'ترقی پذیر کاروبار کے لیے',
    hero_banner_title_2: 'اے آئی فنانشل کوپائلٹ',
    btn_view_cash_forecast: 'کیش فلو تخمینہ دیکھیں',
    btn_calc_credit_score: 'کریڈٹ سکور کا حساب لگائیں',
    hero_subtitle: 'فنانشل پائلٹ آپ کو حقیقی وقت میں کیش فلو کی پیشین گوئی، کاروباری کریڈٹ تیاری کی درجہ بندی، بے ضابطگیوں کی نشاندہی، اور جیمنی کے تجزیات فراہم کرتا ہے — سب ایک ہی جگہ۔',
    hero_launch_dashboard: 'لائیو ڈیش بورڈ کھولیں',
    hero_explore_forecast: 'کیش فلو انجن کا جائزہ لیں',
    nav_dashboard: 'صبح کا ڈیش بورڈ',
    nav_cash_flow: 'کیش فلو پیشین گوئی',
    nav_credit_score: 'کریڈٹ ریڈینس سکور',
    nav_scenario: 'منظر نامہ پلانر',
    nav_whatsapp: 'واٹس ایپ وصولی ایجنٹ',
    nav_anomaly: 'دھوکہ دہی اور بے ضابطگی گارڈ',
    nav_tax: 'ٹیکس اور تعمیل اسسٹنٹ',
    nav_accountant: 'اکاؤنٹنٹ اور قرض دہندہ پورٹل',
    nav_inventory: 'انوینٹری الرٹس',
    nav_pricing: 'قیمتوں کا مشیر',
    nav_negotiation: 'مذاکرات کوپائلٹ',
    crisis_mode: 'بحرانی موڈ',
    crisis_injecting: 'شروع کر رہا ہے...',
    reset_data: 'ری سیٹ',
    syncing: 'ہم آہنگ ہو رہا ہے...',
    scan_invoice: 'اسکین',
    launch_hub: 'ہب کھولیں',
    menu_open: 'مینو',
    group_cash: 'نقد رقم اور مالیاتی صحت',
    group_compliance: 'تعمیل اور گورننس',
    group_supply: 'سپلائی چین اور تجارت',
    badge_core: 'بنیادی انجن',
    badge_security: 'سیکیورٹی شیلڈ',
    badge_growth: 'ترقی اور منافع',
    desc_dashboard: '7/30/90 دن کے خلاصہ کارڈز اور روزانہ رن وے کی صحت',
    desc_cash_flow: '30/60/90 دن کا کیش فلو تخمینہ اور اتار چڑھاؤ ماڈلنگ',
    desc_credit_score: '0-100 بینک ایبلٹی سکور اور جیمنی مشورے',
    desc_scenario: 'مونٹی کارلو کے ذریعے مختلف منظر ناموں کی تخمینہ کاری',
    desc_whatsapp: 'خودکار یاد دہانیاں اور 1 کلک نقد مفاہمت',
    desc_anomaly: 'مشکوک لین دین اور ڈپلیکیٹ انوائسز کا پتہ لگانا',
    desc_tax: 'سیلز ٹیکس حساب کتاب اور سہ ماہی ریزرو کا تخمینہ',
    desc_accountant: 'قرض دہندگان اور آڈیٹرز کے لیے تصدیق شدہ مالیاتی پورٹل',
    desc_inventory: 'کم اسٹاک کی وارننگز اور خودکار دوبارہ آرڈر',
    desc_pricing: 'مارجن آپٹیمائزیشن اور قیمت کی لچک کا تجزیہ',
    desc_negotiation: 'سپلائر کے ساتھ مذاکرات کے لیے اے آئی بریف',
    desc_procure: 'سپلائر کے اخراجات کی ذہانت اور ڈیلیوری وقت کا تجزیہ',
    trusted_brands: 'پاکستان کے معروف ٹیکسٹائل اور ریٹیل برانڈز کا قابل اعتماد شراکت دار',

    // Section Header & Hub
    live_engine_status: 'براہ راست ڈیٹا انجن • پائتھن بیک اینڈ منسلک',
    real_time_financial: 'حقیقی وقت کی مالیاتی',
    intelligence_hub: 'انٹیلیجنس ہب',
    live_metrics_calc: 'آپ کے لوکل CSV ڈیٹا کنٹریکٹس سے پانڈاس کے ذریعے تیار کردہ براہ راست میٹرکس، جیمنی اے آئی تجزیہ کے ساتھ۔',

    // Low Cash Warning Banner
    low_cash_title: 'کم نقد رقم کے ذخائر کی وارننگ',
    action_required: 'کارروائی درکار ہے',
    low_cash_desc_prefix: 'متوقع نقد رقم $5,000 کی حد سے نیچے آ جائے گی بروز',
    low_cash_desc_suffix: '۔ کیش فلو پیشین گوئی کھولنے اور رن وے دیکھنے کے لیے یہاں کلک کریں۔',
    inspect_runway: 'رن وے دیکھیں',

    // Controls: Horizon Selector
    forecast_horizon: 'پیشین گوئی کا دائرہ:',
    days_ahead: 'دن آگے',

    // Cross-Module Quick Jump Hub
    module_anomaly: 'بے ضابطگی گارڈ',
    module_anomaly_sub: 'ڈپلیکیٹ اور آؤٹ لائر آڈٹ',
    module_tax: 'ٹیکس اسسٹنٹ',
    module_tax_sub: 'کٹوتی اور سی پی اے میمو',
    module_scenario: 'منظر نامہ پلانر',
    module_scenario_sub: 'سیلز اور اخراجات کے جھٹکے',
    module_accountant: 'اکاؤنٹنٹ پورٹل',
    module_accountant_sub: 'آڈیٹر اور قرض دہندہ ایکسپورٹ',
    module_whatsapp: 'واٹس ایپ ایجنٹ',
    module_whatsapp_sub: 'بقایا یاد دہانیاں اور کیش',
    badge_flags: 'انتباہات',
    badge_active: 'فعال',
    badge_due: 'واجب الادا',
    badge_monte_carlo: 'مونٹی کارلو',
    badge_gaap: 'GAAP تصدیق شدہ',
    badge_ai_collections: 'AI وصولی',

    // Quick Drawer Links
    quick_tools: 'فوری ٹولز اور نیویگیشن',
    live_engines: 'براہ راست انڈر رائٹنگ انجن',
    forecaster_tool: 'پیشین گوئی',
    forecaster_sub: '30-90 دن کا تخمینہ',
    score_engine_tool: 'سکور انجن',
    score_engine_sub: 'بینک ایبلٹی 0-100',
    scenario_tool: 'منظر نامہ پلانر',
    scenario_sub: 'مونٹی کارلو ماڈلز',
    fraud_guard_tool: 'فراڈ گارڈ',
    fraud_sub: 'ڈپلیکیٹ انوائس AI',
    tax_assistant_tool: 'ٹیکس اسسٹنٹ',
    tax_sub: 'سہ ماہی ریزرو',
    accountant_tool: 'اکاؤنٹنٹ پورٹل',
    accountant_sub: 'آڈیٹر اور قرض دہندہ ایکسپورٹ',
    whatsapp_tool: 'واٹس ایپ ایجنٹ',
    whatsapp_sub: 'بقایا جات کی وصولی',

    // Dashboard Metrics Cards
    starting_cash: 'ابتدائی نقد رقم',
    current_liquid_pos: 'موجودہ نقد پوزیشن',
    projected: 'متوقع اختتام',
    projected_end_bal: 'متوقع اختتامی بیلنس',
    daily_avg_inflow: 'روزانہ اوسط آمدن',
    historical_90d: 'تاریخی 90 دن کی بنیاد',
    pending_invoices: 'زیر التواء بل',
    unpaid_bills: 'غیر ادا شدہ واجبات',
    day_window: 'دن کی ونڈو',
    cash_trajectory: 'متوقع کیش فلو رفتار',
    cash_trajectory_desc: 'روزانہ خالص آمدنی بمقابلہ اخراجات کا تخمینہ',
    buffer_threshold: 'سرخ ڈیش شدہ لکیر = $5,000 ہنگامی نقد حد',
    detailed_simulation: 'تفصیلی 90 روزہ تخمینہ',
    credit_readiness: 'کریڈٹ تیاری',
    composite_score: 'مجموعی تیاری کا سکور',
    view_pillars_tips: 'چار بنیادی ستون اور تجاویز دیکھیں',
    underwriting_desc: 'تاریخی کیش تسلسل، آپریٹنگ منافع کے مارجن، انوائس ٹرن، اور لاگت کنٹرول پر مبنی۔',
    score_factors_title: 'سکور فیکٹر کی تفصیل',
    score_factors_desc: 'فنانشل پائلٹ کے چار بنیادی انڈر رائٹنگ ستون',
    revenue_consistency: 'آمدنی کی مستقل مزاجی',
    profit_margin: 'منافع کا مارجن',
    payment_behavior: 'ادائیگی کا رویہ',
    expense_control: 'اخراجات پر قابو',
    grade: 'گریڈ',
    pts: 'پوائنٹس',
    gemini_insights_title: 'جیمنی اے آئی مالیاتی بصیرت',
    gemini_insights_desc: 'آپ کے اعداد و شمار پر مبنی براہ راست تجزیہ',
    cash_exec_summary: 'کیش فلو ایگزیکٹو خلاصہ:',
    credit_opt_tips: 'کریڈٹ سکور میں بہتری کی تجاویز:',
    ai_connecting: 'مصنوعی ذہانت تجزیہ کر رہی ہے...',

    // Risk Banner
    risk_priority_alert: '🚨 خودکار ترجیحی الرٹ',
    risk_signal_alert: '⚡ خطرے کا فعال سگنل',
    threshold_breach_on: 'حد پار ہونے کی تاریخ:',
    high_severity_anomalies: 'انتہائی سنگین بے ضابطگیاں',
    modal_agent_draft: 'خودکار وصولی کا مسودہ',
    modal_gemini_synth: 'جیمنی کا تیار کردہ',
    modal_debt_settlement: 'رعایت اور وائر ٹرانسفر کے ساتھ قرض تصفیہ نوٹس',
    modal_notice_success: 'نوٹس کامیابی کے ساتھ بھیج دیا گیا!',
    modal_recipient: 'وصول کنندہ (اے پی رابطہ):',
    modal_target_invoice: 'متعلقہ انوائس اور رقم:',
    modal_subject: 'موضوع:',
    modal_body_title: 'ای میل کا متن (قابل ترمیم):',
    modal_wire_incentive: '2% فوری تصفیہ رعایت شامل ہے',
    modal_copied_draft: '✓ کاپی ہو گیا',
    modal_copy_text: 'متن کاپی کریں',
    modal_download_txt: 'ڈاؤن لوڈ .txt',
    modal_cancel: 'منسوخ کریں',
    modal_transmit: '⚡ نوٹس بھیجیں',

    // Modal navigation
    home_landing: 'ہوم لینڈنگ',
    ocr_invoice_scanner: 'او سی آر انوائس اسکینر',
    api_docs: 'فاسٹ اے پی آئی دستاویزات',
    lender_dossier: 'قرض دہندہ ڈوزیئر',
    reset_demo_data: 'ڈیمو ڈیٹا ری سیٹ کریں',
    launch_hub_arrow: 'فنانشل پائلٹ ہب کھولیں ←',
    complete_financial_suite: 'مکمل مالیاتی سوٹ',
    live: 'براہ راست',
    active_state: 'فعال',

    // WhatsApp Collector
    whatsapp_title: 'واٹس ایپ قرض وصولی ایجنٹ',
    whatsapp_badge: 'خودکار وصولی انجن',
    whatsapp_desc: 'مصنوعی ذہانت کے ذریعے خودکار یاد دہانیاں اور فوری نقد رقم کی مفاہمت۔ پہلے سے پیغامات دیکھیں، براہ راست واٹس ایپ پر بھیجیں، اور نقد رقم فوری رجسٹر کریں۔',
    refresh_queue: 'قطار تازہ کریں',
    total_overdue: 'کل زائد المیعاد رقم',
    outstanding_receivables: 'واجب الوصول بقایا جات',
    active_clients: 'زیر التواء کلائنٹس',
    pending_invoices_queue: 'کل زیر التواء انوائسز قطار میں',
    avg_overdue: 'اوسط زائد المیعاد دن',
    delinquency_velocity: 'تاخیر کی رفتار',
    days_overdue: 'دن زائد المیعاد',
    days: 'دن',
    reconciled_session: 'اس سیشن میں وصول شدہ',
    invoices_cleared: 'انوائسز نقد میں تبدیل',
    active_collection_targets: 'فعال وصولی کے اہداف',
    targets: 'اہداف',
    send_all_reminders: '🚀 سب کو یاد دہانی بھیجیں',
    dispatching: 'بھیجا جا رہا ہے...',
    table_desc: 'پیغامات کا جائزہ لینے اور واٹس ایپ پر بھیجنے کے لیے کلک کریں۔',
    search_placeholder: 'کلائنٹ یا انوائس تلاش کریں...',
    col_client: 'کلائنٹ کا نام',
    col_invoice: 'انوائس نمبر',
    col_amount: 'رقم',
    col_due_date: 'آخری تاریخ',
    col_status: 'حیثیت',
    col_actions: 'کارروائی',
    btn_auto_send: 'خودکار بھیجیں',
    btn_auto_send_bot: 'خودکار بوٹ سے بھیجیں',
    open_manual: 'دستی لنک',
    btn_send_whatsapp: 'واٹس ایپ یاد دہانی بھیجیں',
    btn_resend_whatsapp: 'دوبارہ بھیجیں',
    btn_mark_paid: 'ادا شدہ نشان زد کریں',
    btn_reconciling: 'مفاہمت جاری ہے...',
    status_overdue: 'زائد المیعاد',
    status_dispatched: 'بھیج دیا گیا',
    all_reconciled: 'تمام انوائسز کی مکمل مفاہمت ہو چکی ہے',
    no_overdue_found: 'کوئی فعال زائد المیعاد بل نہیں ملا۔ آپ کا لیجر مکمل طور پر اپ ڈیٹ ہے۔',
    clear_filter: 'تلاش فلٹر ختم کریں',
    batch_dispatched_toast: '🚀 تمام یاد دہانیاں کامیابی کے ساتھ بھیج دی گئیں۔',

    // WhatsApp Device Linking
    conn_status_connected: 'منسلک ترسیل کار',
    conn_status_disconnected: 'کوئی ڈیوائس منسلک نہیں',
    btn_connect_whatsapp: '📲 واٹس ایپ منسلک کریں',
    btn_switch_device: 'ڈیوائس تبدیل کریں',
    btn_unlink_device: 'منسلک ختم کریں',
    conn_active_sub: 'تمام یاد دہانیاں اس واٹس ایپ نمبر سے خودکار بھیجی جاتی ہیں',
    conn_inactive_sub: 'خودکار یاد دہانیوں کے لیے اپنا موبائل واٹس ایپ منسلک کریں',
    connect_modal_title: 'واٹس ایپ بھیجنے والا اکاؤنٹ منسلک کریں',
    connect_modal_subtitle: 'اپنا اکاؤنٹ جوڑنے کے لیے فون کے واٹس ایپ سے کیو آر کوڈ اسکین کریں۔',
    step_1_title: 'واٹس ایپ کھولیں',
    step_1_desc: 'اپنے فون پر واٹس ایپ کھولیں اور مینو (⋮) یا سیٹنگز پر ٹیپ کریں',
    step_2_title: 'لنکڈ ڈیوائسز',
    step_2_desc: 'لنکڈ ڈیوائسز > لنک آ ڈیوائس پر ٹیپ کریں',
    step_3_title: 'کیو آر کوڈ اسکین کریں',
    step_3_desc: 'کیو آر کوڈ اسکین کرنے کے لیے اپنے فون کا کیمرہ اسکرین پر لائیں',
    phone_label_custom: 'یا براہ راست فون نمبر منسلک کریں:',
    btn_confirm_device_linked: '✓ ڈیوائس لنک فعال کریں',
    qr_refreshing: 'کیو آر کوڈ تازہ ہو رہا ہے...',
    btn_refresh_qr: 'کیو آر تازہ کریں',
    pairing_success_toast: '🎉 واٹس ایپ ڈیوائس کامیابی کے ساتھ منسلک ہو گئی! تمام یاد دہانیاں اس نمبر سے بھیجی جائیں گی۔',
    unlinked_toast: '✓ واٹس ایپ ڈیوائس کا رابطہ ختم کر دیا گیا۔',
    btn_open_desktop_qr: '🖥️ واٹس ایپ ویب لاگ ان ونڈو کھولیں',
    btn_direct_send: '📲 براہ راست بھیجیں (wa.me)',
    desktop_window_launched: '⚡ آپ کے ڈیسک ٹاپ پر واٹس ایپ ونڈو کھل گئی ہے! تصدیق کے لیے کیو آر کوڈ اسکین کریں۔',

    // Modal
    preview_modal_title: 'جیمنی اے آئی واٹس ایپ یاد دہانی پیش نظارہ',
    recipient_phone: 'وصول کنندہ واٹس ایپ نمبر',
    ai_message_draft: 'جیمنی خودکار پیغام کا مسودہ',
    copy_message: 'متن کاپی کریں',
    copied: 'کاپی ہو گیا!',
    open_whatsapp: 'واٹس ایپ ویب لنک کھولیں',
    close: 'بند کریں',
    cfo_title: 'اے آئی سی ایف او اسسٹنٹ',
    cfo_sub: 'حقیقی وقت کی مالیاتی ذہانت',
    cfo_suggestions: 'فوری تجاویز:',
    cfo_placeholder: 'اپنے اے آئی سی ایف او سے سوال پوچھیں...',
    cfo_send: 'بھیجیں',

    // Value Propositions
    val_heading_1: 'پیچیدہ اسپریڈ شیٹس کے بجائے اپنائیں',
    val_heading_2: 'اسمارٹ فنانشل کوپائلٹ',
    val_subheading: 'آپ کے بڑھتے ہوئے کاروبار کی ضرورت: رن وے مانیٹرنگ، فنانسنگ اہلیت، اور اخراجات میں کمی — سب ایک ہی ڈیش بورڈ میں۔',
    val_card1_title: 'کیش فلو ذہانت',
    val_card1_item1: '30/60/90 روزہ کیش فلو تخمینہ',
    val_card1_item2: 'کم لیکویڈیٹی کی پیشگی وارننگ',
    val_card1_item3: 'واجب الوصول رقوم کی خودکار ٹریکنگ',
    val_card2_title: 'کریڈٹ تیاری',
    val_card2_item1: 'فنانشل پائلٹ کریڈٹ سکور (0–100)',
    val_card2_item2: 'چار بنیادی مالیاتی عوامل کا تجزیہ',
    val_card2_item3: 'جیمنی اے آئی کا طریقہ کار برائے بہتری',
    val_card3_title: 'تعمیل اور سیکیورٹی گارڈ',
    val_card3_item1: 'بے ضابطگیوں اور دھوکہ دہی کی نشاندہی',
    val_card3_item2: 'براہ راست ٹیکس واجبات کا تخمینہ',
    val_card3_item3: 'اکاؤنٹنٹ اور آڈیٹر پورٹل برائے ایکسپورٹ',
    val_card4_title: 'خریداری اے آئی',
    val_card4_item1: 'وینڈر ری آرڈر الرٹس',
    val_card4_item2: 'مشترکہ خریداری کے مواقع',
    val_card4_item3: 'سپلائر مذاکرات کوپائلٹ',

    // Business Needs (5 Pillars)
    bn_heading_1: 'پانچ بنیادی مالیاتی ستون جن کی ہر',
    bn_heading_2: 'کاروبار کو ضرورت ہے',
    bn_subheading: 'جدید ترقی پذیر کاروباروں کے لیے کیش ویزیبلٹی گیپ کو حل کرنے کے لیے بنائے گئے منظم ماڈیولز۔',
    bn_p1_title: 'شفافیت',
    bn_p1_desc: 'بالکل واضح جانیں کہ آپ کا کیش کہاں سے آ رہا ہے اور کہاں جا رہا ہے — مہینے کے اختتام کا انتظار کیے بغیر۔',
    bn_p2_title: 'پیشین گوئی',
    bn_p2_desc: 'مستقبل کے 30، 60، اور 90 دن دیکھیں تاکہ آپ تنخواہوں کی ادائیگی اور سپلائر کی شرائط باآسانی طے کر سکیں۔',
    bn_p3_title: 'کریڈٹ صحت',
    bn_p3_desc: 'ایک مضبوط کاروباری کریڈٹ پروفائل بنائیں تاکہ قرض یا کریڈٹ لائن کے مواقع آنے پر آپ ہمیشہ تیار رہیں۔',
    bn_p4_title: 'تعمیل',
    bn_p4_desc: 'ٹیکس کے معاملات سے آگے رہیں، آڈٹ سے پہلے بے ضابطگیوں کو پکڑیں، اور اپنے کھاتوں کو خودکار مانیٹرنگ سے صاف رکھیں۔',
    bn_p5_title: 'ذہانت',
    bn_p5_desc: 'خام مالیاتی ڈیٹا کو ایک ایسے اے آئی کے ذریعے حکمت عملی میں تبدیل کریں جو آسان اور واضح زبان بولتا ہو۔',

    // Pricing Section
    pricing_heading_1: 'کاروباری ترقی کے لیے',
    pricing_heading_2: 'منصفانہ قیمتیں',
    pricing_subheading: 'اپنا 14 روزہ مفت ٹرائل شروع کریں۔ کسی کریڈٹ کارڈ کی ضرورت نہیں۔ کسی بھی وقت منسوخ کریں۔',
    pricing_monthly: 'ماہانہ',
    pricing_yearly: 'سالانہ',
    pricing_save: '20% بچت',
    pricing_plan_essentials: 'بنیادی',
    pricing_desc_essentials: 'سولو فاؤنڈرز اور مائیکرو کاروباروں کے لیے بنیادی مالیاتی رن وے کی مرئیت۔',
    pricing_plan_growth: 'ترقی',
    pricing_desc_growth: 'قرض کی اہلیت اور پھیلتے ہوئے کاروباروں کے لیے مکمل مالیاتی ذہانت۔',
    pricing_popular: 'سب سے زیادہ مقبول',
    pricing_plan_scale: 'وسیع پیمانہ',
    pricing_desc_scale: 'انٹرپرائز گریڈ مالیاتی تجزیات اور ملٹی لیجر انٹیلیجنس۔',
    pricing_start_trial: '14 روزہ مفت ٹرائل شروع کریں',
    pricing_per_month: '/ماہ',

    // FAQ Section
    faq_heading_1: 'اکثر پوچھے گئے',
    faq_heading_2: 'سوالات',
    faq_subheading: 'فنانشل پائلٹ کے ڈھانچے اور کوپائلٹ انجن کے بارے میں تمام اہم معلومات۔',
    faq_q1: 'کیش فلو فورکاسٹر میرے بیلنس کا تخمینہ کیسے لگاتا ہے؟',
    faq_a1: 'فنانشل پائلٹ آپ کے لوکل CSV لیجر لین دین کا تجزیہ کرتا ہے، 90 دن کی اوسط نکالتا ہے، اور 7 سے 90 دن کے تخمینے خودکار وارننگ کے ساتھ تیار کرتا ہے۔',
    faq_q2: 'کریڈٹ ریڈینس سکور کس بنیاد پر تیار ہوتا ہے؟',
    faq_a2: '0-100 سکور چار بنیادی اصولوں پر مشتمل ہے: ماہانہ آمدنی کا تسلسل، خالص منافع، وصولی کی رفتار، اور اخراجات پر قابو۔ جیمنی اے آئی پھر بہتری کے مشورے دیتا ہے۔',
    faq_q3: 'میرا مالیاتی ڈیٹا کہاں محفوظ کیا جاتا ہے؟',
    faq_a3: 'ہمارے فیز 1 ایم وی پی کے دوران تمام ڈیٹا آپ کی مشین پر /backend/data/ میں محفوظ رہتا ہے۔ کوئی خفیہ معلومات آپ کے سرور سے باہر نہیں جاتی۔',
    faq_q4: 'فنانشل پائلٹ اپنے ڈیٹا اور ماڈیولز کو کیسے منظم رکھتا ہے؟',
    faq_a4: 'فنانشل پائلٹ سخت فنکشن کنٹریکٹ نافذ کرتا ہے: تمام تجزیاتی ماڈیولز خالص پائتھن فنکشنز ہیں جو فاسٹ اے پی آئی کے ذریعے جڑے ہیں۔',

    // Call To Action & Footer
    cta_heading_1: 'کیا آپ اپنے کاروباری مالیات پر',
    cta_heading_2: 'اندھیرے میں سفر ختم کرنے کو تیار ہیں؟',
    cta_subheading: 'ان جدید تاجروں میں شامل ہوں جو فنانشل پائلٹ کو اعتماد کے ساتھ کیش فلو کی پیشین گوئی اور کریڈٹ تیاری کے لیے استعمال کرتے ہیں۔',
    cta_launch_btn: 'لائیو ڈیش بورڈ کھولیں',
    cta_api_docs: 'بیک اینڈ اے پی آئی دیکھیں',
    footer_tagline: 'ذہین کیش فلو پیشین گوئی اور کریڈٹ تیاری کے ذریعے بڑھتے ہوئے کاروباروں کو بااختیار بنانا۔',
    footer_col_engines: 'مالیاتی انجن',
    footer_col_ops: 'آپریشنز سوٹ',
    footer_col_system: 'سسٹم کا ڈھانچہ',
    footer_active_status: 'فاسٹ اے پی آئی انجن: فعال',
    footer_local_csv: 'مقامی CSV معاہدہ: ہم آہنگ',
    footer_rights: 'فنانشل پائلٹ اے آئی۔ جملہ حقوق محفوظ ہیں۔ سخت فنکشن کنٹریکٹ اور پانڈاس فن تعمیر۔',

    // Inner Pages Common & Specific
    cf_badge: 'پیشین گوئی لیکویڈیٹی انجن',
    cf_title_1: 'کیش فلو',
    cf_title_2: 'پیشین گوئی',
    cf_subtitle: 'پانڈاس اور جیمنی اے آئی سے تیار کردہ خودکار کیش رن وے تخمینہ',
    cf_alert_title: 'کیش ریزرو الرٹ',
    cf_baseline_balance: 'تاریخی بنیاد کا بیلنس',
    cf_after_forecast: 'تخمینہ مدت کے بعد',
    cf_daily_rate: 'گزشتہ 90 دن کی روزانہ شرح',
    cf_receivables: 'واجب الوصول رقوم',
    cf_curve_title: 'کیش پروجیکشن گراف',
    cf_curve_subtitle: 'معیاری اتار چڑھاؤ ماڈلنگ کے ساتھ تخمینہ کاری',
    cf_exec_title: 'ایگزیکٹو کیش فلو تجزیہ',
    cf_gemini_by: 'گوگل جیمنی اے آئی کا تیار کردہ',

    ag_badge: 'آڈٹ اور فارنزک رسک انجن',
    ag_title_1: 'بے ضابطگی اور دھوکہ دہی',
    ag_title_2: 'گارڈ',
    ag_subtitle: 'ڈپلیکیٹ انوائسز، ادائیگی کے آؤٹ لائرز اور قیمتوں کے جھٹکے پکڑنے والا حقیقی وقت کا آڈٹ',
    ag_rescan: 'لیجر دوبارہ اسکین کریں',
    ag_total_flagged: 'کل نشاندہی شدہ',
    ag_across_algos: '3 آڈٹ الگورتھم کے تحت',
    ag_high_severity: 'انتہائی سنگین خطرات',
    ag_cpa_review: 'فوری سی پی اے جائزہ درکار ہے',
    ag_potential_exposure: 'ممکنہ مالیاتی خطرہ',
    ag_cumulative_value: 'زیر جائزہ مجموعی رقم',
    ag_engine_active: 'ڈیٹیکشن انجن',
    ag_active_100: 'فعال • 100%',
    ag_filter_all: 'تمام بے ضابطگیاں',
    ag_filter_high: 'صرف سنگین خطرات',
    ag_filter_dup: 'ڈپلیکیٹ انوائسز',
    ag_filter_pay: 'غیر معمولی ادائیگیاں',
    ag_filter_price: 'قیمتوں میں اضافہ',
    ag_search: 'انوائس، وینڈر یا تفصیل تلاش کریں...',
    ag_col_id: 'حوالہ نمبر',
    ag_col_category: 'قسم',
    ag_col_entity: 'وینڈر / ادارہ',
    ag_col_amount: 'رقم',
    ag_col_severity: 'شدت',
    ag_col_reason: 'آڈٹ الرٹ کی وجہ',
    ag_col_action: 'کارروائی',
    ag_btn_review: 'جائزہ مکمل کریں',
    ag_btn_reviewed: '✓ جائزہ مکمل',
    ag_badge_high: 'انتہائی سنگین',
    ag_badge_medium: 'درمیانہ خطرہ',
    ag_badge_low: 'کم خطرہ',
    ag_no_records: 'کوئی مشکوک ریکارڈ نہیں ملا',

    tax_badge: 'متحرک ٹیکس اور تعمیل انجن',
    tax_title_1: 'ٹیکس اور ریگولیٹری',
    tax_title_2: 'اسسٹنٹ',
    tax_subtitle: 'خودکار کارپوریٹ انکم ٹیکس ریزرو، سیلز ٹیکس اور ریگولیٹری فائلنگ ٹائم لائنز',
    tax_gross_rev: 'کل آمدنی (سالانہ)',
    tax_deductibles: 'کٹوتی کے قابل اخراجات',
    tax_taxable_inc: 'خالص قابل ٹیکس آمدنی',
    tax_next_filing: 'اگلی ٹیکس تاریخ',
    tax_download_report: 'ٹیکس میمو ڈاؤن لوڈ کریں (.txt)',
    tax_copy_cpa: 'سی پی اے کے لیے کاپی کریں',
    tax_all_deadlines: 'تمام تاریخیں',
    tax_federal: 'وفاقی واجبات',
    tax_state_payroll: 'صوبائی اور پے رول',
    tax_cpa_memo_title: 'جیمنی سی پی اے مشاورتی میمو',
    tax_rate_breakdown: 'وفاقی 21% + صوبائی 5% + سیلز ٹیکس',
    tax_irc_eligible: 'قانونی دفعہ 162 اور COGS کٹوتی کے اہل',
    tax_rev_less_ded: 'آمدنی',
    tax_less_ded: 'منہا کٹوتیاں',
    tax_net_due: 'خالص واجب الادا رقم:',
    tax_liability_breakdown: 'ٹیکس واجبات اور کٹوتیوں کی تفصیل',
    tax_cost_accounting_guide: 'قانونی رہنما اصولوں کے مطابق گارمنٹس مینوفیکچرنگ لاگت اکاؤنٹنگ',
    tax_combined_rate: 'مشترکہ شرح 26.0%',
    tax_est_corp_tax: 'متوقع کارپوریٹ انکم ٹیکس',
    tax_fed_state: 'وفاقی (21%) + صوبائی فرنچائز (5%)',
    tax_sales_provision: 'سیلز اور استعمال ٹیکس کی فراہمی',
    tax_sales_goods: '~4.0% تیار مال کی فروخت پر تخمینہ',
    tax_qualifying_deductibles: 'اہل کٹوتی کے اخراجات',
    tax_total: 'کل',
    tax_std_ded: 'معیاری کٹوتی',
    tax_cogs_label: 'خام مال اور ٹیکسٹائل (COGS)',
    tax_cogs_sub: 'براہ راست کپڑے اور دھاگے کا خرچ',
    tax_payroll_label: 'مینوفیکچرنگ پے رول',
    tax_payroll_sub: 'سلائی آپریٹرز، کٹرز اور کاریگر',
    tax_lease_label: 'فیکٹری سہولت لیز',
    tax_lease_sub: 'فیکٹری فلور اور گودام کی جگہ',
    tax_power_label: 'صنعتی بجلی اور پاور',
    tax_power_sub: 'ہائی وولٹیج کٹنگ اور پلانٹ کی بجلی',
    tax_marketing_label: 'ہول سیل پروموشن',
    tax_marketing_sub: 'تجارتی نمائشیں اور اپیرل شو رومز',
    tax_prior_prepayments: 'ریکارڈ شدہ پیشگی ٹیکس / ودہولڈنگ:',
    tax_ai_memo_badge: 'جیمنی اے آئی ایڈوائزری • آڈٹ کے لیے تیار سی پی اے پیپرز',
    tax_ai_memo_title: 'ایگزیکٹو ٹیکس میمورنڈم اور تعمیل کا خلاصہ',
    tax_copy_memo: 'میمو کاپی کریں',
    tax_copied: 'کاپی ہو گیا!',
    tax_download_report_btn: 'رپورٹ ڈاؤن لوڈ کریں',
    tax_memo_to: 'بنام: وصول کنندہ',
    tax_cpa_team: 'لیڈ کارپوریٹ سی پی اے',
    tax_advisory_team: 'اور مالیاتی مشاورتی ٹیم',
    tax_memo_entity: 'ادارہ / تنظیم',
    tax_apparel_ops: 'گارمنٹس مینوفیکچرنگ آپریشنز',
    tax_memo_period: 'رپورٹنگ کا دورانیہ',
    tax_books_verified: 'کھاتے بند اور تصدیق شدہ',
    tax_memo_audit: 'آڈٹ اتھارٹی',
    tax_safe_harbor: 'سیف ہاربر کے مطابق',
    tax_sec1_title: 'ایگزیکٹو خلاصہ اور ٹیکس کی پوزیشن',
    tax_net_bal_label: 'خالص بیلنس:',
    tax_gross_rev_col: 'کل آمدنی',
    tax_net_tax_base: 'خالص قابل ٹیکس بنیاد',
    tax_est_tot_tax: 'متوقع کل ٹیکس',
    tax_prior_remit: 'سابقہ ادائیگیاں',
    tax_sec2_title: 'کٹوتی کے قابل اخراجات کی درجہ بندی اور آڈٹ تیاری',
    tax_qualified: 'اہل',
    tax_sec2_desc: 'آپریشنل کٹوتیاں قانونی زمروں میں آڈٹ شدہ مینوفیکچرنگ اخراجات کو ظاہر کرتی ہیں:',
    tax_cogs_title: 'خام مال اور سپلائیز (COGS)',
    tax_cogs_memo_sub: 'براہ راست ٹیکسٹائل اور کپڑے کی خریداری۔ انوینٹری مفاہمت برقرار رکھیں۔',
    tax_direct_payroll: 'براہ راست اور آپریشنل پے رول',
    tax_payroll_memo_sub: 'پلانٹ کے سلائی آپریٹرز اور مکینکس۔ سہ ماہی فائلنگ کے ساتھ منسلک۔',
    tax_facility_overhead: 'سہولت اور پیداواری اخراجات',
    tax_lease_memo_sub: 'فیکٹری گودام لیز اور ہائی وولٹیج بجلی کے اخراجات۔',
    tax_wholesale_dist: 'ہول سیل ڈسٹری بیوشن اور اخراجات',
    tax_wholesale_sub: 'اپیرل ٹریڈ شو نمائشیں اور بی ٹو بی کیٹلاگ مارکیٹنگ مہمات۔',
    tax_sec3_title: 'ریگولیٹری فائلنگ کیلنڈر اور ایکشن پلان',
    tax_days_next: 'اگلی فائلنگ میں دن باقی',
    tax_plan_1: 'سیف ہاربر ادائیگی: 100% پچھلے سال کے معیار کو پورا کرنے کے لیے سہ ماہی قسط جمع کروائیں',
    tax_required: 'لازمی',
    tax_plan_2: 'COGS دستاویزات: $2,500 سے زائد تمام کپڑے کے اخراجات کے انوائسز محفوظ رکھیں',
    tax_audit_record: 'آڈٹ ریکارڈ',
    tax_plan_3: 'فارم 941 مفاہمت: پے رول کے اندراجات کو بے روزگاری انشورنس کے ساتھ ملائیں',
    tax_scheduled: 'شیڈول شدہ',
    tax_generating: 'ٹیکس کا خلاصہ تیار ہو رہا ہے...',
    tax_irc_verified: 'حسابات قانونی مینوفیکچرنگ COGS دفعات کے مطابق تصدیق شدہ ہیں',
    tax_download_success: 'ٹیکس اور تعمیل ایگزیکٹو سمری رپورٹ کامیابی سے ڈاؤن لوڈ ہو گئی۔',
    tax_engine_error: 'ٹیکس انجن میں خرابی',

    sp_badge: 'مونٹی کارلو تخمینہ انجن • 500 امکانی راستے',
    sp_title_1: 'منظر نامہ',
    sp_title_2: 'پلانر',
    sp_subtitle: 'مختلف اعتمادی فیصد میں آمدنی کے اتار چڑھاؤ، نئی بھرتیوں، اور اخراجات کے دباؤ کی جانچ کریں',
    sp_sales_change: 'سیلز والیوم جھٹکا',
    sp_new_hires: 'نئی ماہانہ بھرتیاں',
    sp_procurement: 'خریداری لاگت میں تبدیلی',
    sp_ar_delay: 'ادائیگی میں تاخیر',
    sp_reset_params: 'بنیادی حالت پر ری سیٹ',
    sp_run_simulation: 'منظر نامہ چلائیں',
    sp_simulating: 'حساب لگایا جا رہا ہے...',
    sp_dynamic_levers: 'متحرک رسک لیورز',
    sp_dynamic_levers_sub: 'منفی اثرات کے خلاف مالیاتی استحکام جانچنے کے لیے متغیرات تبدیل کریں',
    sp_recalculating: '500 راستوں کا لائیو دوبارہ حساب...',
    sp_days: 'دن',
    sp_sales_revenue_shift: 'سیلز ریونیو تبدیلی',
    sp_recession: 'کساد بازاری',
    sp_surge: 'اضافہ',
    sp_baseline: 'بنیادی سطح',
    sp_headcount: 'ملازمین کی تعداد / بھرتیاں',
    sp_hires: 'بھرتیاں',
    sp_staff: 'اسٹاف',
    sp_est_payroll: 'متوقع تنخواہیں:',
    sp_procurement_costs: 'خام مال کے اخراجات',
    sp_discount: 'رعایت',
    sp_flat: 'مستحکم',
    sp_inflation: 'مہنگائی',
    sp_collections_shift: 'وصولیوں کا وقت',
    sp_fast: 'تیز',
    sp_normal: 'معمول',
    sp_delinquent: 'تاخیر',
    sp_delay: 'تاخیر',
    sp_kpi_ending_cash: 'متوقع اختتامی نقد رقم (P50)',
    sp_kpi_vs_baseline: 'بنیادی سطح کے مقابلے میں',
    sp_kpi_worst_case: 'شدید ترین دباؤ کی صورتحال (P10)',
    sp_kpi_bearish_floor: '10واں پرسنٹائل نچلی سطح',
    sp_kpi_buffer_risk: 'حد سے گرنے کا خطرہ',
    sp_kpi_buffer_desc: '$5,000 کی حد سے نیچے آنے کا امکان',
    sp_kpi_spend_shift: 'خام مال پر اخراجات میں تبدیلی',
    sp_fan_chart_title: 'مونٹی کارلو کیش رن وے فین چارٹ',
    sp_fan_chart_sub: 'فیصد کی تقسیم: اوسط راستہ (P50)، 50% اعتمادی دائرہ (P25–P75)، اور 80% اعتمادی دائرہ (P10–P90)',
    sp_legend_median: 'P50 (اوسط)',
    sp_legend_band: 'P25–P75 دائرہ',
    sp_legend_stress: 'P10 دباؤ کی نچلی سطح',
    sp_legend_baseline: 'بنیادی لکیر',
    sp_min_reserve: 'کم از کم ریزرو $5k',
    sp_gemini_advisory: 'جیمنی اے آئی پیشین گوئی مشورہ',
    sp_gemini_executive: 'ایگزیکٹو منظر نامہ اور رسک تجزیہ',
    sp_insight_runway: 'رن وے اور نقد رقم کی صورتحال',
    sp_insight_sensitivity: 'حساسیت اور لاگت کے محرکات',
    sp_insight_recommendations: 'اسٹریٹجک تجاویز',
    sp_sim_paths_label: '500 امکانی راستوں کی تخمینہ کاری جاری...',
    sp_preset_base: 'بنیادی حالت',
    sp_preset_bull: 'تیزی کی مارکیٹ (+20%)',
    sp_preset_shock: 'سپلائی بحران (+25% لاگت)',
    sp_preset_recession: 'شدید کساد بازاری (-30% سیلز)',
    sp_bullish_p90: '90واں فیصد (بہترین)',
    sp_median_p50: 'درمیانی (متوقع P50)',
    sp_stress_p10: '10واں فیصد (انتہائی دباؤ)',
    sp_gemini_analysis: 'جیمنی منظر نامہ رسک تجزیہ',

    ap_badge: 'تصدیق شدہ GAAP ورک پیپرز • بیرونی انڈر رائٹنگ پورٹل',
    ap_title_1: 'اکاؤنٹنٹ اور قرض دہندہ',
    ap_title_2: 'پورٹل',
    ap_subtitle: 'سی پی اے آڈیٹرز، بینک قرض دہندگان اور کریڈٹ انڈر رائٹرز کے لیے صرف پڑھنے کا بیرونی پورٹل',
    ap_export_csv: 'CSV ڈاؤن لوڈ کریں',
    ap_export_pkg: 'اسٹیٹمنٹ پیکیج برآمد کریں',
    ap_generate_dossier: '⚡ قرض دہندہ ڈوزیئر تیار کریں',
    ap_compiling: 'تیار کیا جا رہا ہے...',
    ap_readonly_badge: 'تصدیق شدہ صرف پڑھنے کے لیے',
    ap_write_locked: 'تبدیلی کے کنٹرول بند ہیں',
    ap_checksum: 'کریپٹوگرافک تصدیق شدہ اسنیپ شاٹ • چیک سم:',
    ap_viewing_as: 'بطور دیکھنے والا:',
    ap_role_auditor: 'آڈیٹر',
    ap_role_lender: 'قرض دہندہ',
    ap_role_accountant: 'اکاؤنٹنٹ',
    ap_underwriting_lens: 'فعال انڈر رائٹنگ زاویہ:',
    ap_controls_rating: 'کنٹرولز کی درجہ بندی:',
    ap_balance_sheet: 'بیلنس شیٹ',
    ap_income_statement: 'آمدنی کا گوشوارہ (P&L)',
    ap_cash_flow: 'کیش فلو اسٹیٹمنٹ',
    ap_in_usd: 'امریکی ڈالر میں',
    ap_accrual_basis: 'حسابداری کی بنیاد',
    ap_current_assets: 'موجودہ اثاثے',
    ap_cash_equiv: 'نقد رقم اور اس کے مساوی',
    ap_ar_net: 'قابل وصول اکاؤنٹس (خالص)',
    ap_inventory: 'انوینٹری ویلیوایشن',
    ap_total_current_assets: 'کل موجودہ اثاثے',
    ap_liab_equity: 'واجبات اور ایکویٹی',
    ap_ap_supplier: 'قابل ادائیگی اکاؤنٹس (سپلائرز)',
    ap_accrued_opex: 'واجب الادا آپریشنل اخراجات',
    ap_short_term_debt: 'قلیل مدتی قرض کے واجبات',
    ap_total_current_liab: 'کل موجودہ واجبات',
    ap_retained_equity: 'برقرار منافع اور ایکویٹی',
    ap_total_liab_equity: 'کل واجبات اور ایکویٹی',
    ap_balanced_verified: 'حسابداری مساوات تصدیق شدہ: اثاثے = واجبات + ایکویٹی (متوازن)',
    ap_variance: '0 فرق',
    ap_statement_ops: 'آپریشنز کا گوشوارہ (P&L)',
    ap_fiscal_accrual: 'مالیاتی سال بہ تاریخ جمع شدہ بنیاد',
    ap_net_margin: 'خالص منافع کا مارجن:',
    ap_gross_revenue: 'کل مجموعی آمدنی',
    ap_cogs: 'منہا: فروخت شدہ اشیاء کی لاگت (خام مال)',
    ap_gross_profit: 'مجموعی منافع',
    ap_opex_header: 'آپریٹنگ اخراجات (SG&A)',
    ap_opex_payroll: '• براہ راست اور آپریشنل تنخواہیں',
    ap_opex_rent: '• فیکٹری سہولیات کے کرائے',
    ap_opex_utilities: '• صنعتی بجلی و گیس (یوٹیلٹیز)',
    ap_opex_marketing: '• ہول سیل تشہیر اور مارکیٹنگ',
    ap_operating_income: 'آپریٹنگ آمدنی (EBITDA)',
    ap_tax_provision: 'منہا: متوقع ٹیکس پروویژن',
    ap_net_income: 'خالص آمدنی',
    ap_cf_title: 'کیش فلو کا گوشوارہ',
    ap_cf_reconciliation: 'کیش اکاؤنٹنگ مفاہمت',
    ap_cf_operating: 'آپریٹنگ سرگرمیوں سے نقد بہاؤ',
    ap_cf_investing: 'سرمایہ کاری سرگرمیوں سے نقد بہاؤ',
    ap_cf_financing: 'مالیاتی سرگرمیوں سے نقد بہاؤ',
    ap_cf_ending: 'اختتامی نقد رقم اور مائع ذخائر',
    ap_consent_title: 'ڈیٹا کی رضامندی اور اشتراک کا لنک',
    ap_active_grant: 'فعال اجازت',
    ap_token_label: 'رسائی ٹوکن',
    ap_granted_by: 'اجازت دہندہ',
    ap_access_exp: 'رسائی کے خاتمے کی تاریخ',
    ap_copied: 'اشتراک کا لنک کلپ بورڈ پر کاپی ہو گیا',
    ap_copy_link: 'صرف پڑھنے کا بیرونی لنک کاپی کریں',
    ap_audit_title: 'ناقابل تبدیلی پورٹل رسائی آڈٹ لاگ',
    ap_audit_subtitle: 'وقت کے ساتھ درج لیجر رسائی کے واقعات',
    ap_col_timestamp: 'وقت',
    ap_col_actor_role: 'شخص اور کردار',
    ap_col_action: 'عمل',
    ap_col_verification: 'تصدیق',
    ap_export_success: 'تصدیق شدہ مالیاتی گوشوارے کامیابی سے برآمد ہو گئے۔',
    ap_dossier_success: 'SHA-256 مہر کے ساتھ جامع قرض دہندہ تعمیل ڈوزیئر کامیابی سے ڈاؤن لوڈ ہو گیا!',

    scan_title: 'انوائس اور رسید اسکینر',
    scan_subtitle: 'اے آئی وژن اور او سی آر خودکار لیجر اخراج',
    scan_dropzone: 'انوائس یا رسید یہاں ڈراپ کریں یا براؤز کریں',
    scan_supported: '25MB تک پی ڈی ایف، PNG، JPG رسیدیں معاون ہیں',
    scan_or_test: 'یا نمونہ انوائس کے ساتھ ٹیسٹ کریں:',
    scan_sample_1: 'ایکمی فریٹ بل ($3,480)',
    scan_sample_2: 'کلاؤڈ انفراسٹرکچر ($1,850)',
    scan_parsing: 'تجزیہ کیا جا رہا ہے',
    scan_with_ocr: 'او سی آر وژن کے ذریعے…',
    scan_extracting: 'وینڈر، اخراجات کی تفصیل اور ادائیگی کی شرائط نکالی جا رہی ہیں',
    scan_detected_vendor: 'شناخت شدہ وینڈر',
    scan_confidence: 'اعتمادی درجہ',
    scan_issue_date: 'جاری ہونے کی تاریخ',
    scan_due_date: 'آخری تاریخ',
    scan_category: 'کیٹیگری',
    scan_extracted_items: 'برآمد شدہ اشیاء',
    scan_total_amount: 'کل رقم',
    scan_another: 'ایک اور اسکین کریں',
    scan_confirm_sync: 'تصدیق کریں اور لیجر میں محفوظ کریں',
    scan_recorded_alert: 'انوائس کامیابی کے ساتھ /backend/data/invoices.csv میں ریکارڈ ہو گئی!',
    scan_scanning: 'ڈیٹا نکالا جا رہا ہے...',
    scan_result_title: 'تصدیق شدہ رسید لیجر انٹری',
    scan_save: 'لیجر میں محفوظ کریں',
    scan_cancel: 'منسوخ کریں',

    // WhatsApp & Scenario Edit Mode
    add_target: 'نیا ہدف شامل کریں',
    edit_target: 'ہدف میں ترمیم کریں',
    btn_edit: 'ترمیم',
    save_changes: 'تبدیلیاں محفوظ کریں',
    delete_target: 'ہدف حذف کریں',
    cancel: 'منسوخ کریں',
    custom_projections_title: 'لائیو ڈیمو حسب ضرورت تخمینے (آمدنی اور اخراجات)',
    custom_projections_desc: '500 راستوں کو فوری دوبارہ گننے کے لیے گرانٹ، سرمایہ یا خریداری شامل کریں',
    add_line_item: 'آئٹم شامل کریں',
    item_name_placeholder: 'مثال: سرکاری گرانٹ / مشینری کا خرچ',
    item_amount: 'رقم ($)',
    inflow: 'آمدنی (+)',
    outflow: 'اخراجات (-)',
    active: 'فعال',
    inactive: 'غیر فعال',
    net_custom_impact: 'خالص اضافی اثر',
    total_custom_inflows: 'کل اضافی آمدنی',
    total_custom_outflows: 'کل اضافی اخراجات',
  },

  zh: {
    app_name: 'Financial Pilot',
    hero_badge: '专为成长型企业打造的 AI 智能财务副驾',
    hero_title_1: '别再在企业财务跑道上',
    hero_title_2: '盲目飞行',
    hero_banner_title_1: '专为成长型企业打造的',
    hero_banner_title_2: 'AI 智能财务副驾',
    btn_view_cash_forecast: '查看现金流预测',
    btn_calc_credit_score: '测算信用评分',
    hero_subtitle: 'Financial Pilot 为您提供实时现金流预测、企业商业信用评分、异常交易监测与 Gemini 驱动的智能解析——全流程聚合于统一控制台。',
    hero_launch_dashboard: '进入实时仪表盘',
    hero_explore_forecast: '体验现金预测引擎',
    nav_dashboard: '晨间看板',
    nav_cash_flow: '现金流预测',
    nav_credit_score: '信贷就绪评分',
    nav_scenario: '情景规划模拟器',
    nav_whatsapp: '智能微信/WhatsApp催收',
    nav_anomaly: '异常与反欺诈守卫',
    nav_tax: '税务与合规助手',
    nav_accountant: '审计会计与资方门户',
    nav_inventory: '库存预警',
    nav_pricing: '定价优化顾问',
    nav_negotiation: '供应商谈判副驾',
    crisis_mode: '危机模式',
    crisis_injecting: '注入中...',
    reset_data: '重置',
    syncing: '同步中...',
    scan_invoice: '扫描',
    launch_hub: '进入控制台',
    menu_open: '菜单',
    group_cash: '现金流与财务健康',
    group_compliance: '合规与风控治理',
    group_supply: '供应链与商业增长',
    badge_core: '核心引擎',
    badge_security: '安全盾牌',
    badge_growth: '增长与利润',
    desc_dashboard: '7/30/90 天现金概览与每日生存跑道健康监测',
    desc_cash_flow: '30/60/90 天现金轨迹预测与波动性风险建模',
    desc_credit_score: '0-100 银行借贷评级与 Gemini AI 提升建议',
    desc_scenario: '基于蒙特卡洛算法的现金流情景推演',
    desc_whatsapp: 'AI 自动化催收提醒与一键应收账款核销',
    desc_anomaly: '识别可疑交易、重复请款与幽灵发票',
    desc_tax: '增值税/销售税测算、季度动态预提与申报日历',
    desc_accountant: '资方与审计专属只读门户、一键生成融资报告',
    desc_inventory: '低库存预警与自动化补货阈值监控',
    desc_pricing: '利润率优化与价格弹性分析建模',
    desc_negotiation: 'AI 生成的供应商谈判策略与简报',
    desc_procure: '供应商支出分析与采购交付周期建模',
    trusted_brands: '巴基斯坦领先纺织与零售领军企业的信赖之选',

    // Section Header & Hub
    live_engine_status: '实时数据引擎 • Python 后端已连接',
    real_time_financial: '实时财务',
    intelligence_hub: '智能驾驶舱',
    live_metrics_calc: '由 Pandas 基于本地 CSV 数据合约实时计算，结合 Gemini AI 极速执行分析。',

    // Low Cash Warning Banner
    low_cash_title: '低现金储备预警',
    action_required: '急需处理',
    low_cash_desc_prefix: '预计现金将在以下日期跌破 $5,000 安全线：',
    low_cash_desc_suffix: '。点击此处打开现金流预测器以查看资金跑道。',
    inspect_runway: '查看资金跑道',

    // Controls: Horizon Selector
    forecast_horizon: '预测周期：',
    days_ahead: '天展望',

    // Cross-Module Quick Jump Hub
    module_anomaly: '异常守卫',
    module_anomaly_sub: '重复发票与离群值审计',
    module_tax: '税务助手',
    module_tax_sub: '税费扣除与会计备忘录',
    module_scenario: '情景规划',
    module_scenario_sub: '销售与成本冲击模拟',
    module_accountant: '资方门户',
    module_accountant_sub: '审计与贷款审批导出',
    module_whatsapp: '智能催收',
    module_whatsapp_sub: '逾期提醒与账款回笼',
    badge_flags: '条警报',
    badge_active: '运行中',
    badge_due: '天到期',
    badge_monte_carlo: '蒙特卡洛',
    badge_gaap: 'GAAP 认证',
    badge_ai_collections: 'AI 智能催收',

    // Quick Drawer Links
    quick_tools: '快捷工具与导航',
    live_engines: '实时核保引擎',
    forecaster_tool: '现金预测',
    forecaster_sub: '30-90天走势',
    score_engine_tool: '评分引擎',
    score_engine_sub: '银行就绪0-100',
    scenario_tool: '情景模拟',
    scenario_sub: '蒙特卡洛模型',
    fraud_guard_tool: '防伪风控',
    fraud_sub: '重复发票AI',
    tax_assistant_tool: '税务助手',
    tax_sub: '季度预提储备',
    accountant_tool: '资方门户',
    accountant_sub: '审计与放款导出',
    whatsapp_tool: '智能催收',
    whatsapp_sub: '逾期提醒与回款',

    // Dashboard Metrics Cards
    starting_cash: '期初现金',
    current_liquid_pos: '当前流动资金头寸',
    projected: '预测期末',
    projected_end_bal: '预计期末结余',
    daily_avg_inflow: '日均现金流入',
    historical_90d: '历史 90 天经营基准',
    pending_invoices: '待付发票',
    unpaid_bills: '未付账单与应付余额',
    day_window: '天周期',
    cash_trajectory: '预测现金流走势',
    cash_trajectory_desc: '每日净收入与支出流向推演',
    buffer_threshold: '红色虚线指标 = $5,000 最低流动性安全线',
    detailed_simulation: '详细 90 天模拟',
    credit_readiness: '信贷就绪度',
    score_engine: '评分引擎',
    composite_score: '综合就绪评分',
    view_pillars_tips: '查看 4 大核保支柱与建议',
    underwriting_desc: '基于历史现金稳定性、经营利润率、账期周转及成本控制。',
    score_factors_title: '评分因素明细',
    score_factors_desc: 'Financial Pilot 测算的核心信贷支柱',
    revenue_consistency: '收入稳定性',
    profit_margin: '营业利润率',
    payment_behavior: '还款行为',
    expense_control: '支出控制',
    grade: '评级',
    pts: '分',
    gemini_insights_title: 'Gemini AI 财务副驾洞察',
    gemini_insights_desc: '基于实时财务数据综合生成的智能解析',
    cash_exec_summary: '现金流执行总结：',
    credit_opt_tips: '信贷评分优化建议：',
    ai_connecting: 'AI 分析正在连接中...',

    // Risk Banner
    risk_priority_alert: '🚨 自主优先警报',
    risk_signal_alert: '⚡ 可执行风险信号',
    threshold_breach_on: '触发安全线日期：',
    high_severity_anomalies: '个高危异常',
    modal_agent_draft: '智能催收通知草稿',
    modal_gemini_synth: 'Gemini 智能生成',
    modal_debt_settlement: '附带早鸟折扣与转账指引的债务催收通告',
    modal_notice_success: '通知已成功加入发送队列并推送到目标应付系统！',
    modal_recipient: '收件人（应付专员）：',
    modal_target_invoice: '目标发票及金额：',
    modal_subject: '邮件主题：',
    modal_body_title: '邮件正文（可编辑）：',
    modal_wire_incentive: '包含 2% 电汇快速结算优惠',
    modal_copied_draft: '✓ 已复制草稿',
    modal_copy_text: '复制文本',
    modal_download_txt: '下载 .txt',
    modal_cancel: '取消',
    modal_transmit: '⚡ 发送通告',

    // Modal navigation
    home_landing: '主页',
    ocr_invoice_scanner: 'OCR 发票扫描器',
    api_docs: 'FastAPI 后端文档',
    lender_dossier: '资方合规报告',
    reset_demo_data: '重置演示数据',
    launch_hub_arrow: '进入 Financial Pilot 控制台 →',
    complete_financial_suite: '完整财务套件',
    live: '在线',
    active_state: '激活',

    // WhatsApp Collector
    whatsapp_title: '智能账款催收专家',
    whatsapp_badge: '自主应收账款处理',
    whatsapp_desc: 'AI 自动跟踪逾期账款并实现一键现金对账。预览定制催收文案，一键启动 WhatsApp/微信沟通，迅速回笼资金。',
    refresh_queue: '刷新队列',
    total_overdue: '逾期资金总额',
    outstanding_receivables: '逾期待收应收账款',
    active_clients: '待付款客户',
    pending_invoices_queue: '队列中待处理发票总数',
    avg_overdue: '平均逾期天数',
    delinquency_velocity: '账款逾期流速',
    days_overdue: '天逾期',
    days: '天',
    reconciled_session: '本时段已对账',
    invoices_cleared: '张发票转为现金',
    active_collection_targets: '活跃催收目标',
    targets: '个目标',
    send_all_reminders: '🚀 发送所有提醒',
    dispatching: '批量派发中...',
    table_desc: '点击“发送提醒”即可预览并派发定制的 Gemini 催收信息。',
    search_placeholder: '搜索客户或发票号...',
    col_client: '客户名称',
    col_invoice: '发票编号',
    col_amount: '金额',
    col_due_date: '到期日期',
    col_status: '状态',
    col_actions: '操作',
    btn_auto_send: '自动发送',
    btn_auto_send_bot: '后台无头自动发送',
    open_manual: '手动链接',
    btn_send_whatsapp: '发送 WhatsApp 提醒',
    btn_resend_whatsapp: '重新发送',
    btn_mark_paid: '标记为已付款',
    btn_reconciling: '对账处理中...',
    status_overdue: '已逾期',
    status_dispatched: '已发送',
    all_reconciled: '所有发票已完全对账',
    no_overdue_found: '未发现逾期款项。您的应收账款账本完全最新。',
    clear_filter: '清除筛选',
    batch_dispatched_toast: '🚀 批量派发完成！所有活跃提醒已标记为已发送。',

    // WhatsApp Device Linking
    conn_status_connected: '已连接发件人',
    conn_status_disconnected: '未绑定设备',
    btn_connect_whatsapp: '📲 连接 WhatsApp',
    btn_switch_device: '切换设备',
    btn_unlink_device: '解除绑定',
    conn_active_sub: '所有提醒均通过此 WhatsApp 号码后台自动发出',
    conn_inactive_sub: '连接您的手机 WhatsApp 以启用全自动催收提醒',
    connect_modal_title: '连接 WhatsApp 发送账号',
    connect_modal_subtitle: '请在手机 WhatsApp 上扫描此二维码进行设备关联。',
    step_1_title: '打开 WhatsApp',
    step_1_desc: '在手机上打开 WhatsApp，点击 菜单 (⋮) 或 设置',
    step_2_title: '已关联的设备',
    step_2_desc: '点击 已关联的设备 > 关联设备',
    step_3_title: '扫描二维码',
    step_3_desc: '将手机摄像头对准此屏幕扫描二维码',
    phone_label_custom: '或直接关联发件人手机号：',
    btn_confirm_device_linked: '✓ 确认并激活设备连接',
    qr_refreshing: '正在刷新二维码...',
    btn_refresh_qr: '刷新二维码',
    pairing_success_toast: '🎉 WhatsApp 设备连接成功！所有催收提醒将由该号码自动发送。',
    unlinked_toast: '✓ 已成功解除 WhatsApp 设备连接。',
    btn_open_desktop_qr: '🖥️ 打开 WhatsApp 网页端登录窗口',
    btn_direct_send: '📲 直接发送 (wa.me)',
    desktop_window_launched: '⚡ 已在桌面上打开 WhatsApp 网页端窗口！请扫码完成设备绑定。',

    // Modal
    preview_modal_title: 'Gemini AI 智能提醒预览',
    recipient_phone: '接收号码',
    ai_message_draft: 'Gemini 生成的消息草稿',
    copy_message: '复制文案',
    copied: '已复制！',
    open_whatsapp: '打开对话链接',
    close: '关闭',
    cfo_title: 'AI 虚拟财务总监',
    cfo_sub: '实时全景财务智能',
    cfo_suggestions: '快捷提问：',
    cfo_placeholder: '向 AI 虚拟财务总监提问...',
    cfo_send: '发送',

    // Value Propositions
    val_heading_1: '告别繁琐电子表格，拥抱企业',
    val_heading_2: '智能财务副驾',
    val_subheading: '成长型企业监控资金跑道、获取银行信贷、优化成本开支所需的一切——聚合于统一控制台。',
    val_card1_title: '智能现金流中枢',
    val_card1_item1: '30/60/90 天动态现金流预测',
    val_card1_item2: '低流动性预警与安全线监控',
    val_card1_item3: '应收账款全自动跟踪',
    val_card2_title: '信贷就绪评分',
    val_card2_item1: '企业商业信用评分 (0–100)',
    val_card2_item2: '4 大核心财务健康支柱解析',
    val_card2_item3: 'Gemini AI 专属信用提升路线图',
    val_card3_title: '合规风控与防伪',
    val_card3_item1: '异常交易与重复请款实时监测',
    val_card3_item2: '实时企业所得税与增值税预估',
    val_card3_item3: '一键导出合规审计与资方报告',
    val_card4_title: 'AI 采购与协同',
    val_card4_item1: '供应商补货库存预警',
    val_card4_item2: '集中批量采购降本机会',
    val_card4_item3: '供应商条款智能谈判副驾',

    // Business Needs (5 Pillars)
    bn_heading_1: '每家成长型企业必备的',
    bn_heading_2: '5 大财务支柱',
    bn_subheading: '专为解决现代成长型企业资金黑盒打造的模块化体系。',
    bn_p1_title: '透明可视',
    bn_p1_desc: '全天候掌握资金流动去向与源头，无需等待月底滞后账单，随时做出精准决策。',
    bn_p2_title: '走势预演',
    bn_p2_desc: '洞悉未来 30、60 与 90 天现金动态，提前规划员工发薪与账期谈判，防范断流危机。',
    bn_p3_title: '信用健康',
    bn_p3_desc: '打造并持续监测优质企业商业信用，随时满足银行授信与资方放款审核标准。',
    bn_p4_title: '合规治理',
    bn_p4_desc: '跑在税务申报前面，在被外部审计前侦测潜在差错，借助自动化监测保持账面合规洁净。',
    bn_p5_title: '决策智能',
    bn_p5_desc: '将繁琐原始财务数据转化为清晰战略指令，AI 副驾用直白语言解析，杜绝晦涩术语。',

    // Pricing Section
    pricing_heading_1: '为企业稳健增长打造的',
    pricing_heading_2: '灵活定价',
    pricing_subheading: '开启 14 天免费试用，随业务一同拓展。无需信用卡，随时可取消。',
    pricing_monthly: '按月付费',
    pricing_yearly: '按年付费',
    pricing_save: '立省 20%',
    pricing_plan_essentials: '基础版',
    pricing_desc_essentials: '为初创团队与微型企业量身打造的极简资金跑道监控。',
    pricing_plan_growth: '进阶成长版',
    pricing_desc_growth: '为成长期企业打造的全景财务智能中枢，助力快速获取资方授信。',
    pricing_popular: '最受青睐',
    pricing_plan_scale: '旗舰版',
    pricing_desc_scale: '企业级深度财务多维分析与多账套聚合智能。',
    pricing_start_trial: '开启 14 天免费试用',
    pricing_per_month: '/月',

    // FAQ Section
    faq_heading_1: '常见问题',
    faq_heading_2: '解答',
    faq_subheading: '关于 Financial Pilot 系统架构与财务决策引擎的深度答疑。',
    faq_q1: '现金流预测引擎是如何推演未来期末结余的？',
    faq_a1: '系统分析保存在本地 CSV 中的历史流水账目，计算 90 天收入与经营支出的移动平均值，并引入波动率模型推演 7 至 90 天走势与自动告警。',
    faq_q2: '企业商业信用评分基于哪些核心核保标准？',
    faq_a2: '0–100 综合评分衡量月均收入稳定性、净利润率、应收账款回款流速以及成本管控比率四大支柱，并由 Gemini 生成专属提升方案。',
    faq_q3: '企业的敏感财务数据保存在哪里？',
    faq_a3: '在阶段一架构中，所有流水数据均保存在您本地的 /backend/data/ 目录中，遵循标准 Pandas 数据合约。敏感账目信息绝不上传外部服务。',
    faq_q4: '系统是如何实现前端与各独立分析模块的完全解耦的？',
    faq_a4: '严格遵循函数契约规范：所有算法模块均为纯 Python 无状态函数，返回标准字典或 DataFrame，前端页面仅通过规范 FastAPI 接口进行交互。',

    // Call To Action & Footer
    cta_heading_1: '准备好告别企业财务盲区，让每笔资金',
    cta_heading_2: '清晰可见了吗？',
    cta_subheading: '加入众多卓越企业主的行列，使用 Financial Pilot 预演现金跑道、构建信贷资信，自信驾驭商业未来。',
    cta_launch_btn: '进入实时仪表盘',
    cta_api_docs: '查看后端 Swagger 文档',
    footer_tagline: '通过全景现金流预测与企业信用副驾，为成长型企业注入智能化确定性。',
    footer_col_engines: '核心财务引擎',
    footer_col_ops: '运营与增长套件',
    footer_col_system: '系统架构与状态',
    footer_active_status: 'FastAPI 引擎：运行中',
    footer_local_csv: '本地 CSV 合约：已同步',
    footer_rights: 'Financial Pilot AI 版权所有。基于严格函数契约与 Pandas 纯粹内核。',

    // Inner Pages Common & Specific
    cf_badge: '前瞻流动性预测引擎',
    cf_title_1: '现金流',
    cf_title_2: '全景预测器',
    cf_subtitle: '基于 Pandas 统计模型与 Gemini AI 算法构建的资金生存跑道推演',
    cf_alert_title: '最低现金储备预警',
    cf_baseline_balance: '历史经营期初基准',
    cf_after_forecast: '预测周期截止结余',
    cf_daily_rate: '过去 90 天日均流入均值',
    cf_receivables: '应收账款待回笼规模',
    cf_curve_title: '现金流演化推演曲线',
    cf_curve_subtitle: '引入统计波动率置信区间联合推演',
    cf_exec_title: '现金流管理层综合诊断简报',
    cf_gemini_by: '由 Google Gemini 大模型实时智能推导',

    ag_badge: '法务级智能审计与风控守卫',
    ag_title_1: '异常交易与',
    ag_title_2: '反欺诈守卫',
    ag_subtitle: '实时流水扫描，智能检测重复报销、统计离群异常支付 (z > 2.5) 与供应商突发溢价',
    ag_rescan: '重新扫描账套流水',
    ag_total_flagged: '已捕获可疑记录',
    ag_across_algos: '覆盖 3 类风控审计算法',
    ag_high_severity: '高危严重风险项',
    ag_cpa_review: '急需财务主管或 CPA 介入核实',
    ag_potential_exposure: '潜在风险涉案敞口',
    ag_cumulative_value: '当前待审异常交易累计金额',
    ag_engine_active: '实时风控检测引擎',
    ag_active_100: '运行中 • 100%',
    ag_filter_all: '全部异常记录',
    ag_filter_high: '仅看高危',
    ag_filter_dup: '重复发票',
    ag_filter_pay: '异常大额支付',
    ag_filter_price: '突发价格异常',
    ag_search: '按发票号、供应商或描述搜索...',
    ag_col_id: '编号 / 凭证',
    ag_col_category: '异常类别',
    ag_col_entity: '交易对象 / 供应商',
    ag_col_amount: '涉案金额',
    ag_col_severity: '严重程度',
    ag_col_reason: '告警诱因与审计摘要',
    ag_col_action: '操作',
    ag_btn_review: '标记为已核实',
    ag_btn_reviewed: '✓ 已核实',
    ag_badge_high: '高危严重',
    ag_badge_medium: '中度风险',
    ag_badge_low: '低度关注',
    ag_no_records: '未发现匹配的异常财务流水',

    tax_badge: '动态税务测算与预提引擎',
    tax_title_1: '企业税务与',
    tax_title_2: '合规风控助手',
    tax_subtitle: '自动化企业所得税动态预提、销售税计提与 IRS/FBR 官方纳税申报日历',
    tax_gross_rev: '年初至今营业收入',
    tax_deductibles: '准予税前扣除成本',
    tax_taxable_inc: '净应纳税所得额',
    tax_next_filing: '下一税务申报截止',
    tax_download_report: '导出税务合规备忘录 (.txt)',
    tax_copy_cpa: '复制备忘录给 CPA',
    tax_all_deadlines: '全部申报节点',
    tax_federal: '联邦/国税事项',
    tax_state_payroll: '地税与薪酬扣缴',
    tax_cpa_memo_title: 'Gemini AI 注册会计师专属合规备忘',
    tax_rate_breakdown: '联邦 21% + 州 5% + 销售税',
    tax_irc_eligible: '符合 IRC 第 162 条和 COGS 扣除标准',
    tax_rev_less_ded: '营业收入',
    tax_less_ded: '减除成本扣除',
    tax_net_due: '净应缴未付税额:',
    tax_liability_breakdown: '纳税义务及税前扣除明细',
    tax_cost_accounting_guide: '严格遵循法定标准的成衣制造工业成本会计准则',
    tax_combined_rate: '综合预提税率 26.0%',
    tax_est_corp_tax: '预估企业所得税额',
    tax_fed_state: '联邦所得税 (21%) + 州特许税 (5%)',
    tax_sales_provision: '销售与使用税预提计提',
    tax_sales_goods: '按成品服装销售额约 ~4.0% 预提计提',
    tax_qualifying_deductibles: '符合法定税前扣除条件的开支',
    tax_total: '总计',
    tax_std_ded: '标准税前扣除项',
    tax_cogs_label: '纺织原材料与面料 (COGS)',
    tax_cogs_sub: '直接面料、辅料及辅料采购支出',
    tax_payroll_label: '成衣生产工厂直接人工',
    tax_payroll_sub: '车间缝纫工、裁剪师与制版打样技师',
    tax_lease_label: '工业厂房与仓库租赁',
    tax_lease_sub: '制造车间及立体成品仓储租金',
    tax_power_label: '工业动力电及高压蒸汽',
    tax_power_sub: '高压工业裁剪台与全厂动力供电',
    tax_marketing_label: 'B2B 批发推介及渠道营销',
    tax_marketing_sub: '纺织服装交易会展位及行业陈列厅',
    tax_prior_prepayments: '已计入的历史预缴税款与代扣代缴:',
    tax_ai_memo_badge: 'Gemini AI 财务顾问 • CPA 审计专用底稿',
    tax_ai_memo_title: '高级税务合规备忘录与全案执行纪要',
    tax_copy_memo: '复制备忘录',
    tax_copied: '已复制！',
    tax_download_report_btn: '下载完整报告',
    tax_memo_to: '呈报对象: 接收方',
    tax_cpa_team: '首席主管注册会计师 (CPA)',
    tax_advisory_team: '及高级财税风控顾问组',
    tax_memo_entity: '纳税主体 / 申报企业',
    tax_apparel_ops: '服饰成衣制造运营部',
    tax_memo_period: '财税报表统计周期',
    tax_books_verified: '账目已结转并完成核验',
    tax_memo_audit: '适用税法审计权威',
    tax_safe_harbor: '完全符合避风港法则标准',
    tax_sec1_title: '执行摘要与整体税负状况',
    tax_net_bal_label: '净待补差额:',
    tax_gross_rev_col: '营业总收入',
    tax_net_tax_base: '应纳税所得额',
    tax_est_tot_tax: '预估应纳总税额',
    tax_prior_remit: '前期已缴税款',
    tax_sec2_title: '准予扣除费用分类与审计底稿准备度',
    tax_qualified: '合规核准',
    tax_sec2_desc: '运营扣除项精准反映成衣制造法定归集的各项成本分摊:',
    tax_cogs_title: '生产原材料与采购耗材 (COGS)',
    tax_cogs_memo_sub: '纺织、剪裁及五金辅料直接采购。依据税法保留期末存货盘点对账单。',
    tax_direct_payroll: '一线生产直接与间接薪酬',
    tax_payroll_memo_sub: '车间车工、设备维护技师与工段长。与季度 Form 941 薪资税核对。',
    tax_facility_overhead: '制造基础设施与固定制造费用',
    tax_lease_memo_sub: '工厂厂房仓储租金及工业高压电力能源支出。',
    tax_wholesale_dist: '全国批发渠道分销及管理销售费用 (SG&A)',
    tax_wholesale_sub: '大型纺织服饰订货会展位、样衣展厅及 B2B 品牌目录推广。',
    tax_sec3_title: '官方税务申报日历与避风港行动方案',
    tax_days_next: '天至下一次申报截止',
    tax_plan_1: '避风港预缴款: 及时汇出季度分期预缴税款，满足上年度 100% 避风港保护',
    tax_required: '必须执行',
    tax_plan_2: 'COGS 底稿归档: 对单笔超过 $2,500 的面料采购支出保留详细发票与入库单',
    tax_audit_record: '审计底稿',
    tax_plan_3: 'Form 941 薪酬对账: 确保工资清算分录与州失业保险申报保持一致',
    tax_scheduled: '已排期',
    tax_generating: '正在生成税务备忘录...',
    tax_irc_verified: '全项计算已依据 IRC 第 162 条与制造业销货成本准则核验完毕',
    tax_download_success: '企业税务与合规执行总结报告已成功下载到您的计算机。',
    tax_engine_error: '税务计算引擎故障',

    sp_badge: '蒙特卡洛预测引擎 • 500 次随机推演路径',
    sp_title_1: '情景推演与',
    sp_title_2: '抗压规划器',
    sp_subtitle: '模拟营收变动、人员扩张与原材料波动在各置信区间的现金流抗压表现',
    sp_sales_change: '销售量变动冲击',
    sp_new_hires: '每月新增雇员数',
    sp_procurement: '采购与原材料成本波动',
    sp_ar_delay: '应收账款回款延缓',
    sp_reset_params: '重置所有参数',
    sp_run_simulation: '运行情景模拟',
    sp_simulating: '正在推演中...',
    sp_dynamic_levers: '动态抗压杠杆控制',
    sp_dynamic_levers_sub: '调节变量参数以压力测试资产负债应对下行风险的韧性',
    sp_recalculating: '正在实时重算 500 条推演路径...',
    sp_days: '天',
    sp_sales_revenue_shift: '营业收入浮动',
    sp_recession: '萧条萎缩',
    sp_surge: '爆发激增',
    sp_baseline: '基准常态',
    sp_headcount: '团队人数 / 招聘',
    sp_hires: '人新增',
    sp_staff: '名员工',
    sp_est_payroll: '预估薪酬开支:',
    sp_procurement_costs: '供应链采购成本',
    sp_discount: '降价折扣',
    sp_flat: '持平',
    sp_inflation: '通胀上涨',
    sp_collections_shift: '应收回款周期浮动',
    sp_fast: '提速',
    sp_normal: '正常',
    sp_delinquent: '逾期拖欠',
    sp_delay: '延期',
    sp_kpi_ending_cash: '预期期末现金存量 (P50)',
    sp_kpi_vs_baseline: '对比基准常态',
    sp_kpi_worst_case: '极限压力承压底线 (P10)',
    sp_kpi_bearish_floor: '第 10 百分位数悲观托底',
    sp_kpi_buffer_risk: '击穿安全缓冲风险',
    sp_kpi_buffer_desc: '跌破 $5,000 最低流动资金阈值的概率',
    sp_kpi_spend_shift: '采购支出变动额',
    sp_fan_chart_title: '蒙特卡洛现金跑道扇形置信分布图',
    sp_fan_chart_sub: '百分位数分布：中位数轨迹 (P50)、50% 置信区间带 (P25–P75) 与 80% 置信区间带 (P10–P90)',
    sp_legend_median: 'P50 (中位数轨迹)',
    sp_legend_band: 'P25–P75 置信带',
    sp_legend_stress: 'P10 极限压力托底',
    sp_legend_baseline: '基准线',
    sp_min_reserve: '法定最低防线 $5k',
    sp_gemini_advisory: 'Gemini AI 预测智能顾问',
    sp_gemini_executive: '管理层情景抗压与风险深度解析',
    sp_insight_runway: '现金跑道与流动性演变轨迹',
    sp_insight_sensitivity: '敏感度因子与主要成本驱动源',
    sp_insight_recommendations: '战略应对与防御优化建议',
    sp_sim_paths_label: '正在运行 500 条随机模拟路径...',
    sp_preset_base: '基准常态',
    sp_preset_bull: '牛市扩张 (+20%)',
    sp_preset_shock: '供应链断供危机 (+25% 成本)',
    sp_preset_recession: '深度衰退压力 (-30% 营收)',
    sp_bullish_p90: 'P90 乐观上行区间',
    sp_median_p50: 'P50 中位数预期线',
    sp_stress_p10: 'P10 极限压力测试线',
    sp_gemini_analysis: 'Gemini 场景风险评估建议',

    ap_badge: 'GAAP 认证标准审计底稿 • 外部尽调资方门户',
    ap_title_1: '资方与外部',
    ap_title_2: '审计专属看板',
    ap_subtitle: '专为外部注册会计师、商业银行放贷经理与信贷风控打造的只读财务门户',
    ap_export_csv: '导出标准 CSV',
    ap_export_pkg: '导出完整财务底稿包',
    ap_generate_dossier: '⚡ 一键生成资方授信尽调档案',
    ap_compiling: '正在编译...',
    ap_readonly_badge: '官方认证只读视图',
    ap_write_locked: '写入修改权限已锁定',
    ap_checksum: '密码学签名快照 • 校验和哈希:',
    ap_viewing_as: '当前查看视角:',
    ap_role_auditor: '审计师',
    ap_role_lender: '资方银行',
    ap_role_accountant: '主办会计',
    ap_underwriting_lens: '当前审查透镜视角:',
    ap_controls_rating: '内部风控内审评级:',
    ap_balance_sheet: '资产负债表',
    ap_income_statement: '利润表 (损益表)',
    ap_cash_flow: '现金流量表',
    ap_in_usd: '单位：美元 (PKR)',
    ap_accrual_basis: '权责发生制',
    ap_current_assets: '流动资产',
    ap_cash_equiv: '货币资金及现金等价物',
    ap_ar_net: '应收账款净额',
    ap_inventory: '存货估值 (成本与市价孰低)',
    ap_total_current_assets: '流动资产合计',
    ap_liab_equity: '负债及所有者权益',
    ap_ap_supplier: '应付账款 (供应商经营应付)',
    ap_accrued_opex: '应计经营性费用及开支',
    ap_short_term_debt: '短期借款及负债',
    ap_total_current_liab: '流动负债合计',
    ap_retained_equity: '未分配利润及所有者权益',
    ap_total_liab_equity: '负债及所有者权益总计',
    ap_balanced_verified: '复式记账恒等式已验证：资产 = 负债 + 所有者权益 (平衡)',
    ap_variance: '0 偏差',
    ap_statement_ops: '经营成果损益表 (P&L)',
    ap_fiscal_accrual: '财年年初至今权责发生制核算',
    ap_net_margin: '净利率:',
    ap_gross_revenue: '营业总收入',
    ap_cogs: '减：营业成本 (原材料与采购直接成本)',
    ap_gross_profit: '毛利润',
    ap_opex_header: '期间费用及日常营运支出 (SG&A)',
    ap_opex_payroll: '• 直接人工与生产运营工资',
    ap_opex_rent: '• 厂房车间与办公场地租赁',
    ap_opex_utilities: '• 动力水电气动力开支',
    ap_opex_marketing: '• 销售推广与渠道管理费用',
    ap_operating_income: '营业利润 (EBITDA)',
    ap_tax_provision: '减：应交企业所得税计提',
    ap_net_income: '净利润',
    ap_cf_title: '现金流量明细表',
    ap_cf_reconciliation: '收付实现制现金账实核对',
    ap_cf_operating: '经营活动产生的现金流量净额',
    ap_cf_investing: '投资活动产生的现金流量净额',
    ap_cf_financing: '筹资活动产生的现金流量净额',
    ap_cf_ending: '期末现金及流动性储备余额',
    ap_consent_title: '数据授权与外发共享链接',
    ap_active_grant: '授权生效中',
    ap_token_label: '安全只读授权令牌',
    ap_granted_by: '授权签发人',
    ap_access_exp: '授权截止有效时间',
    ap_copied: '安全分享链接已成功复制至剪贴板',
    ap_copy_link: '复制外部只读加密分享链接',
    ap_audit_title: '防篡改访问留痕审计日志',
    ap_audit_subtitle: '带时间戳的完整底稿查阅链条',
    ap_col_timestamp: '访问时间戳',
    ap_col_actor_role: '访问主体与角色',
    ap_col_action: '执行操作',
    ap_col_verification: '验真状态',
    ap_export_success: 'GAAP 认证财务报表已成功导出。',
    ap_dossier_success: '包含 SHA-256 签名封印的资方授信尽调报告已成功生成并下载！',

    scan_title: '发票与收据智能扫描识别',
    scan_subtitle: '基于 AI 视觉与 OCR 技术的账单自动化录入',
    scan_dropzone: '将发票或收据拖放到此处，或点击浏览',
    scan_supported: '支持最大 25MB 的 PDF、PNG、JPG 票据文件',
    scan_or_test: '或使用内置模拟账单快速体验：',
    scan_sample_1: 'Acme 货运物流账单 ($3,480)',
    scan_sample_2: '云端服务器算力账单 ($1,850)',
    scan_parsing: '正在解析',
    scan_with_ocr: '通过智能 OCR 视觉引擎…',
    scan_extracting: '正在智能提取供应商、明细行与账期条款',
    scan_detected_vendor: '已识别供应商',
    scan_confidence: '置信度',
    scan_issue_date: '开票日期',
    scan_due_date: '付款截止日',
    scan_category: '会计分类',
    scan_extracted_items: '已提取明细项',
    scan_total_amount: '票面总金额',
    scan_another: '继续扫描下一张',
    scan_confirm_sync: '确认核销并同步入账',
    scan_recorded_alert: '发票分录已成功记入本地数据账套 /backend/data/invoices.csv！',
    scan_scanning: '正在提取发票行项目与商户信息...',
    scan_result_title: '已验证的发票核销分录',
    scan_save: '确认并写入本地账套',
    scan_cancel: '取消',

    // WhatsApp & Scenario Edit Mode
    add_target: '添加目标',
    edit_target: '编辑目标',
    btn_edit: '编辑',
    save_changes: '保存更改',
    delete_target: '删除目标',
    cancel: '取消',
    custom_projections_title: '实时演示自定义预测 (资金流入与流出)',
    custom_projections_desc: '添加一次性补助金、股本融资或大额采购，立即重新计算 500 条随机路径',
    add_line_item: '添加项目',
    item_name_placeholder: '例如：政府补助金 / 机器资本支出',
    item_amount: '金额 ($)',
    inflow: '资金流入 (+)',
    outflow: '资金流出 (-)',
    active: '生效',
    inactive: '未生效',
    net_custom_impact: '净自定义资金影响',
    total_custom_inflows: '总自定义流入',
    total_custom_outflows: '总自定义流出',
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('finpilot_lang') || 'en';
  });

  const handleSetLang = (newLang) => {
    if (['en', 'ur', 'zh'].includes(newLang)) {
      setLang(newLang);
      localStorage.setItem('finpilot_lang', newLang);
    }
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    if (lang === 'ur') {
      document.body.classList.add('lang-ur');
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.body.classList.remove('lang-ur');
      document.documentElement.setAttribute('dir', 'ltr');
    }
  }, [lang]);

  const t = (key, fallback) => {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
    if (dict[key]) return dict[key];
    if (TRANSLATIONS.en[key]) return TRANSLATIONS.en[key];
    return fallback !== undefined ? fallback : key;
  };

  /**
   * STRICT CURRENCY & NUMBER RULE:
   * All figures, currencies (PKR, $), percentages, dates, and numbers remain strictly in English format.
   */
  const formatNumber = (val) => {
    if (val === null || val === undefined) return '0';
    return Number(val).toLocaleString('en-US');
  };

  const formatCurrency = (val, currency = 'Rs. ') => {
    const num = Number(val) || 0;
    return `${currency}${num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  /**
   * DYNAMIC GEMINI AI CONTENT TRANSLATION ENGINE
   * Seamlessly translates Gemini AI executive paragraphs, recommendations, and briefs
   * into fluent Urdu or Chinese while preserving 100% of English numbers and currencies.
   */
  const translateGeminiContent = (text) => {
    if (!text || typeof text !== 'string' || lang === 'en') return text;

    // Tokenize all numbers, currency amounts, percentages, invoice IDs, and dates
    const tokens = [];
    const tokenized = text.replace(/(\$[0-9,.]+(?:M|k|K)?|[0-9]+(?:\.[0-9]+)?%|INV-[0-9]+|\b\d{4}-\d{2}-\d{2}\b)/g, (m) => {
      tokens.push(m);
      return `__NUMTOK${tokens.length - 1}__`;
    });

    const restore = (str) => {
      let out = str;
      tokens.forEach((tok, idx) => {
        out = out.replace(new RegExp(`__NUMTOK${idx}__`, 'g'), tok);
      });
      return out;
    };

    if (lang === 'ur') {
      // 1. Tax Executive Memorandum Section 1
      if (tokenized.includes('The company has generated') || tokenized.includes('gross YTD revenues')) {
        const urSec1 = tokenized
          .replace(/The company has generated/gi, 'کمپنی نے حاصل کی ہے')
          .replace(/in gross YTD revenues/gi, 'کی سالانہ کل آمدنی')
          .replace(/offset by/gi, 'جس کے مقابلے میں')
          .replace(/in qualifying deductible operational expenditures/gi, 'کے اہل کٹوتی آپریشنل اخراجات ہیں')
          .replace(/yielding a net taxable operating income of/gi, 'جس سے خالص قابل ٹیکس آمدنی حاصل ہوتی ہے')
          .replace(/Based on statutory manufacturing guidelines/gi, 'مینوفیکچرنگ کے قانونی رہنما اصولوں کے مطابق')
          .replace(/estimated total tax liability is projected at/gi, 'متوقع کل ٹیکس واجبات کا تخمینہ لگایا گیا ہے')
          .replace(/comprising/gi, 'جس میں شامل ہیں')
          .replace(/in corporate income tax at a/gi, 'کارپوریٹ انکم ٹیکس بشرح')
          .replace(/combined federal\/state rate/gi, 'مشترکہ وفاقی و صوبائی شرح')
          .replace(/and/gi, 'اور')
          .replace(/in state sales & use tax provisions/gi, 'صوبائی سیلز اور استعمال ٹیکس کی فراہمی')
          .replace(/With/gi, 'جبکہ')
          .replace(/in recorded prior tax remittances/gi, 'سابقہ ریکارڈ شدہ ٹیکس ادائیگیاں ہیں')
          .replace(/the estimated net outstanding balance due is/gi, 'متوقع خالص بقیہ واجب الادا رقم ہے');
        return restore(urSec1);
      }

      // 2. Tax Memorandum Section 2
      if (tokenized.includes('Operational deductions reflect standard garment manufacturing') || tokenized.includes('Operational deductions reflect')) {
        const urSec2 = tokenized
          .replace(/Operational deductions reflect standard garment manufacturing cost structures:/gi, 'آپریشنل کٹوتیاں معیاری گارمنٹس مینوفیکچرنگ لاگت کے ڈھانچے کو ظاہر کرتی ہیں:')
          .replace(/Operational deductions reflect audited garment manufacturing cost allocations across statutory categories:/gi, 'آپریشنل کٹوتیاں قانونی زمروں میں آڈٹ شدہ مینوفیکچرنگ اخراجات کو ظاہر کرتی ہیں:')
          .replace(/Raw Materials & Supplies \(COGS\):/gi, 'خام مال اور سپلائیز (COGS):')
          .replace(/in textile, trim, and fabric procurement\./gi, 'ٹیکسٹائل، ٹرم اور فیبرک کی خریداری۔')
          .replace(/Under IRC Section 471, ensure strict closing inventory capitalization reconciliations\./gi, 'قانونی دفعہ 471 کے تحت اختتامی انوینٹری کیپیٹلائزیشن کا باقاعدہ حساب رکھیں۔')
          .replace(/Direct & Indirect Payroll:/gi, 'براہ راست اور بالواسطہ پے رول:')
          .replace(/in plant floor sewing operators and supervisory wages\./gi, 'پلانٹ فلور سلائی آپریٹرز اور سپروائزری اجرتوں میں۔')
          .replace(/Reconciled with quarterly Form 941 filings\./gi, 'فارم 941 کی سہ ماہی فائلنگ کے ساتھ منسلک۔')
          .replace(/Facility & Production Overhead:/gi, 'سہولت اور پیداواری اوور ہیڈ:')
          .replace(/in factory leases/gi, 'فیکٹری لیز میں')
          .replace(/in industrial electricity, steam, and cutting power\./gi, 'صنعتی بجلی، بھاپ اور کٹنگ پاور کے اخراجات میں۔')
          .replace(/Wholesale Distribution & SG&A:/gi, 'ہول سیل ڈسٹری بیوشن اور مارکیٹنگ:')
          .replace(/in trade show exhibits and brand catalog distribution\./gi, 'ٹریڈ شو نمائشوں اور برانڈ کیٹلاگ کی تشہیر میں۔');
        return restore(urSec2);
      }

      // 3. Tax Memorandum Section 3
      if (tokenized.includes('The primary priority is the upcoming') || tokenized.includes('safe-harbor')) {
        const urSec3 = tokenized
          .replace(/The primary priority is the upcoming/gi, 'اہم ترین ترجیح آنے والی')
          .replace(/due on/gi, 'ہے جس کی مقررہ تاریخ')
          .replace(/days remaining/gi, 'دن باقی')
          .replace(/To avoid late prepayment penalties, ensure quarterly installments satisfy IRS safe-harbor/gi, 'تاخیری جرمانے سے بچنے کے لیے، اس بات کو یقینی بنائیں کہ سہ ماہی قسطیں سیف ہاربر کے معیار پر پوری اترتی ہیں')
          .replace(/100% of prior-year liability or 90% of current-year projection/gi, 'پچھلے سال کی 100% ذمہ داری یا موجودہ سال کا 90% تخمینہ')
          .replace(/Maintain supporting vendor invoices for all COGS deductions exceeding/gi, 'سے زائد تمام COGS کٹوتیوں کے معاون سپلائر انوائسز محفوظ رکھیں');
        return restore(urSec3);
      }

      // 4. WhatsApp collection reminder
      if (tokenized.includes('this is FinPilot Accounts Receivable') || tokenized.includes('past due')) {
        const urWA = tokenized
          .replace(/Hi/gi, 'محترم')
          .replace(/this is FinPilot Accounts Receivable regarding invoice/gi, 'فنانشل پائلٹ اکاؤنٹس کی طرف سے انوائس')
          .replace(/for/gi, 'برائے')
          .replace(/which was due on/gi, 'کے حوالے سے یاد دہانی ہے، جو واجب الادا تھی بروز')
          .replace(/days past due/gi, 'دن کی تاخیر')
          .replace(/This balance is now significantly past due\. We kindly request an immediate update on the remittance schedule\./gi, 'یہ رقم کافی تاخیر کا شکار ہے۔ ہم ادائیگی کے شیڈول کے بارے میں فوری اپ ڈیٹ کی درخواست کرتے ہیں۔')
          .replace(/We would appreciate it if you could verify the payment status with your accounts payable team this week\./gi, 'اگر آپ اس ہفتے اپنی اکاؤنٹنگ ٹیم سے ادائیگی کی صورتحال کی تصدیق کر لیں تو ہم مشکور ہوں گے۔')
          .replace(/Please let us know once payment has been released so we can reconcile your account\./gi, 'براہ کرم ادائیگی جاری ہونے پر ہمیں مطلع کریں تاکہ ہم آپ کے کھاتوں کو کلیئر کر سکیں۔')
          .replace(/Just a friendly check-in to confirm if you need another copy of the invoice or banking coordinates\./gi, 'یہ ایک دوستانہ یاد دہانی ہے تاکہ تصدیق ہو سکے کہ کیا آپ کو انوائس یا بینک کی تفصیلات درکار ہیں۔')
          .replace(/Thank you for your prompt attention!/gi, 'آپ کی فوری توجہ کا شکریہ!');
        return restore(urWA);
      }

      // 5. Auditor Opinion
      if (tokenized.includes('In our opinion, the accompanying financial statements present fairly') || tokenized.includes('present fairly')) {
        return 'ہماری رائے میں، منسلک مالیاتی بیانات کمپنی کی مالی پوزیشن اور نقد بہاؤ کو تمام اہم پہلوؤں سے عام طور پر قبول شدہ اکاؤنٹنگ اصولوں کے مطابق منصفانہ طور پر پیش کرتے ہیں۔';
      }

      // 6. Generic financial terms translation
      let res = tokenized
        .replace(/Expected net runway maintains/gi, 'متوقع خالص رن وے برقرار رکھتا ہے')
        .replace(/buffer across 30 days/gi, 'کا ریزرو اگلے 30 دنوں میں')
        .replace(/Cash flow trajectory demonstrates healthy liquidity through day 30/gi, 'کیش فلو کا تخمینہ اگلے 30 دنوں میں صحت مند لیکویڈیٹی کو ظاہر کرتا ہے')
        .replace(/Accelerate collection of overdue invoices to boost liquidity score/gi, 'لیکویڈیٹی سکور بڑھانے کے لیے واجب الادا انوائسز کی وصولی میں تیزی لائیں')
        .replace(/Maintain debt-to-equity below 1\.5x by deferring non-essential equipment leases/gi, 'غیر ضروری سامان کی لیز مؤخر کر کے قرض اور ایکویٹی کے تناسب کو 1.5x سے نیچے رکھیں')
        .replace(/Ensure on-time payment history with tier-1 raw fabric suppliers over the next 90 days/gi, 'اگلے 90 دنوں میں اہم فیبرک سپلائرز کے ساتھ بروقت ادائیگی کے ریکارڈ کو یقینی بنائیں')
        .replace(/Monte Carlo simulation of 500 stochastic paths projects a median ending balance/gi, '500 تخمیناتی راستوں کے مونٹی کارلو سمولیشن سے ظاہر ہوتا ہے کہ متوقع میڈین اختتامی نقد رقم مستحکم ہے')
        .replace(/Notice of Urgent Account Settlement/gi, 'نوٹس برائے فوری اکاؤنٹ تصفیہ')
        .replace(/Includes 2% wire settlement incentive/gi, 'جلد ادائیگی پر 2% رعایت شامل ہے')
        .replace(/Automated debt settlement notice with early-pay discount & wire routing/gi, 'خودکار قرض تصفیہ نوٹس بشمول جلد ادائیگی کی رعایت اور بینک وائر کی تفصیلات')
        .replace(/Notice successfully queued and transmitted to target accounts payable server!/gi, 'نوٹس کامیابی کے ساتھ قطار میں شامل ہو کر اکاؤنٹنگ سرور کو بھیج دیا گیا ہے!')
        .replace(/Subject Line:/gi, 'موضوع:')
        .replace(/Executive Email Body \(Editable\):/gi, 'ایگزیکٹو ای میل کا متن:')
        .replace(/Recipient \(AP Contact\):/gi, 'وصول کنندہ:')
        .replace(/Target Invoice & Value:/gi, 'ہدف انوائس اور مالیت:')
        .replace(/GAAP Compliance & General Ledger Reconciliation/gi, 'جی اے اے پی تعمیل اور جنرل لیجر مصالحت')
        .replace(/Commercial Credit Underwriting & Debt Capacity/gi, 'تجارتی کریڈٹ انڈر رائٹنگ اور قرض کی گنجائش')
        .replace(/Operating Margin Analysis & Statutory Tax Allocations/gi, 'آپریٹنگ مارجن کا تجزیہ اور قانونی ٹیکس مختص')
        .replace(/Unqualified Clean Opinion \(Standard Manufacturing Accrual Basis\)/gi, 'غیر مشروط کلین آڈٹ رائے (معیاری ایکروئل بنیاد)')
        .replace(/Prime Credit Grade — High Liquidity Cushion & Working Capital Buffer/gi, 'پرائم کریڈٹ گریڈ — اعلیٰ لیکویڈیٹی اور ورکنگ کیپیٹل بفر')
        .replace(/Books Closed Fiscal YTD — COGS Capitalized per IRC Sec\. 471/gi, 'مالی سال کی کتابیں بند — لاگت کیپیٹلائزڈ')
        .replace(/Effective — Segregation of duties & purchase order matching verified/gi, 'مؤثر — فرائض کی تقسیم اور پرچیز آرڈر میچنگ تصدیق شدہ')
        .replace(/Zero debt defaults, excellent receivables turnover/gi, 'صفر ڈیفالٹس، بہترین وصولیوں کا ٹرن اوور')
        .replace(/Audit workpapers prepared for external year-end filing/gi, 'بیرونی سالانہ فائلنگ کے لیے آڈٹ ورک پیپرز تیار')
        .replace(/Working capital easily covers covenant ratios \(>1\.75x required\)/gi, 'ورکنگ کیپیٹل معاہدے کے تناسب کو باآسانی پورا کرتا ہے')
        .replace(/All depreciation and prepaid facility leases recorded/gi, 'تمام فرسودگی اور پری پیڈ فیکٹری لیزز کا اندراج مکمل')
        .replace(/Reconciled with 0 unverified journal discrepancies/gi, '0 غیر تصدیق شدہ تضادات کے ساتھ مصالحت مکمل')
        .replace(/Reconciliation Rate/gi, 'مصالحت کی شرح')
        .replace(/Ledger Checksum/gi, 'لیجر چیک سم')
        .replace(/GAAP Consistency/gi, 'جی اے اے پی مستقل مزاجی')
        .replace(/Internal Controls/gi, 'اندرونی کنٹرولز')
        .replace(/Current Ratio/gi, 'کرنٹ ریشو')
        .replace(/Quick Ratio/gi, 'کوئیک ریشو')
        .replace(/Debt Service Coverage \(DSCR\)/gi, 'قرض سروس کوریج (DSCR)')
        .replace(/Net Working Capital/gi, 'خالص ورکنگ کیپیٹل')
        .replace(/Gross Profit Margin/gi, 'مجموعی منافع مارجن')
        .replace(/Operating Margin \(EBITDA\)/gi, 'آپریٹنگ مارجن (EBITDA)')
        .replace(/Tax Provision Accrued/gi, 'ٹیکس فراہمی واجب الادا')
        .replace(/Net Profit Margin/gi, 'خالص منافع مارجن')
        .replace(/Strict Accrual/gi, 'سخت ایکروئل')
        .replace(/Grade A/gi, 'گریڈ A')
        .replace(/Passed/gi, 'کامیاب')
        .replace(/Verified/gi, 'تصدیق شدہ')
        .replace(/Compliant/gi, 'مطابق')
        .replace(/Certified/gi, 'تصدیق شدہ')
        .replace(/Positive/gi, 'مثبت')
        .replace(/Healthy/gi, 'بہترین')
        .replace(/Above Target/gi, 'ہدف سے بہتر')
        .replace(/Current/gi, 'موجودہ')
        .replace(/Solid/gi, 'مضبوط')
        .replace(/Strong \(>1\.35x\)/gi, 'مضبوط (>1.35x)')
        .replace(/Benchmark > 2\.0x/gi, 'معیار > 2.0x')
        .replace(/Benchmark > 1\.2x/gi, 'معیار > 1.2x')
        .replace(/Critical Liquidity Alert: Projected Cash Deficit/gi, 'اہم لیکویڈیٹی الرٹ: متوقع نقد خسارہ')
        .replace(/Action Required: Expedite Invoice Collections/gi, 'اقدام درکار: انوائس کی وصولی میں تیزی لائیں')
        .replace(/Projected cash balance drops below the \$5,000 safety threshold on/gi, 'متوقع نقد رقم $5,000 کی حفاظتی حد سے نیچے چلی گئی ہے بروز')
        .replace(/Expedited Settlement Notice/gi, 'فوری تصفیہ نوٹس')
        .replace(/Send Automated Reminder/gi, 'خودکار یاد دہانی بھیجیں')
        .replace(/Deploy Immediate Collection Protocol/gi, 'فوری وصولی کا پروٹوکول لاگو کریں')
        .replace(/Dear Accounts Payable Team,/gi, 'محترم اکاؤنٹس پے ایبل ٹیم،')
        .replace(/Our automated ledger has flagged invoice/gi, 'ہمارے خودکار لیجر نے انوائس کو نشان زد کیا ہے')
        .replace(/which is now past due\./gi, 'جو کہ اب واجب الادا ہو چکی ہے۔')
        .replace(/To assist in prompt clearing, our treasury is extending an expedited 2% settlement credit if remitted within 48 hours\./gi, 'فوری کلیئرنس میں سہولت کے لیے، ہمارا خزانہ 48 گھنٹوں کے اندر ادائیگی پر 2% تصفیہ کی چھوٹ فراہم کر رہا ہے۔')
        .replace(/Verified Balance Sheet & A\/R Aging Ledger vs invoices\.csv/gi, 'بیلنس شیٹ اور انوائسز لیجر کی تصدیق مکمل')
        .replace(/PASSED \(SHA-256 Validated\)/gi, 'کامیاب (SHA-256 توثیق شدہ)')
        .replace(/Hello! I am your Financial Pilot AI CFO\. I continuously monitor your transactions, cash trajectory, and vendor bills\. How can I help you today\?/gi, 'ہیلو! میں آپ کا فنانشل پائلٹ اے آئی سی ایف او ہوں۔ میں مسلسل آپ کے لین دین، کیش فلو اور سپلائر بلز کی نگرانی کرتا ہوں۔ آج میں آپ کی کیا مدد کر سکتا ہوں؟')
        .replace(/Based on our 30-day projection, cash starts at ~\$42,500 and increases to ~\$48,200 with normal variance\. Low cash alert threshold is set at \$5,000 and is not currently breached\. You have \$28,400 in receivables pending collection\./gi, 'ہمارے 30 دن کے تخمینے کے مطابق، نقد رقم ~$42,500 سے شروع ہو کر ~$48,200 تک پہنچتی ہے۔ کم نقد الرٹ کی حد $5,000 مقرر ہے اور فی الحال محفوظ ہے۔ آپ کے پاس $28,400 کی وصولیاں زیر التواء ہیں۔')
        .replace(/Your current Credit Readiness Score is 78\/100 \(Grade B\)\. To reach Grade A \(85\+\), focus on accelerating receivables collections past 85% on-time and maintaining operating profit margins above 25%\./gi, 'آپ کا موجودہ کریڈٹ ریڈینس سکور 78/100 (گریڈ B) ہے۔ گریڈ A (85+) حاصل کرنے کے لیے، بروقت وصولیوں کو 85% سے زیادہ کرنے اور آپریٹنگ منافع کے مارجن کو 25% سے اوپر رکھنے پر توجہ دیں۔')
        .replace(/You currently have 14 pending\/unpaid invoices totaling \$28,400 across 12 customers\. 3 invoices are overdue past Net 30\. Recommending sending automated reminder notices to top 3 overdue accounts\./gi, 'آپ کے پاس فی الحال 12 صارفین کے کل $28,400 کی 14 زیر التواء/غیر ادا شدہ انوائسز ہیں۔ 3 انوائسز 30 دن سے زائد تاخیر کا شکار ہیں۔ سرفہرست 3 کھاتوں کو خودکار یاد دہانی بھیجنے کی سفارش کی جاتی ہے۔')
        .replace(/Estimated YTD Net Profit is approximately \$58,200\. Based on standard 30% combined federal & state tax rate, estimated upcoming tax liability is ~\$17,460\. Recommend exploring Section 179 equipment deductions before Q4 ends\./gi, 'سالانہ خالص منافع کا تخمینہ تقریباً $58,200 ہے۔ 30% مشترکہ ٹیکس شرح کے مطابق، آنے والے ٹیکس واجبات کا تخمینہ ~$17,460 ہے۔ چوتھی سہ ماہی سے پہلے سیکشن 179 آلات کی کٹوتیوں کا جائزہ لینے کی سفارش کی جاتی ہے۔')
        .replace(/CRISIS MODE DETECTED: An unexpected \$59,000 cash drain and duplicate invoice flags were injected into the ledger\. Projected runway is compromised\. Recommendation: Halt non-critical disbursements, expedite receivables, and inspect invoice anomalies\./gi, 'بحرانی موڈ کی نشاندہی: ایک غیر متوقع $59,000 نقد اخراج اور ڈپلیکیٹ انوائس کے جھنڈے لیجر میں داخل کیے گئے ہیں۔ متوقع رن وے خطرے میں ہے۔ سفارش: غیر ضروری ادائیگیاں روکیں، وصولیوں میں تیزی لائیں اور بے ضابطگیوں کی جانچ کریں۔')
        .replace(/URGENT CFO EMERGENCY ADVISORY:/gi, 'فوری سی ایف او ہنگامی مشورہ:')
        .replace(/Identical dollar amounts and entity name matching within rolling 14-day chronological window\./gi, '14 دن کی مدت کے دوران یکساں رقم اور نام کا مماثل ریکارڈ پایا گیا۔')
        .replace(/Statistical outlier exceeding 2\.50 standard deviations above historical rolling average\./gi, 'تاریخی اوسط سے 2.50 معیاری انحرافات سے زیادہ کا شماریاتی آؤٹ لائر۔')
        .replace(/Unit cost elevation exceeds baseline catalog median by greater than 35%\./gi, 'بنیادی کیٹلاگ میڈین سے 35% سے زیادہ لاگت میں اضافہ پایا گیا۔')
        .replace(/Cross-reference bank ledger remittance slip with approved purchase orders\./gi, 'بینک لیجر کی سلپ کو منظور شدہ پرچیز آرڈرز سے کراس چیک کریں۔')
        .replace(/Require dual-signature sign-off before releasing pending disbursements\./gi, 'زیر التواء ادائیگیوں کے لیے دوہری تصدیقی دستخط لازمی قرار دیں۔')
        .replace(/Duplicate invoice detected with identical dollar amount and vendor within rolling 14 days/gi, '14 دن کے اندر ایک ہی وینڈر اور رقم کی ڈپلیکیٹ انوائس پکڑی گئی')
        .replace(/Statistical anomaly: transaction amount exceeds historical median by/gi, 'شماریاتی بے ضابطگی: لین دین کی رقم تاریخی اوسط سے زیادہ ہے بشرح')
        .replace(/Unit price increase of/gi, 'یونٹ قیمت میں اضافہ بشرح')
        .replace(/detected on raw cotton supply order/gi, 'خام کپاس کے آرڈر پر پکڑا گیا')
        .replace(/Contact (.+?) accounts receivable to verify billing schedule\./gi, 'بلنگ شیڈول کی تصدیق کے لیے وینڈر کے کھاتوں سے رابطہ کریں۔');

      return restore(res);
    }

    if (lang === 'zh') {
      // 1. Tax Executive Memorandum Section 1
      if (tokenized.includes('The company has generated') || tokenized.includes('gross YTD revenues')) {
        const zhSec1 = tokenized
          .replace(/The company has generated/gi, '企业年初至今已实现')
          .replace(/in gross YTD revenues/gi, '营业总收入')
          .replace(/offset by/gi, '抵扣')
          .replace(/in qualifying deductible operational expenditures/gi, '准予税前扣除的合规运营支出')
          .replace(/yielding a net taxable operating income of/gi, '形成净应纳税所得额')
          .replace(/Based on statutory manufacturing guidelines/gi, '依据制造业法定财税准则')
          .replace(/estimated total tax liability is projected at/gi, '预计应纳总税额为')
          .replace(/comprising/gi, '包含')
          .replace(/in corporate income tax at a/gi, '企业所得税（适用')
          .replace(/combined federal\/state rate/gi, '综合税率）')
          .replace(/and/gi, '以及')
          .replace(/in state sales & use tax provisions/gi, '销售与使用税计提')
          .replace(/With/gi, '扣除前期已计入的')
          .replace(/in recorded prior tax remittances/gi, '已缴历史税款后')
          .replace(/the estimated net outstanding balance due is/gi, '预计净待补差额为');
        return restore(zhSec1);
      }

      // 2. Tax Memorandum Section 2
      if (tokenized.includes('Operational deductions reflect standard garment manufacturing') || tokenized.includes('Operational deductions reflect')) {
        const zhSec2 = tokenized
          .replace(/Operational deductions reflect standard garment manufacturing cost structures:/gi, '运营扣除项精准反映成衣制造法定归集的各项成本分摊结构:')
          .replace(/Operational deductions reflect audited garment manufacturing cost allocations across statutory categories:/gi, '运营扣除项精准反映成衣制造法定归集的各项成本分摊结构:')
          .replace(/Raw Materials & Supplies \(COGS\):/gi, '生产原材料与采购耗材 (COGS):')
          .replace(/in textile, trim, and fabric procurement\./gi, '纺织、剪裁及五金辅料直接采购。')
          .replace(/Under IRC Section 471, ensure strict closing inventory capitalization reconciliations\./gi, '依据税法保留期末存货盘点对账单。')
          .replace(/Direct & Indirect Payroll:/gi, '一线直接与间接薪酬:')
          .replace(/in plant floor sewing operators and supervisory wages\./gi, '车间车工、设备维护技师与工段长薪资。')
          .replace(/Reconciled with quarterly Form 941 filings\./gi, '与季度 Form 941 薪资税核对。')
          .replace(/Facility & Production Overhead:/gi, '制造基础设施与固定制造费用:')
          .replace(/in factory leases/gi, '工厂厂房仓储租金')
          .replace(/in industrial electricity, steam, and cutting power\./gi, '工业高压电力能源支出。')
          .replace(/Wholesale Distribution & SG&A:/gi, '全国批发渠道分销及管理销售费用:')
          .replace(/in trade show exhibits and brand catalog distribution\./gi, '大型展会展位、样衣展厅及 B2B 目录推广。');
        return restore(zhSec2);
      }

      // 3. Tax Memorandum Section 3
      if (tokenized.includes('The primary priority is the upcoming') || tokenized.includes('safe-harbor')) {
        const zhSec3 = tokenized
          .replace(/The primary priority is the upcoming/gi, '核心第一优先级是即将到来的')
          .replace(/due on/gi, '截止于')
          .replace(/days remaining/gi, '天剩余')
          .replace(/To avoid late prepayment penalties, ensure quarterly installments satisfy IRS safe-harbor/gi, '为避免滞纳金罚款，请确保季度分期预缴税款满足避风港标准')
          .replace(/100% of prior-year liability or 90% of current-year projection/gi, '上年度 100% 或本年度预估 90%')
          .replace(/Maintain supporting vendor invoices for all COGS deductions exceeding/gi, '对单笔超过此金额的原材料采购支出保留详细发票');
        return restore(zhSec3);
      }

      // 4. WhatsApp collection reminder
      if (tokenized.includes('this is FinPilot Accounts Receivable') || tokenized.includes('past due')) {
        const zhWA = tokenized
          .replace(/Hi/gi, '尊敬的')
          .replace(/this is FinPilot Accounts Receivable regarding invoice/gi, '这是来自 Financial Pilot 财务部的账单提醒，关于发票')
          .replace(/for/gi, '金额')
          .replace(/which was due on/gi, '到期日为')
          .replace(/days past due/gi, '天逾期')
          .replace(/This balance is now significantly past due\. We kindly request an immediate update on the remittance schedule\./gi, '该账款已出现较长逾期，烦请您尽快同步最新的付款排期。')
          .replace(/We would appreciate it if you could verify the payment status with your accounts payable team this week\./gi, '如您能于本周内与应付账款部门确认付款进度，我们将不胜感激。')
          .replace(/Please let us know once payment has been released so we can reconcile your account\./gi, '如款项已安排汇出请及时告知我们，以便为您核销账目。')
          .replace(/Just a friendly check-in to confirm if you need another copy of the invoice or banking coordinates\./gi, '这是一封友好的对账确认函，如需补发发票副本或银行账号信息请随时告知。')
          .replace(/Thank you for your prompt attention!/gi, '感谢您的配合！');
        return restore(zhWA);
      }

      // 5. Auditor Opinion
      if (tokenized.includes('In our opinion, the accompanying financial statements present fairly') || tokenized.includes('present fairly')) {
        return '我们认为，后附的财务报表在所有重大方面均公允反映了企业的财务状况、经营成果及现金流量，严格符合公认会计准则 (GAAP) 标准。';
      }

      let res = tokenized
        .replace(/Expected net runway maintains/gi, '预计未来净现金流保持')
        .replace(/buffer across 30 days/gi, '安全缓冲（30 天周期）')
        .replace(/Cash flow trajectory demonstrates healthy liquidity through day 30/gi, '现金流走势预测显示未来 30 天周期内保持健康的流动性缓冲')
        .replace(/Accelerate collection of overdue invoices to boost liquidity score/gi, '加快催收逾期应收账款，以直接提升企业流动性得分')
        .replace(/Maintain debt-to-equity below 1\.5x by deferring non-essential equipment leases/gi, '暂缓非核心设备长期租赁，将资产负债率维持在 1.5x 以下')
        .replace(/Ensure on-time payment history with tier-1 raw fabric suppliers over the next 90 days/gi, '在未来 90 天内确保核心一级面料供应商账单的 100% 按期履约兑付')
        .replace(/Monte Carlo simulation of 500 stochastic paths projects a median ending balance/gi, '基于 500 条随机推演路径的蒙特卡洛预测显示期末中位数现金平稳')
        .replace(/Notice of Urgent Account Settlement/gi, '优先催收清欠函')
        .replace(/Includes 2% wire settlement incentive/gi, '包含 2% 提前电汇结算折扣')
        .replace(/Automated debt settlement notice with early-pay discount & wire routing/gi, '自动化欠款清收通知函（含提前结清优惠及银行账户信息）')
        .replace(/Notice successfully queued and transmitted to target accounts payable server!/gi, '通知函已成功加入发送队列并推送到目标财务系统！')
        .replace(/Subject Line:/gi, '主题:')
        .replace(/Executive Email Body \(Editable\):/gi, '正文内容 (可编辑):')
        .replace(/Recipient \(AP Contact\):/gi, '收件人:')
        .replace(/Target Invoice & Value:/gi, '目标发票及金额:')
        .replace(/GAAP Compliance & General Ledger Reconciliation/gi, 'GAAP 合规性与总账对账核销')
        .replace(/Commercial Credit Underwriting & Debt Capacity/gi, '商业信贷审批与负债承载能力')
        .replace(/Operating Margin Analysis & Statutory Tax Allocations/gi, '营业利润率分析与法定税项分摊')
        .replace(/Unqualified Clean Opinion \(Standard Manufacturing Accrual Basis\)/gi, '标准无保留审计意见（制造业权责发生制）')
        .replace(/Prime Credit Grade — High Liquidity Cushion & Working Capital Buffer/gi, '优质信用评级 — 充沛流动性缓冲与营运资金储备')
        .replace(/Books Closed Fiscal YTD — COGS Capitalized per IRC Sec\. 471/gi, '财年结账完毕 — 按税法 471 条核算资本化成本')
        .replace(/Effective — Segregation of duties & purchase order matching verified/gi, '内控有效 — 职责分离与采购订单三单匹配核验通过')
        .replace(/Zero debt defaults, excellent receivables turnover/gi, '零债务违约，应收账款周转率极佳')
        .replace(/Audit workpapers prepared for external year-end filing/gi, '外部年终申报审计底稿已完备归档')
        .replace(/Working capital easily covers covenant ratios \(>1\.75x required\)/gi, '营运资金充裕覆盖贷款契约比例（满足 >1.75x 要求）')
        .replace(/All depreciation and prepaid facility leases recorded/gi, '所有折旧及预付厂房租赁均已入账')
        .replace(/Reconciled with 0 unverified journal discrepancies/gi, '已完成对账，未发现未核实日记账差异')
        .replace(/Reconciliation Rate/gi, '对账核销率')
        .replace(/Ledger Checksum/gi, '账本校验和')
        .replace(/GAAP Consistency/gi, '会计准则一致性')
        .replace(/Internal Controls/gi, '内部控制等级')
        .replace(/Current Ratio/gi, '流动比率')
        .replace(/Quick Ratio/gi, '速动比率')
        .replace(/Debt Service Coverage \(DSCR\)/gi, '偿债备付率 (DSCR)')
        .replace(/Net Working Capital/gi, '净营运资金')
        .replace(/Gross Profit Margin/gi, '毛利率')
        .replace(/Operating Margin \(EBITDA\)/gi, '息税折旧摊销前利润率 (EBITDA)')
        .replace(/Tax Provision Accrued/gi, '计提税项备抵')
        .replace(/Net Profit Margin/gi, '净利润率')
        .replace(/Strict Accrual/gi, '严格权责发生制')
        .replace(/Grade A/gi, 'A 级认证')
        .replace(/Passed/gi, '通过')
        .replace(/Verified/gi, '已验证')
        .replace(/Compliant/gi, '合规')
        .replace(/Certified/gi, '已认证')
        .replace(/Positive/gi, '正值')
        .replace(/Healthy/gi, '良好')
        .replace(/Above Target/gi, '优于目标')
        .replace(/Current/gi, '当前')
        .replace(/Solid/gi, '稳健')
        .replace(/Strong \(>1\.35x\)/gi, '稳健 (>1.35x)')
        .replace(/Benchmark > 2\.0x/gi, '基准 > 2.0x')
        .replace(/Benchmark > 1\.2x/gi, '基准 > 1.2x')
        .replace(/Critical Liquidity Alert: Projected Cash Deficit/gi, '流动性告急预警：预测出现现金赤字')
        .replace(/Action Required: Expedite Invoice Collections/gi, '需要处理：加快逾期发票催收')
        .replace(/Projected cash balance drops below the \$5,000 safety threshold on/gi, '预测现金流将跌破 $5,000 安全线阈值，触发日期：')
        .replace(/Expedited Settlement Notice/gi, '优先结算通知函')
        .replace(/Send Automated Reminder/gi, '发送自动提醒')
        .replace(/Deploy Immediate Collection Protocol/gi, '启动紧急催收程序')
        .replace(/Dear Accounts Payable Team,/gi, '尊敬的应付账款部门：')
        .replace(/Our automated ledger has flagged invoice/gi, '财务自动对账系统已标记发票')
        .replace(/which is now past due\./gi, '该款项现已逾期。')
        .replace(/To assist in prompt clearing, our treasury is extending an expedited 2% settlement credit if remitted within 48 hours\./gi, '为协助贵司快速完成账目核销，若在 48 小时内完成电汇，我司将提供 2% 的即时结算折扣。')
        .replace(/Verified Balance Sheet & A\/R Aging Ledger vs invoices\.csv/gi, '资产负债表与应收账款账龄账册核对通过')
        .replace(/PASSED \(SHA-256 Validated\)/gi, '通过 (SHA-256 签名有效)')
        .replace(/Hello! I am your Financial Pilot AI CFO\. I continuously monitor your transactions, cash trajectory, and vendor bills\. How can I help you today\?/gi, '您好！我是您的 Financial Pilot AI 首席财务官 (CFO)。我持续监控您的交易明细、现金流走向与供应商账单。今天有什么我可以协助您的吗？')
        .replace(/Based on our 30-day projection, cash starts at ~\$42,500 and increases to ~\$48,200 with normal variance\. Low cash alert threshold is set at \$5,000 and is not currently breached\. You have \$28,400 in receivables pending collection\./gi, '根据 30 天预测，期初现金约为 ~$42,500，正常波动下将增长至 ~$48,200。现金告急预警线设为 $5,000，目前处于安全区间。您当前有 $28,400 待催回应收账款。')
        .replace(/Your current Credit Readiness Score is 78\/100 \(Grade B\)\. To reach Grade A \(85\+\), focus on accelerating receivables collections past 85% on-time and maintaining operating profit margins above 25%\./gi, '您当前的信贷就绪评分为 78/100（B 级）。要达到 A 级（85+ 分），请重点将按时回款率提升至 85% 以上，并将营业利润率保持在 25% 以上。')
        .replace(/You currently have 14 pending\/unpaid invoices totaling \$28,400 across 12 customers\. 3 invoices are overdue past Net 30\. Recommending sending automated reminder notices to top 3 overdue accounts\./gi, '您当前共有 12 位客户的 14 笔待付发票，总计 $28,400。其中 3 笔账单逾期已超 30 天。建议向逾期金额最高的前 3 位客户发送自动催收提醒函。')
        .replace(/Estimated YTD Net Profit is approximately \$58,200\. Based on standard 30% combined federal & state tax rate, estimated upcoming tax liability is ~\$17,460\. Recommend exploring Section 179 equipment deductions before Q4 ends\./gi, '预计年初至今净利润约为 $58,200。按照 30% 综合法定税率测算，即将到期的预估应纳税额约为 ~$17,460。建议在 Q4 结束前评估税法第 179 条款下的设备税前抵扣。')
        .replace(/CRISIS MODE DETECTED: An unexpected \$59,000 cash drain and duplicate invoice flags were injected into the ledger\. Projected runway is compromised\. Recommendation: Halt non-critical disbursements, expedite receivables, and inspect invoice anomalies\./gi, '检测到危机模式：账本中注入了突发的 $59,000 现金异常流出和重复发票标记。预计财务跑道受到威胁。建议：立即暂停非关键支出，加速应收账款催收，并复核异常账单。')
        .replace(/URGENT CFO EMERGENCY ADVISORY:/gi, '紧急 CFO 预警备忘：')
        .replace(/Identical dollar amounts and entity name matching within rolling 14-day chronological window\./gi, '滚动 14 天时间窗口内检测到完全一致的交易金额与收款主体。')
        .replace(/Statistical outlier exceeding 2\.50 standard deviations above historical rolling average\./gi, '统计异常值：金额超出历史滚动平均线 2.50 个标准差。')
        .replace(/Unit cost elevation exceeds baseline catalog median by greater than 35%\./gi, '单价异常：单位采购成本超出基础品类中位数 35% 以上。')
        .replace(/Cross-reference bank ledger remittance slip with approved purchase orders\./gi, '将银行水单与已核准的采购订单进行严格三单交叉比对。')
        .replace(/Require dual-signature sign-off before releasing pending disbursements\./gi, '在拨付待付款项前，严格执行双重签字审批授权程序。')
        .replace(/Duplicate invoice detected with identical dollar amount and vendor within rolling 14 days/gi, '滚动 14 天内检测到相同金额与供应商的重复发票')
        .replace(/Statistical anomaly: transaction amount exceeds historical median by/gi, '统计异常：交易金额超出历史中位数倍数达')
        .replace(/Unit price increase of/gi, '单价异常飙升')
        .replace(/detected on raw cotton supply order/gi, '原棉原料采购订单触发单价预警')
        .replace(/Contact (.+?) accounts receivable to verify billing schedule\./gi, '联系应收账款部门核实账单排期。');

      return restore(res);
    }

    return text;
  };

  const value = useMemo(
    () => ({
      lang,
      setLang: handleSetLang,
      t,
      translateGeminiContent,
      tGemini: translateGeminiContent,
      formatNumber,
      formatCurrency
    }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
