# High Note 5 — GitHub Pages + Supabase

The test runs on **GitHub Pages**. **Supabase** handles submissions and server-side scoring. **Vercel is not required by this edition.**

- [Take the test](https://carlosmelliot.github.io/Midterm-Test-2026-Oct-ver2/)
- [Public teacher view — no password](https://carlosmelliot.github.io/Midterm-Test-2026-Oct-ver2/responses.html)
- [Results table](RESULTS.md)
- [Supabase project dashboard](https://supabase.com/dashboard/project/mntmiggooahfasgzjvch)

## What happens on Submit

1. The student enters only a name and completes the test. Progress saves on their device while they work.
2. Submit sends the name, answers, attempt ID, start time and focus count to the Supabase `midterm-api` Edge Function.
3. The function validates answers against its question bank, calculates the score and stores the complete attempt in `public.midterm_submissions`. Client-supplied scores and grades are ignored. Retrying the same submission does not create duplicates.
4. **Saved online** and a receipt confirm database storage. If sending fails, the student can retry; the response stays saved on their device.
5. GitHub Actions copies complete public reports into `site/results.json`, updates `RESULTS.md`, and deploys Pages. The workflow runs every five minutes, but GitHub can delay scheduled runs. Supabase receipt confirmation does not mean the GitHub copy has finished yet.

## Every response is included

The public teacher view shows the student's name, total /100, timestamps, every section and every question. Choice questions show all options, the selected choice, expected answer, points and Correct/Incorrect status. Omitted questions appear as **Unanswered**, worth zero. Written responses appear in full. Non-empty written responses receive completion credit, pending teacher review; final teacher grades replace that credit. The total remains 100 weighted points.

Anyone can view student responses without a password. The page loads current Supabase reports, falling back to the repository copy if unavailable. Older records already in the repository are retained; detailed answers stored only in the previous backend are not automatically migrated.

## Teacher grading

Viewing responses requires no sign-in. To grade directly in the public teacher view, expand **Teacher grading access** and enter the private edit code provided separately. Expand a student and section, edit points beside any question, then click **Save changed points**. Section and overall weighted scores update immediately, and GitHub copies the update on the next sync. Only edited questions are graded. **Restore automatic points** removes an override after saving. Points must stay within each question's raw maximum; the overall maximum stays 100. Conflicting simultaneous updates are rejected so a stale page cannot overwrite newer grades.

The edit code is checked server-side against a SHA-256 hash in the restricted `midterm_teacher_access` table. It is never committed to GitHub or persisted in the browser. Supabase owner access can also manage the `grades` JSON in `midterm_submissions`.

`teacher.html` remains an optional local JSON import/review workspace; edits made there do not update Supabase. No database password or secret API key is stored in this repository. The frontend's publishable application key is intentionally public. RLS is enabled and direct anonymous/authenticated table access is revoked; only the server function writes submissions. Names do not verify student identity. Public results and question keys are visible to students.

## Test behavior

11 sections, 27 steps, 100 points, seven audio recordings, clothing reference images, compact dropdowns, section instructions, progress indicator and top/bottom Continue buttons. Each recording appears once per exercise. Switching tabs or windows produces no popup warnings and never restarts the attempt. Progress still saves on navigation and when the page is hidden or closed. Submit a new response starts a separate attempt. Receipt details, JSON downloads, results links and teacher navigation are hidden from the student test screen. Students can download a readable report or submit a new response. Teachers can still open the response dashboard directly. Email sending is not configured in this edition.

## Deployment and source

GitHub Settings → Pages → GitHub Actions. `npm test` and `npm run build` validate and build `_site/`. All audio, images and styles live in this repository. Node 22+, no package dependencies.

- `site/backend-config.js`: public project endpoint and publishable key.
- `supabase/schema.sql`: deployed table, index, RLS and timestamp trigger.
- `supabase/functions/midterm-api/`: deployed Edge Function and server-side exam/grading snapshot.
- `.github/workflows/sync-results.yml`: database-to-repository report sync.

The Edge Function authenticates the public application key itself (`verify_jwt=false`) and uses Supabase's server-only environment credentials for database access. Deploy its complete folder when changing server scoring or the question bank. Keep `site/exam.json` and the function's exam snapshot/version synchronized. Run security advisors after schema changes; the intentional RLS-with-no-policies notice reflects the service-only table design.

The student test and teacher accordions consolidate the 24 original exercise groups into 11 sections. All questions, tracks and original scoring weights remain intact; server records retain original exercise IDs for compatibility.

The test has 27 question pages: section introductions appear on the first exercise page, and clothing questions are grouped four per page. The two Key word transformations exercises share one page, with their own instructions. Other exercises remain separate. Scoring is unchanged. Existing in-progress attempts are mapped to the corresponding question when loading the new layout.

Each of the 11 sections contains at most five multiple-choice questions. Existing written questions and section weights are retained. The mc5 question-bank version is used for new attempts; already-started older attempts remain supported with their original questions and scores.

Typed-answer exercises now contain at most two questions each, including modal transformations. The cooing-distraction passage uses dropdowns and is not treated as a typed-answer exercise. Section weights and the total of 100 remain unchanged. Earlier question-bank versions remain accepted for existing attempts.

The original page layout and normal scrolling are retained. On desktop, switching steps automatically centers the exercise and navigation when they fit, or aligns the beginning of a longer exercise near the top of the screen.
