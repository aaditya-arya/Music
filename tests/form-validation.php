<?php
// Run inside WordPress (wp eval-file). Read-only: sends no mail and creates no submissions.
function aes_validation_assert($value, $message) { if (!$value) throw new RuntimeException($message); }
foreach (aes_data('forms') as $form => $schema) {
    $values = [];
    $constraints = aes_form_constraints($form);
    foreach (aes_form_rules($form) as $name => $rule) {
        if (!$rule['required'] || $rule['kind'] === 'file') continue;
        $values[$name] = match ($rule['kind']) {
            'person' => "Zoë O'Neil", 'email' => 'qa@example.invalid', 'tel' => '9876543210', 'experience' => '7.5', 'challenge' => '10', 'contact' => 'qa@example.invalid / +91 9876543210', default => 'Valid example',
        };
        if (!empty($constraints['choices'][$name])) $values[$name] = $constraints['choices'][$name][0];
    }
    aes_validation_assert(!aes_validate_fields($form, $values, wp_create_nonce('aes_math_' . $form . '_10')), 'Valid schema rejected: ' . $form);
}
$valid = ['contactname' => "Anne-Marie O’Neil", 'contactemail' => 'qa@example.invalid', 'contactphone' => '+91 9876543210', 'contactmessage' => 'An inspection is required.'];
foreach (['contactname' => ['Raj123', '123', '   ', '<bad>'], 'contactphone' => ['98765abc10', '12345', '+91 abc 1234567'], 'contactemail' => ['writer@', 'writer@example', 'writer @example.com']] as $name => $examples) foreach ($examples as $example) {
    $test = $valid; $test[$name] = $example;
    aes_validation_assert(isset(aes_validate_fields('contact-us-inquiry', $test)[$name]), 'Invalid value accepted: ' . $name . ' = ' . $example);
}
aes_validation_assert(!aes_validate_fields('contact-us-inquiry', $valid + ['contactcompany' => '3M Engineering']), 'Company names must allow digits.');
aes_validation_assert(isset(aes_validate_fields('careers-apply', ['candidateexperience' => '-1'])['candidateexperience']), 'Negative experience accepted.');
aes_validation_assert(isset(aes_validate_fields('careers-apply', ['candidateexperience' => '51'])['candidateexperience']), 'Excessive experience accepted.');
aes_validation_assert(isset(aes_validate_fields('we-hear-you-0', ['issuedate' => '2099-01-01'])['issuedate']), 'Future issue date accepted.');
aes_validation_assert(isset(aes_validate_fields('we-hear-you-0', ['issuedate' => '2026-02-30'])['issuedate']), 'Impossible date accepted.');
aes_validation_assert(isset(aes_validate_fields('home-0', ['field_7' => '8'], wp_create_nonce('aes_math_home-0_10'))['field_7']), 'Wrong verification answer accepted.');
foreach (['qa@example.invalid / 12345abc67890', 'qa@example.invalid / 12345', 'qa@example.invalid / ++919876543210', 'not-an-email / 9876543210'] as $contact) {
    aes_validation_assert(isset(aes_validate_fields('about-1', ['field_2' => $contact])['field_2']), 'Invalid combined email/phone accepted.');
}
aes_validation_assert(!isset(aes_validate_fields('about-1', ['field_2' => 'qa@example.invalid / +91 9876543210'])['field_2']), 'Valid international combined contact rejected.');
aes_validation_assert(isset(aes_validate_fields('careers-apply', ['candidateexperience' => '1e2'])['candidateexperience']), 'Scientific notation must not bypass experience bounds.');
aes_validation_assert(isset(aes_validate_fields('careers-apply', ['candidateexperience' => '1.234'])['candidateexperience']), 'Experience precision must remain bounded.');
aes_validation_assert(!isset(aes_validate_fields('careers-apply', ['candidateexperience' => '0'])['candidateexperience']), 'Zero years of experience must be allowed.');
aes_validation_assert(!isset(aes_validate_fields('careers-apply', ['candidateexperience' => '50'])['candidateexperience']), 'The upper experience boundary must be allowed.');
aes_validation_assert(isset(aes_validate_fields('we-hear-you-0', ['feedbackrating' => 'unlisted-rating'])['feedbackrating']), 'Unknown selection accepted.');
aes_validation_assert(isset(aes_validate_fields('careers-apply', ['jobid' => '999999999'])['jobid']), 'Nonexistent opening accepted.');
$published_jobs = get_posts(['post_type' => 'aes_job', 'post_status' => 'publish', 'numberposts' => 1]);
if ($published_jobs) {
    $job = $published_jobs[0];
    aes_validation_assert(isset(aes_validate_fields('careers-apply', ['jobid' => (string) $job->ID, 'candidaterole' => 'A different role'])['candidaterole']), 'An application must match its published role.');
    $role = ['jobid' => (string) $job->ID, 'candidaterole' => html_entity_decode($job->post_title, ENT_QUOTES | ENT_HTML5, 'UTF-8')];
    $errors = aes_validate_fields('careers-apply', $role);
    aes_validation_assert(!isset($errors['jobid']) && !isset($errors['candidaterole']), 'The correct published role binding must be accepted.');
}
echo "All form schemas, person names, phones, emails, dates, experience and verification regression checks passed.\n";
