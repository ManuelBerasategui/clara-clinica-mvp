-- Mapa compartido: estado de visitas de establecimientos (sin datos de pacientes)
create table if not exists public.clinic_visits (
  facility_id text primary key,
  visited boolean not null default false,
  updated_at timestamptz not null default now()
);
alter table public.clinic_visits enable row level security;
grant select, insert, update on public.clinic_visits to anon, authenticated;
drop policy if exists "Public can read visit status" on public.clinic_visits;
create policy "Public can read visit status" on public.clinic_visits for select to anon, authenticated using (true);
drop policy if exists "Public can create visit status" on public.clinic_visits;
create policy "Public can create visit status" on public.clinic_visits for insert to anon, authenticated with check (true);
drop policy if exists "Public can update visit status" on public.clinic_visits;
create policy "Public can update visit status" on public.clinic_visits for update to anon, authenticated using (true) with check (true);

