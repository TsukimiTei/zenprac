-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
create table public.profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  display_name text,
  total_sessions integer default 0,
  total_score integer default 0,
  current_stage text default 'mountain_gate',
  is_onboarded boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Sessions table
create table public.sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  master_type text not null check (master_type in ('shakyamuni', 'manjushri', 'huineng')),
  mode text not null check (mode in ('master_question', 'free', 'daily')),
  is_completed boolean default false,
  final_level text check (final_level in ('N', 'R', 'SR', 'SSR')),
  final_score numeric(4,1),
  daily_question_id uuid,
  created_at timestamptz default now(),
  completed_at timestamptz
);

-- Session messages table
create table public.session_messages (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid references public.sessions(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  hidden_eval jsonb,
  round_number integer,
  created_at timestamptz default now()
);

-- Zen cards table
create table public.zen_cards (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid references public.sessions(id) on delete cascade not null unique,
  user_id uuid references auth.users(id) on delete cascade not null,
  master_type text not null,
  core_question text not null,
  core_answer text not null,
  master_comment text not null,
  enlightenment_level text not null check (enlightenment_level in ('N', 'R', 'SR', 'SSR')),
  score numeric(4,1) default 0,
  created_at timestamptz default now()
);

-- Daily questions table
create table public.daily_questions (
  id uuid primary key default uuid_generate_v4(),
  day_number integer not null unique check (day_number between 1 and 365),
  master_type text not null check (master_type in ('shakyamuni', 'manjushri', 'huineng')),
  question_text text not null,
  category text not null check (category in ('koan', 'huatou', 'life')),
  difficulty text not null check (difficulty in ('R', 'SR', 'SSR')),
  theme text not null
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.sessions enable row level security;
alter table public.session_messages enable row level security;
alter table public.zen_cards enable row level security;
alter table public.daily_questions enable row level security;

-- Profiles policies
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = user_id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = user_id);
create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = user_id);

-- Sessions policies
create policy "Users can view own sessions" on public.sessions
  for select using (auth.uid() = user_id);
create policy "Users can insert own sessions" on public.sessions
  for insert with check (auth.uid() = user_id);
create policy "Users can update own sessions" on public.sessions
  for update using (auth.uid() = user_id);

-- Session messages policies
create policy "Users can view own session messages" on public.session_messages
  for select using (
    session_id in (select id from public.sessions where user_id = auth.uid())
  );
create policy "Users can insert own session messages" on public.session_messages
  for insert with check (
    session_id in (select id from public.sessions where user_id = auth.uid())
  );

-- Zen cards policies
create policy "Users can view own zen cards" on public.zen_cards
  for select using (auth.uid() = user_id);
create policy "Users can insert own zen cards" on public.zen_cards
  for insert with check (auth.uid() = user_id);

-- Daily questions are readable by all authenticated users
create policy "Authenticated users can view daily questions" on public.daily_questions
  for select using (auth.role() = 'authenticated');

-- Function to auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for auto-creating profile
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to get today's session count for a user
create or replace function public.get_daily_session_count(p_user_id uuid)
returns integer as $$
begin
  return (
    select count(*)::integer
    from public.sessions
    where user_id = p_user_id
    and created_at::date = current_date
  );
end;
$$ language plpgsql security definer;

-- Indexes
create index idx_sessions_user_id on public.sessions(user_id);
create index idx_sessions_created_at on public.sessions(created_at);
create index idx_session_messages_session_id on public.session_messages(session_id);
create index idx_zen_cards_user_id on public.zen_cards(user_id);
create index idx_zen_cards_created_at on public.zen_cards(created_at);
create index idx_daily_questions_day on public.daily_questions(day_number);
