-- Course Progress and Certificates - Advanced Schema
-- Requires: auth.users

-- 1) course_progress table
create table if not exists public.course_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id text not null,
  completed_lessons text[] not null default '{}',
  current_module int not null default 0,
  current_lesson int not null default 0,
  progress numeric(5,2) not null default 0.00,
  updated_at timestamptz not null default now(),
  primary key (user_id, course_id)
);

-- Helpful constraint: progress within 0..100
alter table public.course_progress
  add constraint course_progress_bounds check (progress >= 0 and progress <= 100);

-- 2) certificates table
create table if not exists public.certificates (
  certificate_id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id text not null,
  issued_at timestamptz not null default now(),
  revoked boolean not null default false,
  metadata jsonb not null default '{}'
);

-- Indexes
create index if not exists idx_course_progress_user on public.course_progress (user_id);
create index if not exists idx_course_progress_course on public.course_progress (course_id);
create index if not exists idx_certificates_user on public.certificates (user_id);
create index if not exists idx_certificates_course on public.certificates (course_id);
create index if not exists idx_certificates_issued_at on public.certificates (issued_at desc);

-- Row Level Security
alter table public.course_progress enable row level security;
alter table public.certificates enable row level security;

-- Policies: users can read and write only their own progress; read only their own certificates
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'course_progress' and policyname = 'Allow user CRUD own progress'
  ) then
    create policy "Allow user CRUD own progress" on public.course_progress
      for all
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'certificates' and policyname = 'Allow user read own certificates'
  ) then
    create policy "Allow user read own certificates" on public.certificates
      for select
      using (auth.uid() = user_id);
  end if;
end $$;

-- Service role upsert for certificates issuance can be handled by edge function; keeping client upsert permissive requires additional policy
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'certificates' and policyname = 'Allow user upsert own certificates'
  ) then
    create policy "Allow user upsert own certificates" on public.certificates
      for insert with check (auth.uid() = user_id)
      to authenticated;
  end if;
end $$;

-- View: certificate_public for verification (no user_id exposed)
create or replace view public.certificate_public as
  select certificate_id, course_id, issued_at, revoked
  from public.certificates;

grant select on public.certificate_public to anon, authenticated;

-- Function: revoke a certificate (admin/service role)
create or replace function public.revoke_certificate(p_cert text)
returns void language plpgsql security definer as $$
begin
  update public.certificates set revoked = true where certificate_id = p_cert;
end;
$$;


