create table public.midterm_teacher_access (id boolean primary key default true check(id), code_hash text not null);
alter table public.midterm_teacher_access enable row level security;
revoke all on public.midterm_teacher_access from anon,authenticated;
grant select on public.midterm_teacher_access to service_role;
-- Provision a SHA-256 hash of a securely generated edit code separately. Never commit the edit code.
