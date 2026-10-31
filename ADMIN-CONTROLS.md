# WordPress editing map and CMS audit

Verified on `akshar.local`, October 31, 2026. Refresh an already-open editor to load the updated controls.

## Manage content without code

| Content or feature | Where to manage it |
| --- | --- |
| Homepage background videos | Home editor: numbered **Homepage video playlist**, above the hero. Add multiple videos from Media Library or add URLs. Replace, reorder or remove each numbered clip. Click WordPress **Save / Update**. |
| Regular page videos | Select a section, open **Section Settings**, then **Add video to this section**. Click an existing video to replace or remove that video. Save / Update. |
| Text, images, links | Click the item inside the visual canvas. Image selection includes **Image framing** for fit and focal position. Replacing an image clears stale responsive sources. |
| Repeated cards and lists | Select an item to duplicate, move or remove it. The block sidebar's **Cards and lists** can add an item after the list becomes empty. |
| Whole sections | Use WordPress block controls to move or remove a section. **Section Settings → Hide this section on the website** preserves the content while hiding it from the public page. |
| Search description and service popup details | **Page** sidebar → **Page details and popup copy**. Search for a field, choose it, edit and Save / Update. Images offer Media Library selection. |
| Shared header, footer and links | Their global visual blocks. Saved shared HTML is loaded into the other page editors so opening an older page does not load an outdated header. When a WordPress primary menu is assigned, the Services-menu action opens the native menu manager. |
| Service filter categories and keywords | Select a Services directory card, then **Service card settings** in the Block sidebar. |
| Request-specific form wording and options | We Hear You: select the main block and use **Request form copy**. Required fields, types and submission routing remain connected. |
| Standard form placeholders and existing option labels | Select the form control in the visual canvas, then **Form field wording**. Dynamic job choices are managed in AES Jobs. |
| Welcome screen and company brochure | **AES Website → Welcome screen and company brochure**. Set the first-visit switch, duration, name/caption/tagline, logo and PDF URL. Media chooser buttons are provided. |
| Jobs | **AES Jobs**. Published records feed the existing Careers and Join Us views. |
| Blog articles | **Posts**, including their native publishing, category, excerpt and featured-image controls. Edit the blog page's introductory content in Engineering Insights. |
| Policies and document links | **AES Website → Policy documents**. Existing starter policies remain drafts until approved content is published. |
| Requests and email notifications | **Form Submissions** and **AES Website → Email notifications**. The audit did not send notifications. |

Ordinary edits require Save / Update. **Sync from Code** deliberately restores starter markup and can replace saved edits; it is not needed for the new controls. PHP/JS/CSS changes in the active theme are used by the site; asset URLs use file modification times for cache refresh.

## Verification

All 24 managed pages returned HTTP 200. Their private audit copies accepted a visual or native WordPress content edit, retained it after an editor reload, and showed it in frontend preview:

- Home, About Us, Careers, Join Us, Services, We Hear You, Contact Us and Engineering Insights.
- All 16 service pages: API tank inspection, design examination, expediting, international sourcing, NDT inspection, owner's engineer, performance/hydro tests, pre-shipment inspection, process piping, process qualification, project/shutdown QA, QA/QC documentation, TPI, training, vendor assessment and welding engineering.

Focused checks also passed:

- Five clips selected together in the real WordPress Media Library; five clips retained after saving and reloading.
- Removal of clip three preserved the other clips. Reordering and replacement reached the player in the expected order; the removed clip did not return during playback.
- An empty playlist removed both player and buffer, stayed empty through subsequent saves, and accepted a newly added clip. Invalid playlist URLs blocked saving.
- Regular videos could be added, individually removed and replaced while retaining normal playback controls.
- A Services list could be reduced to zero cards, saved/reloaded and populated again. Its category and search keywords remained editable.
- Image fit/focal position and section hide/show changes reached the frontend.
- Request-specific copy, service popup title and search description saved through the native editor and reached the frontend.
- Welcome settings saved/reloaded; a configured brochure opened in the PDF reader with working zoom and close controls.
- All 44 unique local images checked from the previews loaded successfully. No browser runtime errors were recorded by these checks.
- Jobs, Posts, Form Submissions and native menu admin screens were accessible. Existing articles, jobs, requests and policy publishing states were preserved.

The 24 private test drafts, their revisions, five temporary media records and test login session were removed. No original media files were deleted. All published page-content hashes and the original shared header/footer, hero selection, shared values, notification setting and website settings matched the baseline afterward.

This verifies the active local installation. It does not establish the state of a separate hosted WordPress deployment.

## Form Submissions: daily admin workflow

Open **Form Submissions** in the WordPress sidebar. This is the main request inbox; the duplicate native submissions menu is hidden. Administrators with the `manage_options` capability can use it. Submissions and attachments remain private.

1. Use **Needs attention** or **Unread** to choose what to review. Request types distinguish inquiries, document verification, applications, training, feedback, and complaints/appeals. Search, type, status, unread and date filters work together. Dates use the WordPress timezone shown below the list.
2. Click a reference or **Open**. Opening an active request marks it read. The details panel shows every submitted field, the full message, each attachment, and the notification-system result. Email and phone links open your device's apps.
3. Choose **New**, **In progress**, **Resolved** or **Archived**, set Normal/High priority, and add an internal note. Click **Save changes**. Notes retain their author and timestamp; adding a note preserves earlier notes. Notes are visible only to administrators.
4. Closing the panel keeps unsaved changes while this page stays open. **Discard** clears that draft. Leaving or refreshing the page prompts if a draft remains. If another window changes the record, saving is blocked and your draft is kept; **Refresh request** loads the current record while retaining your unsaved form changes for review.
5. Select rows for bulk workflow, read/unread or Trash actions. **Select all** selects the current page. Change page size to 20, 50 or 100. **Export filtered CSV** exports every matching page, including full messages and all submitted fields; **Export selected** exports only the selected records. CSV values are escaped for spreadsheet use.
6. **Move to Trash** is recoverable through the Trash view. Restore returns a request privately to the inbox, with its notes and attachments. Permanent deletion is available only in Trash, requires confirmation, and removes the record and its attachments. WordPress may automatically empty old Trash according to its configured retention.

The list checks for updates every minute when the tab is visible and neither the details panel nor a selection is active. **Refresh** checks immediately without reloading the page. Existing records are indexed automatically when the inbox first opens. Lists are paginated on the server; attachment bodies and note histories are fetched only when needed. Phone layouts show request cards with visible Open buttons.

### Inbox verification, October 31, 2026

76 browser/API checks passed on the local installation with 32 temporary legacy-style fixtures and seven actual public submissions. They covered:

- A real Contact Us browser submission and the public verification, application, training, feedback and complaint flows; correct independent classification and complete multiline messages.
- Multiple attachments on one request; exact PDF/PNG download bytes; invalid file contents, individual file size, combined size, required fields, honeypots and nonces.
- Administrator access and denial of inbox data, exports and attachments to anonymous visitors and an editor-role test account.
- Combined filters, date boundaries, pagination, current-page selection, bulk workflow changes, full filtered CSV exports across pages, selected exports and spreadsheet formula escaping.
- Private note history, priority/status saves, stale-edit rejection with the draft retained, read/unread, keyboard focus/Escape/Tab handling, network failure/retry and a successful save followed by a failed detail refresh.
- Recoverable Trash, private Restore, Trash-specific counters, bulk Trash/Restore, rejection of deletion outside Trash, confirmed UI deletion and rejection through the old deletion endpoint.
- Empty states and desktop, 768px tablet and 390px phone layouts, with visible mobile actions and no page overflow. No browser JavaScript errors were recorded.

Notification delivery was not exercised: notifications were temporarily disabled for the fixtures and the original setting was restored. Temporary submissions, the editor-role test account and the dedicated admin login session were removed. The 25 published pages and 44 original AES options matched the baseline afterward. There were no pre-existing submissions on this installation.

The focused PHP regression checks can be rerun from the WordPress root:

```sh
wp eval-file wp-content/themes/akshar-engineering/tests/hero-playlist.php
wp eval-file wp-content/themes/akshar-engineering/tests/submission-inbox.php
```
