-- Keep a readable copy of each person's email in their profile, and store the phone
-- number typed at registration. The real login email stays in Authentication > Users;
-- this copy is only for convenience (it is kept in sync and users cannot edit it).

alter table public.profiles add column if not exists email text;

-- Fill the email for people who registered before this update
update public.profiles p
set email = u.email
from auth.users u
where u.id = p.id and p.email is null;

-- New sign-ups: save name, phone and email together
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone, email, wants_contributor)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    nullif(left(trim(coalesce(new.raw_user_meta_data ->> 'phone', '')), 30), ''),
    new.email,
    coalesce(new.raw_user_meta_data ->> 'wants_contributor', '') = 'true'
  );
  return new;
end;
$$;

-- If someone's login email changes, update the copy
create or replace function public.sync_profile_email()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles set email = new.email where id = new.id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_email_changed on auth.users;
create trigger on_auth_user_email_changed
  after update of email on auth.users
  for each row
  when (old.email is distinct from new.email)
  execute function public.sync_profile_email();
