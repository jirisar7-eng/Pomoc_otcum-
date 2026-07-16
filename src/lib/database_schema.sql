-- =====================================================================
--                   SYNTHESIS OS - DATABASE SCHEMA
--            Core Database Layer for "Táta má právo" (Synthesis Hub)
-- =====================================================================
-- Version: 1.0.0
-- Platform: Supabase (PostgreSQL 15+)
-- Author: Synthesis OS Chief Architect & Developer
-- Description: Core SQL structures, relations, indexes, and RLS policies
--              for profiles, cases, documents, and timeline events.
-- =====================================================================

-- Enable necessary PostgreSQL extensions
create extension if not exists "uuid-ossp";

-- =====================================================================
-- 1. PROFILES TABLE (Uživatelské profily)
-- =====================================================================
-- Linked directly to Supabase Auth schema via UUID.
-- Stores non-sensitive user metadata and roles for RBAC.

create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    email text not null unique,
    name text not null,
    role text not null default 'user' check (role in ('user', 'admin')),
    avatar text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Profiles Policies
create policy "Allow public read access to profiles" 
    on public.profiles for select 
    using (true); -- Required so users can see forum authors/commenters names

create policy "Allow users to update their own profile" 
    on public.profiles for update 
    using (auth.uid() = id);

create policy "Allow admins full control on profiles" 
    on public.profiles for all 
    using (
        exists (
            select 1 from public.profiles 
            where id = auth.uid() and role = 'admin'
        )
    );

-- =====================================================================
-- 2. CASES TABLE (Právní a opatrovnické případy)
-- =====================================================================
-- Stores core case parameters. A user can manage multiple cases (e.g. for different children).

create table public.cases (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    child_name text not null,
    status text not null default 'Aktivní',
    court_name text,
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes for performance
create index idx_cases_user_id on public.cases(user_id);

-- Enable Row Level Security
alter table public.cases enable row level security;

-- Cases Policies
create policy "Users can view their own cases" 
    on public.cases for select 
    using (auth.uid() = user_id);

create policy "Users can insert their own cases" 
    on public.cases for insert 
    with check (auth.uid() = user_id);

create policy "Users can update their own cases" 
    on public.cases for update 
    using (auth.uid() = user_id);

create policy "Users can delete their own cases" 
    on public.cases for delete 
    using (auth.uid() = user_id);

-- =====================================================================
-- 3. DOCUMENTS TABLE (Uživatelské důkazy a dokumenty)
-- =====================================================================
-- Represents EvidenceFile metadata. Associated with a specific case.
-- Supports storage URLs, metadata, and categorization tags.

create table public.documents (
    id uuid default gen_random_uuid() primary key,
    case_id uuid references public.cases(id) on delete cascade,
    user_id uuid references public.profiles(id) on delete cascade not null,
    name text not null,
    type text not null check (type in ('pdf', 'photo', 'audio', 'video', 'screenshot', 'email', 'other')),
    notes text,
    date timestamp with time zone default timezone('utc'::text, now()) not null,
    tags text[] default '{}'::text[] not null,
    file_size text,
    url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes for performance
create index idx_documents_case_id on public.documents(case_id);
create index idx_documents_user_id on public.documents(user_id);

-- Enable Row Level Security
alter table public.documents enable row level security;

-- Documents Policies
create policy "Users can view their own documents" 
    on public.documents for select 
    using (auth.uid() = user_id);

create policy "Users can insert their own documents" 
    on public.documents for insert 
    with check (auth.uid() = user_id);

create policy "Users can update their own documents" 
    on public.documents for update 
    using (auth.uid() = user_id);

create policy "Users can delete their own documents" 
    on public.documents for delete 
    using (auth.uid() = user_id);

-- =====================================================================
-- 4. EVENTS TABLE (Milníky časové osy případu)
-- =====================================================================
-- Represents TimelineNode milestones or calendar items for a specific case.
-- Supports tracking due-dates/deadlines and associated documents/evidence.

create table public.events (
    id uuid default gen_random_uuid() primary key,
    case_id uuid references public.cases(id) on delete cascade not null,
    user_id uuid references public.profiles(id) on delete cascade not null,
    type text not null check (type in ('proposal', 'mother_response', 'ospod', 'court_hearing', 'judgment', 'appeal', 'other')),
    title text not null,
    date timestamp with time zone not null,
    notes text,
    deadline_date timestamp with time zone,
    deadline_completed boolean default false not null,
    evidence_ids uuid[] default '{}'::uuid[] not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes for performance
create index idx_events_case_id on public.events(case_id);
create index idx_events_user_id on public.events(user_id);
create index idx_events_date on public.events(date);

-- Enable Row Level Security
alter table public.events enable row level security;

-- Events Policies
create policy "Users can view their own events" 
    on public.events for select 
    using (auth.uid() = user_id);

create policy "Users can insert their own events" 
    on public.events for insert 
    with check (auth.uid() = user_id);

create policy "Users can update their own events" 
    on public.events for update 
    using (auth.uid() = user_id);

create policy "Users can delete their own events" 
    on public.events for delete 
    using (auth.uid() = user_id);

-- =====================================================================
-- 5. AUTOMATED USER TRIGGER (Automatické vytváření profilu)
-- =====================================================================
-- This function automatically triggers on Supabase Auth signup to sync 
-- auth.users metadata into public.profiles seamlessly.

create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, email, name, avatar, role)
    values (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
        new.raw_user_meta_data->>'avatar_url',
        'user'
    );
    return new;
end;
$$ language plpgsql security definer;

-- Bind trigger to auth.users table
create or replace trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- =====================================================================
-- 6. AUTOMATIC UPDATE TIMESTAMP HELPER
-- =====================================================================
-- Ensures that updated_at timestamp updates whenever a row is modified.

create or replace function public.set_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger trigger_update_profiles_timestamp before update on public.profiles
    for each row execute procedure public.set_updated_at();

create trigger trigger_update_cases_timestamp before update on public.cases
    for each row execute procedure public.set_updated_at();

create trigger trigger_update_documents_timestamp before update on public.documents
    for each row execute procedure public.set_updated_at();

create trigger trigger_update_events_timestamp before update on public.events
    for each row execute procedure public.set_updated_at();


-- =====================================================================
-- 7. REFERENCE SCHEMAS FOR PUBLIC CORE CONTENT
-- =====================================================================
-- Additional tables defined in SupabaseService (src/lib/supabase.ts)
-- for the public portal modules.
/*

-- Articles and News (Odborné články)
create table public.articles (
    id text primary key,
    title text not null,
    summary text not null,
    content text not null,
    category text not null check (category in ('Zákony', 'Soudy', 'Psychologie', 'Aktuality')),
    date text not null,
    author text not null,
    likes integer default 0 not null,
    "commentsCount" integer default 0 not null,
    "readTime" text not null,
    tags text[] default '{}'::text[] not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Discussion Forum Posts (Diskuze)
create table public.forum_posts (
    id text primary key,
    "categoryId" text not null,
    title text not null,
    content text not null,
    "userId" text not null,
    "userName" text not null,
    "userAvatar" text,
    date text not null,
    likes integer default 0 not null,
    "commentsCount" integer default 0 not null,
    tags text[] default '{}'::text[] not null,
    reported boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Comments on Articles & Forum Posts (Komentáře)
create table public.comments (
    id text primary key,
    "contentId" text not null,
    "contentType" text not null check ("contentType" in ('article', 'forum', 'advice')),
    "userId" text not null,
    "userName" text not null,
    "userAvatar" text,
    content text not null,
    date text not null,
    likes integer default 0 not null,
    reported boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Experience Stories (Sdílené příběhy)
create table public.experience_stories (
    id text primary key,
    title text not null,
    content text not null,
    "authorName" text not null,
    date text not null,
    likes integer default 0 not null,
    approved boolean default false not null,
    reported boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Donations (Finanční podpora projektu)
create table public.donations (
    id text primary key,
    donor_name text not null,
    amount numeric not null check (amount > 0),
    message text,
    date text not null,
    is_public boolean default true not null,
    is_verified boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on reference tables
alter table public.articles enable row level security;
alter table public.forum_posts enable row level security;
alter table public.comments enable row level security;
alter table public.experience_stories enable row level security;
alter table public.donations enable row level security;

-- Public read policies
create policy "Allow read access to public articles" on public.articles for select using (true);
create policy "Allow read access to public forum posts" on public.forum_posts for select using (reported = false);
create policy "Allow read access to comments" on public.comments for select using (reported = false);
create policy "Allow read access to approved stories" on public.experience_stories for select using (approved = true and reported = false);
create policy "Allow read access to public donations" on public.donations for select using (is_public = true);

-- Authenticated write policies
create policy "Allow auth users to post in forum" on public.forum_posts for insert with check (auth.role() = 'authenticated');
create policy "Allow auth users to post comments" on public.comments for insert with check (auth.role() = 'authenticated');
create policy "Allow anyone to submit a story" on public.experience_stories for insert with check (true);

*/
