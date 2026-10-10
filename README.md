# High Note 5 — midterm

GitHub Pages test: 24 sections, 100 weighted points, section instructions, progress bar, compact dropdowns, seven listening tracks and clothing reference images.

## Students

Enter your name and complete the test. Answers save locally while working. Submit sends answers to the existing Vercel backend, which calculates the score and saves an encrypted record in `CarlosMElliot/Midterm-Test-2026-Oct`. Wait for **Saved to repository** and a receipt. If sending fails, answers remain on this device; use **Retry sending** or download a backup. Previous attempts remain accessible on Results after starting a new response.

Non-empty written responses earn full item completion credit in the provisional score. Blank responses earn zero. Written answers remain pending teacher review; teacher grades replace completion credit. Objective answers are scored against the backend question bank. Total weighting remains 100 points.

Three numbered focus warnings are displayed when leaving the test; the third ends the local attempt and prompts a restart. Browser monitoring is best effort. Each listening recording appears once at the top of its exercise. Continue buttons appear at both top and bottom.

## Teacher review and repository results

Use the authenticated [teacher dashboard](https://midterm-test-2026-oct.vercel.app/admin) to review automatically received answers and grade written work. Encrypted detailed records stay in the original repository's `exam-data` branch. Public summaries include student names, scores, grading status and timestamps.

The **Sync repository scores** workflow copies public summaries for this edition into `site/results.json` and root `RESULTS.md`, then deploys Pages. It runs on a five-minute schedule; GitHub may delay scheduled runs. It can also be run manually in Actions. Teacher grade changes flow through the same sync. The original backend remains required for automatic submission. Its credentials stay server-side.

`teacher.html` is an optional local import/review tool. Changes made there are local and do not update the central dashboard. JSON and text report downloads are backups; email delivery is not automatic.

## Deployment and development

Select **Settings → Pages → GitHub Actions**. Workflows build `_site/` and deploy the interface, styles, question bank and media. The separate Vercel backend must remain available at its configured URL for submission; GitHub Pages itself cannot write repository records.

Node 22+, no dependencies. Run `npm test` and `npm run build`. Serve `site/` with an HTTP server. Asset URLs are relative and fingerprinted during builds. Answer keys in a static question bank are public; name-only submissions do not verify student identity.
