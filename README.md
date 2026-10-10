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
4. **Saved online** and a receipt confirm database storage. If sending fails, the student can retry or download their saved response.
5. GitHub Actions copies complete public reports into `site/results.json`, updates `RESULTS.md`, and deploys Pages. The workflow runs every five minutes, but GitHub can delay scheduled runs. Supabase receipt confirmation does not mean the GitHub copy has finished yet.

## Every response is included

The public teacher view shows the student's name, total /100, timestamps, every section and every question. Choice questions show all options, the selected choice, expected answer, points and Correct/Incorrect status. Omitted questions appear as **Unanswered**, worth zero. Written responses appear in full. Non-empty written responses receive completion credit, pending teacher review; final teacher grades replace that credit. The total remains 100 weighted points.

Anyone can view student responses without a password. The page loads current Supabase reports, falling back to the repository copy if unavailable. Older records already in the repository are retained; detailed answers stored only in the previous backend are not automatically migrated.

## Teacher grading

Viewing responses requires no sign-in. Changing grades requires owner access to Supabase. In the Supabase Table Editor, open `midterm_submissions`, find the student's row and edit its `grades` JSON object: map question IDs to raw earned points, such as `{"1-1": 1}`. Use each question's displayed raw maximum. Refresh the public view to see recalculated scores; the next sync updates GitHub. Remove a grade entry to restore automatic scoring/completion credit.

`teacher.html` remains an optional local JSON import/review workspace; edits made there do not update Supabase. No database password or secret API key is stored in this repository. The frontend's publishable application key is intentionally public. RLS is enabled and direct anonymous/authenticated table access is revoked; only the server function writes submissions. Names do not verify student identity. Public results and question keys are visible to students.

## Test behavior

24 sections, 100 points, seven audio recordings, clothing reference images, compact dropdowns, section instructions, progress indicator and top/bottom Continue buttons. Each recording appears once per exercise. Three focus warnings end the local attempt on the third departure; monitoring is best effort. Submit a new response starts a separate attempt. JSON and text report downloads remain available; email sending is not configured in this edition.

## Deployment and source

GitHub Settings → Pages → GitHub Actions. `npm test` and `npm run build` validate and build `_site/`. All audio, images and styles live in this repository. Node 22+, no package dependencies.

- `site/backend-config.js`: public project endpoint and publishable key.
- `supabase/schema.sql`: deployed table, index, RLS and timestamp trigger.
- `supabase/functions/midterm-api/`: deployed Edge Function and server-side exam/grading snapshot.
- `.github/workflows/sync-results.yml`: database-to-repository report sync.

The Edge Function authenticates the public application key itself (`verify_jwt=false`) and uses Supabase's server-only environment credentials for database access. Deploy its complete folder when changing server scoring or the question bank. Keep `site/exam.json` and the function's exam snapshot/version synchronized. Run security advisors after schema changes; the intentional RLS-with-no-policies notice reflects the service-only table design.
