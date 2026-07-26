-- =====================================================================
--                   SYNTHESIS OS - DATABASE SCHEMA
--            Core Database Layer for "Táta má právo" (Pomoc_otcum)
-- =====================================================================
-- Platform: Supabase (PostgreSQL 15+) & Firebase Firestore Dual Sync
-- Description: Core SQL structures, relations, indexes, and RLS policies
--              for profiles, administration content, articles, forum, 
--              stories, donations, partners, site_settings, and cases.
-- =====================================================================

-- Enable necessary PostgreSQL extensions
create extension if not exists "uuid-ossp";

-- =====================================================================
-- 1. PROFILES TABLE (Uživatelské profily & Admin role)
-- =====================================================================
create table if not exists public.profiles (
    id text primary key,
    email text not null,
    name text not null,
    role text not null default 'user' check (role in ('user', 'admin')),
    avatar text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

drop policy if exists "Allow public read access to profiles" on public.profiles;
create policy "Allow public read access to profiles" on public.profiles for select using (true);

drop policy if exists "Allow all writes to profiles" on public.profiles;
create policy "Allow all writes to profiles" on public.profiles for all using (true);


-- =====================================================================
-- 2. ARTICLES TABLE (Odborné články a aktuality)
-- =====================================================================
create table if not exists public.articles (
    id text primary key,
    title text not null,
    summary text not null,
    content text not null,
    category text not null,
    date text not null,
    author text not null,
    likes integer default 0 not null,
    "commentsCount" integer default 0 not null,
    "readTime" text not null,
    tags text[] default '{}'::text[] not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.articles enable row level security;

drop policy if exists "Allow public read articles" on public.articles;
create policy "Allow public read articles" on public.articles for select using (true);

drop policy if exists "Allow all writes articles" on public.articles;
create policy "Allow all writes articles" on public.articles for all using (true);


-- =====================================================================
-- 3. FORUM_POSTS TABLE (Komunitní diskuze a témata)
-- =====================================================================
create table if not exists public.forum_posts (
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

alter table public.forum_posts enable row level security;

drop policy if exists "Allow public read forum_posts" on public.forum_posts;
create policy "Allow public read forum_posts" on public.forum_posts for select using (true);

drop policy if exists "Allow all writes forum_posts" on public.forum_posts;
create policy "Allow all writes forum_posts" on public.forum_posts for all using (true);


-- =====================================================================
-- 4. COMMENTS TABLE (Komentáře k článkům a fórům)
-- =====================================================================
create table if not exists public.comments (
    id text primary key,
    "contentId" text not null,
    "contentType" text not null,
    "userId" text not null,
    "userName" text not null,
    "userAvatar" text,
    content text not null,
    date text not null,
    likes integer default 0 not null,
    reported boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.comments enable row level security;

drop policy if exists "Allow public read comments" on public.comments;
create policy "Allow public read comments" on public.comments for select using (true);

drop policy if exists "Allow all writes comments" on public.comments;
create policy "Allow all writes comments" on public.comments for all using (true);


-- =====================================================================
-- 5. EXPERIENCE_STORIES TABLE (Sdílené osobní příběhy)
-- =====================================================================
create table if not exists public.experience_stories (
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

alter table public.experience_stories enable row level security;

drop policy if exists "Allow public read stories" on public.experience_stories;
create policy "Allow public read stories" on public.experience_stories for select using (true);

drop policy if exists "Allow all writes stories" on public.experience_stories;
create policy "Allow all writes stories" on public.experience_stories for all using (true);


-- =====================================================================
-- 6. DONATIONS TABLE (Finanční darovací záznamy)
-- =====================================================================
create table if not exists public.donations (
    id text primary key,
    donor_name text not null,
    amount numeric not null,
    message text,
    date text not null,
    is_public boolean default true not null,
    is_verified boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.donations enable row level security;

drop policy if exists "Allow public read donations" on public.donations;
create policy "Allow public read donations" on public.donations for select using (true);

drop policy if exists "Allow all writes donations" on public.donations;
create policy "Allow all writes donations" on public.donations for all using (true);


-- =====================================================================
-- 7. PARTNERS TABLE (Partneři a spolupracující organizace)
-- =====================================================================
create table if not exists public.partners (
    id text primary key,
    name text not null,
    logo text,
    description text,
    website text,
    category text,
    is_verified boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.partners enable row level security;

drop policy if exists "Allow public read partners" on public.partners;
create policy "Allow public read partners" on public.partners for select using (true);

drop policy if exists "Allow all writes partners" on public.partners;
create policy "Allow all writes partners" on public.partners for all using (true);


-- =====================================================================
-- 8. SITE_SETTINGS TABLE (Administrační nastavení a konfigurace)
-- =====================================================================
create table if not exists public.site_settings (
    id text primary key,
    data jsonb not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.site_settings enable row level security;

drop policy if exists "Allow public read site_settings" on public.site_settings;
create policy "Allow public read site_settings" on public.site_settings for select using (true);

drop policy if exists "Allow all writes site_settings" on public.site_settings;
create policy "Allow all writes site_settings" on public.site_settings for all using (true);


-- =====================================================================
-- 9. CASES TABLE (Právní a opatrovnické spisy)
-- =====================================================================
create table if not exists public.cases (
    id text primary key,
    user_id text not null,
    child_name text not null,
    status text default 'Aktivní' not null,
    court_name text,
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.cases enable row level security;

drop policy if exists "Allow public read cases" on public.cases;
create policy "Allow public read cases" on public.cases for select using (true);

drop policy if exists "Allow all writes cases" on public.cases;
create policy "Allow all writes cases" on public.cases for all using (true);


-- =====================================================================
-- 10. DOCUMENTS & EVENTS TABLES (Důkazy & Milníky)
-- =====================================================================
create table if not exists public.documents (
    id text primary key,
    case_id text,
    user_id text not null,
    name text not null,
    type text not null,
    notes text,
    date text not null,
    tags text[] default '{}'::text[],
    file_size text,
    url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.documents enable row level security;
drop policy if exists "Allow all access to documents" on public.documents;
create policy "Allow all access to documents" on public.documents for all using (true);

create table if not exists public.events (
    id text primary key,
    case_id text not null,
    user_id text not null,
    type text not null,
    title text not null,
    date text not null,
    notes text,
    deadline_date text,
    deadline_completed boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.events enable row level security;
drop policy if exists "Allow all access to events" on public.events;
create policy "Allow all access to events" on public.events for all using (true);

-- Indexing for maximum performance
create index if not exists idx_articles_date on public.articles(date);
create index if not exists idx_forum_posts_date on public.forum_posts(date);
create index if not exists idx_comments_content on public.comments("contentId");

-- =====================================================================
-- 11. COPARENT_CONNECTIONS TABLE (Rodičovské prostory & Párování klíčů)
-- =====================================================================
create table if not exists public.coparent_connections (
    id text primary key,
    "inviteCode" text not null,
    "parent1Id" text not null,
    "parent1Name" text not null,
    "parent2Id" text,
    "parent2Name" text,
    children text[] default '{}'::text[],
    created_at text,
    updated_at text
);

alter table public.coparent_connections enable row level security;

drop policy if exists "Allow all access to coparent_connections" on public.coparent_connections;
create policy "Allow all access to coparent_connections" on public.coparent_connections for all using (true);
