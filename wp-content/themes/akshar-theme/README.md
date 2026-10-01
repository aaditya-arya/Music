# Akshar Engineering Services — Custom WordPress Theme (`akshar-theme`)

This custom WordPress theme converts the entire AES corporate static website into an enterprise-grade, dynamic WordPress environment with:
- **Tailwind CSS & Plus Jakarta Sans typography**
- **Sequential Infinite 4-Video Background Engine**
- **Dynamic Heyzine 3D Interactive Flipbook Modal (`https://heyzine.com/flip-book/4b6632ed19.html`)**
- **Customizer integration for instant PDF Brochure updates**
- **Zero-code Form Inbox Management (Fluent Forms / WPForms)**

---

## 🚀 Quick Setup with LocalWP (Phase 1 & 2)

1. **Download & Install LocalWP**:
   - Download free from [localwp.com](https://localwp.com/).
2. **Create a Site**:
   - Click **+ Create a New Site** &rarr; Name it `akshar-engineering` &rarr; Choose Preferred Environment.
3. **Copy Theme Files**:
   - Click **Go to site folder** in LocalWP.
   - Navigate to: `app/public/wp-content/themes/`
   - Copy this entire `akshar-theme` folder into `wp-content/themes/`.
4. **Copy Asset Files**:
   - Ensure the `assets/` and `video/` folders are present inside `akshar-theme/assets/` and `akshar-theme/video/`.
5. **Activate the Theme**:
   - Log into WP Admin (`http://akshar-engineering.local/wp-admin`).
   - Go to **Appearance &rarr; Themes** &rarr; Click **Activate** on **Akshar Engineering Services**.

---

## 📄 Creating Core Pages (Phase 3)

Under **Pages &rarr; Add New**, create the following pages and select their corresponding template from the **Page Attributes** box on the right:

| Page Title | URL Slug | Template Attribute |
|---|---|---|
| Home | `/` | Front Page |
| About Us | `/about` | About Us Page |
| Services | `/services` | Services Page |
| Careers | `/careers` | Careers Page |
| Join Us | `/join-us` | Join Us (Open Roles) |
| We Hear You | `/we-hear-you` | We Hear You (Client Care) |

*Set the Home page as static front page under **Settings &rarr; Reading &rarr; Your homepage displays &rarr; A static page &rarr; Home**.*

---

## 📋 Form & Admin Inbox Engine (Phase 4)

1. Go to **Plugins &rarr; Add New** &rarr; Install **Fluent Forms** or **WPForms**.
2. Create the 5 AES Forms:
   - General Technical Inquiry
   - Document Verification Request (with file upload for PDF/scan)
   - Training Registration
   - Careers Application (with resume upload)
   - Client Feedback Hub
3. Submissions automatically appear under **WP Admin &rarr; Fluent Forms / WPForms &rarr; Entries** with CSV/Excel export and email notifications to `info@aksharengineeringservices.com`.

---

## 📖 PDF & Heyzine Flipbook Management (Phase 5)

Go to **Appearance &rarr; Customize &rarr; AES Company & Brochure Settings**:
- **Interactive Heyzine Flipbook URL**: `https://heyzine.com/flip-book/4b6632ed19.html`
- **Brochure PDF Download URL**: Dynamic link to your uploaded brochure PDF.
- **Company Phone & Email**: Editable directly without touching code.
