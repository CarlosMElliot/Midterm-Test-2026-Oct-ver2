create table public.midterm_submissions (
 id uuid primary key,
 name text not null check (char_length(name) between 2 and 100),
 answers jsonb not null,
 exam jsonb not null,
 grades jsonb not null default '{}'::jsonb,
 fingerprint text not null,
 client_started_at text,
 submitted_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 violations integer not null default 0 check (violations between 0 and 3)
);
alter table public.midterm_submissions enable row level security;
revoke all on public.midterm_submissions from anon, authenticated;
grant all on public.midterm_submissions to service_role;
create index midterm_submissions_submitted_idx on public.midterm_submissions (submitted_at desc, id);
create function public.midterm_touch_updated() returns trigger language plpgsql set search_path = '' as $$ begin new.updated_at = now(); return new; end $$;
revoke all on function public.midterm_touch_updated() from public, anon, authenticated;
create trigger midterm_touch before update on public.midterm_submissions for each row execute function public.midterm_touch_updated();
