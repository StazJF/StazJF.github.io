# Personal Portfolio

A modern, responsive personal portfolio website with a dark, minimalist developer-focused design.

## Overview

This is a lightweight, static portfolio built to present projects, technical skills, services, and a contact pathway. It is designed to work well on desktop, tablet, and mobile screens.

## Features

- Responsive desktop and mobile navigation
- Smooth scrolling and active navigation states
- Scroll-reveal animations using the Intersection Observer API
- Expandable project details
- Working Formspree contact form with validation, spam checks, cooldown, and visitor-side rate limiting
- Back-to-top control
- Responsive hero portrait treatment
- No frontend frameworks or build process required

## Technology

- HTML5
- CSS3
- Vanilla JavaScript

## Project Structure

```text
portfolio2/
├── assets/
│   └── 2x2janjan.png
├── index.html
├── style.css
├── script.js
└── README.md
```

## Run Locally

No installation is needed. Open `index.html` directly in a modern browser, or serve this folder with any basic static web server.

For example, with Python installed:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deployment

Because this is a static site, it can be deployed to any static hosting provider. Upload the contents of this folder while keeping the `assets` directory alongside `index.html` so image paths continue to work.

Before publishing, review all page content and links to ensure you are comfortable making them public. Avoid committing credentials, API keys, private documents, or unnecessary personal data to the deployment repository.

## Enable the contact form

This site uses [Formspree](https://formspree.io/), which receives a standard HTML form submission and sends it to the inbox configured in its dashboard. No backend, email password, API key, or secret is put in this repository.

1. Create a Formspree account, create a new form, and set `maggayjanlaurenz@gmail.com` as its target email. Verify the address when Formspree asks.
2. Copy the form endpoint from Formspree (it has the form `https://formspree.io/f/abcde123`).
3. In `index.html`, replace only `REPLACE_WITH_YOUR_FORM_ID` in the contact form's `action` attribute with the ID from that endpoint.
4. In the Formspree form settings, restrict the form to the deployed portfolio domain. Keep Formspree's default spam filtering/reCAPTCHA enabled. Test with a real submission after deployment and check spam/junk once.

The public form ID is intentionally safe to publish: it identifies one fixed Formspree form, whose recipient is configured only in the Formspree dashboard. The page does not submit a recipient, CC/BCC, custom email-header, API-key, or credential field, so it cannot be turned into an arbitrary email relay.

### Spam and abuse protections

- Formspree's server-side spam filtering and its built-in low-friction reCAPTCHA protect actual delivery.
- Formspree's `_gotcha` honeypot silently discards obvious bot submissions.
- The client rejects a filled honeypot, submissions completed in under 3 seconds, duplicate in-flight requests, and more than 3 submissions in 15 minutes from the same browser.
- After a successful submission, the Send Message button stays disabled for 30 seconds.
- HTML constraint validation, email validation, lengths, trimming, and control-character removal run before the request. These improve usability; Formspree remains the server-side authority.

For a personal static portfolio, Formspree is preferable to EmailJS because it provides a fixed form-to-inbox workflow without configuring a personal mail provider/template. Web3Forms is a viable free static-form alternative but recommends CAPTCHA rather than its deprecated honeypot. Cloudflare Turnstile is an excellent extra challenge if spam becomes a real issue, but it is not needed initially because Formspree includes server-side spam detection and reCAPTCHA. If you later use a custom provider that requires a secret key, put it only in a serverless function or backend environment variable—never in `script.js`.

## Customization

- Edit `index.html` to update content, projects, links, and page sections.
- Edit `style.css` to adjust colors, typography, spacing, and responsive behavior.
- Edit `script.js` to refine site interactions.
- Replace `assets/2x2janjan.png` with another image using the same filename, or update its path in `index.html`.

## License

This project is intended for personal use. Add a license file if you plan to share, reuse, or accept contributions publicly.
