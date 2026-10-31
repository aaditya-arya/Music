<?php
// Run with: wp eval-file wp-content/themes/akshar-engineering/tests/submission-inbox.php
// Read-only regression checks; creates no submissions and sends no email.
function aes_inbox_assert($condition, $message) { if (!$condition) throw new RuntimeException($message); }
$meta = ['_aes_form'=>'contact-us-inquiry', '_aes_form_title'=>'Custom heading', '_aes_details'=>[
    ['name'=>'contactname','label'=>'Edited label','value'=>'Test contact'],
    ['name'=>'contactemail','label'=>'Edited label','value'=>'writer@example.invalid'],
    ['name'=>'contactphone','label'=>'Edited label','value'=>'+91 9000000000'],
    ['name'=>'contactmessage','label'=>'Edited label','value'=>"A complete scope.\nSecond line."],
]];
$summary = aes_inbox_summary($meta);
aes_inbox_assert($summary['name']==='Test contact' && $summary['email']==='writer@example.invalid' && $summary['phone']==='+91 9000000000', 'Canonical field names must survive label changes.');
aes_inbox_assert($summary['message']==="A complete scope.\nSecond line." && $summary['category']==='inquiry', 'Complete multiline messages and form classification must survive.');
foreach (['inquiry'=>'inquiry','feedback'=>'feedback','complaint_appeal'=>'complaint','doc_verify'=>'verify'] as $reason=>$category) {
    $result = aes_inbox_summary(['_aes_form'=>'we-hear-you-0','_aes_details'=>[['name'=>'reasonDropdown','value'=>$reason],['name'=>'selectedReasonInput','value'=>'A presentation label']]]);
    aes_inbox_assert($result['category']===$category && !$result['name'], 'Support request types must stay distinct and reason labels must not become contact names.');
}
$result = aes_inbox_summary(['_aes_form'=>'about-1','_aes_form_title'=>'trainingModal','_aes_details'=>[['name'=>'field_0','value'=>'Training contact'],['name'=>'field_2','value'=>'training@example.invalid / +91 9876543210']]]);
aes_inbox_assert($result['category']==='training' && $result['name']==='Training contact' && $result['email']==='training@example.invalid' && $result['phone']==='+91 9876543210', 'Legacy generic fields and combined email/phone must use their schema.');
aes_inbox_assert($result['form_title']==='Training registration', 'Internal modal IDs must become readable source labels.');
$career = aes_inbox_summary(['_aes_form'=>'careers-apply','_aes_details'=>[['name'=>'eduQualification','value'=>'Engineering'],['name'=>'candidateSummary','value'=>'Complete project summary']]]);
aes_inbox_assert($career['message']==='Complete project summary', 'A qualification must not hide the candidate project summary.');
foreach (['=SUM(1,2)',' +SUM(1,2)',"\tcmd",'-1','@name'] as $cell) aes_inbox_assert(str_starts_with(aes_inbox_csv_cell($cell), "'"), 'Spreadsheet formula prefixes must be escaped.');
aes_inbox_assert(aes_inbox_csv_cell("Ordinary, quoted \"text\"\nnext line") === "Ordinary, quoted \"text\"\nnext line", 'Ordinary CSV field content must stay complete.');
foreach ([['from'=>'2026-02-30'],['from'=>'2026-11-01','to'=>'2026-10-31'],['category'=>'unknown'],['q'=>['invalid']],['status'=>'deleted']] as $input) aes_inbox_assert(is_wp_error(aes_inbox_filters($input)), 'Invalid filters must be rejected.');
$filters = aes_inbox_filters(['category'=>'complaint','status'=>'open','unread'=>'1','from'=>'2026-10-01','to'=>'2026-10-31','per_page'=>'50','sort'=>'oldest']);
aes_inbox_assert(!is_wp_error($filters) && $filters['per_page']===50 && $filters['sort']==='ASC' && $filters['unread'], 'Valid combined filters must be accepted.');
aes_inbox_assert(aes_inbox_filters(['per_page'=>10000])['per_page']===20, 'Page size must be bounded.');
echo "Submission inbox regression checks passed.\n";
