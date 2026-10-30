# Akshar Engineering WordPress theme

This repository contains the complete custom WordPress theme for Akshar Engineering Services. Keep the folder at `wp-content/themes/akshar-engineering` and activate **Akshar Engineering CMS**. On a new site, use **AES Website → Import AES pages** to create the pages and starter vacancies.

For the existing local project, open Local, select **akshar**, click **Start site**, then open `http://akshar.local/`. Use **WP Admin** to edit the site. The theme has no Node development server or frontend build step.

## Editing the site

- Edit page content through the visual AES blocks in the WordPress page editor.
- Shared header and footer blocks use one canonical value across the site.
- Change the home video through the dedicated WordPress video setting. Later page saves preserve that selection.
- Manage vacancies in **AES Jobs**. Both Careers and Join Us use the published job records.
- Read inquiry and application records in **Form Submissions**. Attachments support PDF, JPG and PNG, up to 2 MB each and 5 MB total. Notifications remain controlled by the existing WordPress setting.
- Use **AES Website** to search the page list and open an editor or preview. On the Services page, selecting a card exposes its filter category and search keywords in the block sidebar.
- On We Hear You, select the main visual block and open **Request form copy** in the block sidebar. Each request type has editable headings, guidance, button wording and relevant field labels/options. The form's field names and validation remain connected.
- Four policy starter pages remain drafts under **AES Website → Policy documents**. Replace their editorial prompts with approved content and publish when ready. Published pages appear in the footer automatically; an optional full page/PDF URL overrides the starter page. Unpublished drafts without an override stay hidden.

## Presentation

The theme includes locally hosted Montserrat and Inter fonts, a first-visit five-second brand introduction, subtle scroll and hover motion, an expanded Services menu, visual service workflows, and redesigned Contact Us and Careers pages. Motion preferences are respected.

The Services directory explains all 16 scopes in plain language, including when to use them and the expected outputs. Project-need filters and search work together; the complete portfolio remains readable without JavaScript. Its one-time migration preserves shared navigation, the footer and later page edits.

Contact Us includes an inline inquiry form. Careers keeps its application fields and attachment validation, with optional role selection linked to published vacancies. One-time migrations update existing page designs without repeatedly replacing page edits. The footer takes its corporate address from Contact Us and omits the accreditation paragraph.

We Hear You has four request categories with relevant fields, supporting documents and clear next steps. Category drafts are retained while switching; both browser and server validate the required details. Careers presents its four working principles as an image row with headings and connecting arrows, with horizontal scrolling on smaller screens.

The company brochure opens in a scrolling PDF viewer with zoom, download and close controls. [PDF.js](https://github.com/mozilla/pdf.js) is bundled locally and loaded when the brochure opens. Its Apache 2.0 license and version are included in `assets/vendor/pdfjs`. Font licenses are included in `assets/fonts`.

## Deployment

Install or update the entire theme directory. The theme uses `index.php` for its manifest-based page rendering; obsolete `page.php`, `header.php` and `footer.php` templates must not remain from an older installation.

WordPress content, submissions, credentials and uploaded media are stored outside this repository. A Git push updates the theme source; deploy that source to update a hosted WordPress site.

## Validation

The implementation was checked in Chromium at desktop, tablet and mobile widths. Checks cover all 23 page routes, form validation and local submissions with PDF attachments, vacancy selection, menu and modal interactions, brochure rendering and controls, blue buttons with orange selected/pressed states, reduced motion, and preservation of the saved home video. Temporary test submissions were removed.

The responsiveness audit covered all 23 routes at 320, 360, 390, 540, 768, 820, 1024, 1280, 1440 and 1920 pixels, plus 270 popup/viewport combinations. Phone inquiry fields stack in one column, popup headings and close controls stay visible while scrolling, and the mobile menu measures the available space below the header, including short landscape viewports. The welcome overlay releases scrolling and keyboard navigation as soon as it fades away.

Real Gutenberg saves were checked on isolated draft copies of Services, We Hear You, Contact Us, Careers, About and a service detail page. Checks include reloading the editor, viewing saved content, changing support-form copy/options and duplicating service cards with updated filter counts. Admin search, request classification, filtered CSV export, keyboard navigation and deletion were tested with temporary records. The audit preserved all live page content, shared header/footer, the selected home video and notification settings; test drafts, submissions and the temporary administrator session were removed.

Main headings use Montserrat; subheadings and supporting copy use Inter. Action buttons use blue, with orange pressed states. Header Contact buttons have no resting shadow or underline; the Services chevron has a transparent background. Core Services and Sectors retain navy text panels. Services directory cards use white panels, blue headings and key labels, and gray body copy. Service filters and support request choices use white cards with an orange selection outline. “All services” is a plain label; Clear filters appears only when a category or search is active. Homepage heading rules fill once from the left and remain filled. Mobile menu links stay in place through focus changes so native navigation can complete.

About Us shows `assets/Face.jpeg` as the owner's portrait in the introductory section, with his name and role underneath. The image fits its frame without cropping the face and stacks below the introduction on smaller screens. One-time content updates preserve the editable company story, leadership quote and service cards.
