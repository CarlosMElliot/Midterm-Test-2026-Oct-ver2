# High Note 5 — midterm

GitHub Pages test: 24 sections, 100 weighted points, section instructions, progress bar, compact dropdowns, seven listening tracks and clothing reference images.

## Students

Enter your name and complete the test. Answers save locally while working. Submit sends answers to the existing Vercel backend, which calculates the score and saves an encrypted record in `CarlosMElliot/Midterm-Test-2026-Oct`. Wait for **Saved to repository** and a receipt. If sending fails, answers remain on this device; use **Retry sending** or download a backup. Previous attempts remain accessible on Results after starting a new response.

Non-empty written responses earn full item completion credit in the provisional score. Blank responses earn zero. Written answers remain pending teacher review; teacher grades replace completion credit. Objective answers are scored against the backend question bank. Total weighting remains 100 points.

Three numbered focus warnings are displayed when leaving the test; the third ends the local attempt and prompts a restart. Browser monitoring is best effort. Each listening recording appears once at the top of its exercise. Continue buttons appear at both top and bottom.

## Teacher review and repository results

Use the authenticated [teacher dashboard](https://midterm-test-2026-oct.vercel.app/admin) to review automatically received answers and grade written work. Encrypted detailed records stay in the original repository's `exam-data` branch. The public teacher view includes student names, scores, timestamps, every question, all selected choices, complete written answers and unanswered items. Anyone can read these responses without signing in.

The **Sync repository scores** workflow copies complete public response reports for this edition into `site/results.json` and root `RESULTS.md`, then deploys Pages. It runs on a five-minute schedule; GitHub may delay scheduled runs. It can also be run manually in Actions. Teacher grade changes flow through the same sync. The original backend remains required for automatic submission. Its credentials stay server-side.

`teacher.html` is an optional local import/review tool. Changes made there are local and do not update the central dashboard. JSON and text report downloads are backups; email delivery is not automatic.

## Deployment and development

Select **Settings → Pages → GitHub Actions**. Workflows build `_site/` and deploy the interface, styles, question bank and media. The separate Vercel backend must remain available at its configured URL for submission; GitHub Pages itself cannot write repository records.

Node 22+, no dependencies. Run `npm test` and `npm run build`. Serve `site/` with an HTTP server. Asset URLs are relative and fingerprinted during builds. Answer keys in a static question bank are public; name-only submissions do not verify student identity.

## Public teacher view — no password

[Open all student responses](https://carlosmelliot.github.io/Midterm-Test-2026-Oct-ver2/responses.html)

Search a student's name and expand their attempt. Every section and question appears, including **Unanswered** items worth zero points. Choice questions show all options, the selected option, the expected answer and correctness. Written responses appear in full with completion credit and pending-review status. The page loads current submitted records from the backend; if unavailable, it falls back to the last repository copy in `site/results.json`. Refresh to load new submissions. The repository copy updates on the scheduled sync.

Viewing requires no password. Editing grades still requires teacher sign-in. Credentials and private teacher feedback are excluded from public reports. Existing submitted attempts in this Pages edition are included automatically; unsubmitted drafts remain on the student's device.
