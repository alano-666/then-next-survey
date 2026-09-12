-- Run this in Supabase SQL Editor once.
create table if not exists public.survey_records (
  id bigint generated always as identity primary key,
  record_type text not null check (record_type in ('session', 'event', 'response')),
  participant_id uuid not null,
  post_id text,
  scope text,
  payload jsonb not null,
  created_at timestamptz not null default now()
);
create index if not exists survey_records_participant_id_idx on public.survey_records(participant_id);
create index if not exists survey_records_created_at_idx on public.survey_records(created_at);

-- Public/anonymous clients cannot read or write records.
-- Only the Vercel server uses the service role key.
alter table public.survey_records enable row level security;
revoke all on public.survey_records from anon, authenticated;
revoke all on sequence public.survey_records_id_seq from anon, authenticated;
grant select, insert on public.survey_records to service_role;
grant usage, select on sequence public.survey_records_id_seq to service_role;
