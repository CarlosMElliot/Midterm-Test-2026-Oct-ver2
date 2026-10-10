create function public.midterm_validate_grades() returns trigger language plpgsql set search_path = '' as $$
declare item record; maximum numeric;
begin
 if jsonb_typeof(new.grades) <> 'object' then raise exception 'Grades must be a JSON object'; end if;
 for item in select key, value from jsonb_each(new.grades) loop
  select (q->>'max')::numeric into maximum from jsonb_array_elements(new.exam->'sections') s cross join lateral jsonb_array_elements(s->'questions') q where q->>'id'=item.key;
  if maximum is null or jsonb_typeof(item.value)<>'number' then raise exception 'Invalid question or grade'; end if;
  if (item.value::text)::numeric < 0 or (item.value::text)::numeric > maximum then raise exception 'Grade is outside question range'; end if;
 end loop;
 return new;
end $$;
revoke all on function public.midterm_validate_grades() from public,anon,authenticated;
create trigger midterm_check_grades before insert or update on public.midterm_submissions for each row execute function public.midterm_validate_grades();
