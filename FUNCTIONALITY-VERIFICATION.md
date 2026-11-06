# Functionality verification — November 6, 2026

Verified against the active WordPress theme on `akshar.local`, starting from application commit `c4a37d1`. Browser checks used Chromium automation. No application failures remained in the exercised workflows; this verification adds regression coverage rather than application changes.

| Area | Checks | Result |
| --- | --- | --- |
| Syntax | 32 PHP files and 16 JavaScript files | Passed |
| Server validation regression | All 92 registered form schemas; Unicode names, international phones, email, combined contact fields, experience bounds/precision, dates, allowed choices, verification answers and published-role binding | Passed |
| Submit/reset UI | Two successful cycles across 23 forms, with controlled success responses: 46 cycles. Submit labels remain visible and buttons remain enabled after reset. | Passed |
| Real submissions | Two contact submissions, a support feedback request and a role-specific application with CV/certificate PDFs. Verified saved records, references and preserved support reason/submit labels. | Passed |
| Invalid HTTP submissions | 16 rejection cases covering invalid names/phones/emails, duplicate/unknown/array fields, invalid nonce, missing/invalid/oversize attachments and wrong role bindings | Passed |
| Failure recovery | Controlled server and network failures, followed by retry, success and another-form reset | Passed |
| Jobs | Department groups, search/reset, role-page navigation, application binding, native admin field save/reload | Passed |
| Permissions | Administrators retain job management; editor/guest management is denied; editor REST job creation returns 403; guests cannot download private attachments | Passed |
| Admin attachments | Candidate qualifications summary, labelled attachments, PDF canvas rendering, zoom, byte-accurate download and preview close. Also checked a phone-sized admin drawer. | Passed |
| Public routes and mobile layout | 31 page/role routes at 320px and 412px: 62 checks of HTTP responses, form wiring, browser errors and horizontal overflow | Passed |
| Navigation and other controls | Mobile menu, all four Careers images, brochure PDF render/zoom/close, service filters/empty-state/reset and blog article navigation | Passed |

The UI cycle tests used intercepted success responses to exercise repeatability without creating dozens of records. The real-submission checks separately verified the WordPress submission endpoint, persistence, PDF upload and administrator retrieval. Negative HTTP tests reached the real endpoint and were rejected.

Temporary submissions, the draft job, test user and administrator session were removed. Existing published jobs and page content were checked against their pre-test snapshots. Notification and rate-limit settings were restored. Test notifications were disabled, so outbound email delivery was not exercised. Phone layouts were checked in browser emulation, not on a physical Samsung device.

## Repeatable repository checks

Run these in an installed WordPress environment, from the WordPress root:

```sh
wp eval-file wp-content/themes/akshar-engineering/tests/form-validation.php
wp eval-file wp-content/themes/akshar-engineering/tests/submission-inbox.php
```

These repository regression checks are read-only: they create no submissions and send no email. The full browser verification also used temporary local test harnesses outside the repository; session cookies, uploaded fixtures and private records are not included in Git.
