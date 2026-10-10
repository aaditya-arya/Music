# Akshar Engineering WordPress theme

This repository contains the complete custom WordPress theme for Akshar Engineering Services. Keep the folder at `wp-content/themes/akshar-engineering` and activate **Akshar Engineering CMS**. On a new site, use **AES Website → Import AES pages** to create the pages and starter vacancies.

## Editing the site

- Edit page content through the visual AES blocks in the WordPress page editor.
- Shared header and footer blocks use one canonical value across the site.
- Change the home video through the dedicated WordPress video setting. Later page saves preserve that selection.
- Manage vacancies in **AES Jobs**. Both Careers and Join Us use the published job records.
- Read inquiry and application records in **Form Submissions**. Attachments support PDF, JPG and PNG, up to 2 MB each and 5 MB total. Notifications remain controlled by the existing WordPress setting.

## Presentation

The theme includes locally hosted Inter and Manrope fonts, a first-visit five-second brand introduction, subtle scroll and hover motion, an expanded Services menu, visual service workflows, and redesigned Contact Us and Careers pages. Motion preferences are respected.

Contact Us includes an inline inquiry form. Careers keeps its application fields and attachment validation, with optional role selection linked to published vacancies. One-time migrations update existing page designs without repeatedly replacing page edits. The footer takes its corporate address from Contact Us and omits the accreditation paragraph.

The company brochure opens in a scrolling PDF viewer with zoom, download and close controls. [PDF.js](https://github.com/mozilla/pdf.js) is bundled locally and loaded when the brochure opens. Its Apache 2.0 license and version are included in `assets/vendor/pdfjs`. Font licenses are included in `assets/fonts`.

## Deployment

Install or update the entire theme directory. The theme uses `index.php` for its manifest-based page rendering; obsolete `page.php`, `header.php` and `footer.php` templates must not remain from an older installation.

WordPress content, submissions, credentials and uploaded media are stored outside this repository. A Git push updates the theme source; deploy that source to update a hosted WordPress site.

## Validation

The implementation was checked in Chromium at desktop, tablet and mobile widths. Checks cover all 23 page routes, form validation and local submissions with PDF attachments, vacancy selection, menu and modal interactions, brochure rendering and controls, stable button colors, reduced motion, and preservation of the saved home video. Temporary test submissions were removed.
