# High Note 5 — static midterm

Complete GitHub Pages edition: 24 sections, 100 weighted points, progress bar, section instructions, seven audio recordings, reading images and 28 individual clothing reference views. Includes compact vocabulary/grammar dropdowns, inline story dropdowns and a **Submit a new response** button.

## Publish

In **Settings → Pages → Build and deployment**, select **GitHub Actions**. The included workflow validates the site and publishes `site/`. No Vercel account, environment secrets, API or database is required.

The first workflow copies the original audio and image files from a pinned commit of the original repository and commits them into this repo. Subsequent builds use those local copies.

## Students

1. Enter your name, read section instructions and complete the test.
2. Use the numbered listening tracks and unlabeled clothing reference images.
3. Submit, download the JSON response and send it to your teacher through your usual classroom channel. A readable report is also available.
4. Use **Submit a new response** for another attempt. Previous submissions remain stored on the browser.

Browser storage saves answers within one second and when navigating. It is local to this browser and site path. Clearing browser data removes it; there is no automatic central backup. Closing a tab is best-effort focus monitoring, not secure proctoring. Each detected departure produces one of three numbered popup warnings. The third ends the attempt and prompts a restart; its local record is retained. Each listening track is displayed once at the top of its exercise, with its question numbers when multiple tracks share a section.

## Teacher review and public results

Open `teacher.html`, import student JSON downloads, review answers, assign raw item points and save. Section weighting keeps the total at 100. Non-empty written responses receive full item completion credit immediately; whitespace-only and unanswered items receive zero. This credit is included in the provisional score, not a judgment of correctness. Teacher grades replace completion credit after review. Ambiguous unkeyed multiple-choice answers remain pending without completion credit. Download individual reports and a private backup of teacher reviews.

To publish results, download `results.json` and upload it into `site/` in this repository. Download `RESULTS.md` and upload it into the repository root for a readable table. Each attempt has its own row. The Pages workflow publishes changed summaries. Downloaded report files can be attached manually to an email; the site does not send email.

**Static limitations:** no private teacher login, no secure server grading and no automatic write from student browsers to GitHub. Question keys are public in `site/exam.json`; local results and downloaded files are editable. Teachers must verify results. Do not put credentials or raw student response files in this public repository. The teacher workspace is a local tool, not an authenticated admin system.

The original Vercel-backed application and its data remain in the original repository. Existing student attempts are not transferred automatically into this static edition.

## Development

Node 22+; no dependencies. Run `npm test` and `npm run build`. Serve `site/` with any static HTTP server (for example `python -m http.server 8000 --directory site`). Do not double-click the HTML: the application loads its question bank using HTTP.

All site paths are relative, including CSS, scripts, images and audio, so repository-level GitHub Pages URLs work. No server routes or external runtime services are required.
