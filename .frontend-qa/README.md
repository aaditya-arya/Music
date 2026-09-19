# Frontend verification

Run from the website root with Node.js 22+ and Google Chrome installed:

    node .frontend-qa/check.cjs

The script starts a loopback-only static server and headless Chrome, checks all 20 pages, exercises navigation and dialogs, and checks representative layouts at 320, 390, 768, 1024, and 1440 pixels. It saves report.json and screenshots here, then closes the server and browser. No npm packages are required.

Shared website changes live in assets/site.css and assets/site.js. Every HTML page loads both files. Original HTML is retained in the .frontend-backup-20260918-131505 directory.

The existing form submission alerts are demonstrations; this frontend pass does not add a submission backend. Existing Tailwind CDN and Google Fonts dependencies are retained.
