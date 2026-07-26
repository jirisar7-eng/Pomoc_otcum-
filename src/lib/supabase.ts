/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';
import { Article, Comment, ForumPost, ExperienceStory, Donation, User, CoparentConnection } from '../types';

// Fetch credentials from Vite env or local storage overrides
export function getSupabaseUrl(): string {
  if (typeof window !== 'undefined') {
    const override = localStorage.getItem('synthesis_hub_supabase_url_override');
    if (override) return override;
  }
  return import.meta.env.VITE_SUPABASE_URL || 'https://brqqinbxpluzrkrvpfqs.supabase.co';
}

export function getSupabaseAnonKey(): string {
  if (typeof window !== 'undefined') {
    const override = localStorage.getItem('synthesis_hub_supabase_key_override');
    if (override) return override;
  }
  return import.meta.env.VITE_SUPABASE_ANON_KEY || '';
}

// Check if connection is active
export function isSupabaseConfigured(): boolean {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  return !!(url && key && key.trim().length > 15);
}

// Lazy load client
let supabaseInstance: any = null;

export function getSupabase() {
  if (!isSupabaseConfigured()) {
    return null;
  }
  try {
    if (!supabaseInstance) {
      supabaseInstance = createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        }
      });
    }
    return supabaseInstance;
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    return null;
  }
}

// Reset instance (useful when changing keys dynamically)
export function resetSupabaseInstance() {
  supabaseInstance = null;
}

// Service methods for each table
export const SupabaseService = {
  // 1. Articles
  async fetchArticles(): Promise<Article[] | null> {
    const supabase = getSupabase();
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching articles from Supabase:', error);
      return null;
    }
    return data as Article[];
  },

  async saveArticle(article: Article): Promise<boolean> {
    const supabase = getSupabase();
    if (!supabase) return false;
    const { error } = await supabase
      .from('articles')
      .upsert(article);
    if (error) console.error('Error saving article to Supabase:', error);
    return !error;
  },

  async deleteArticle(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (!supabase) return false;
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);
    return !error;
  },

  // 2. Forum Posts
  async fetchForumPosts(): Promise<ForumPost[] | null> {
    const supabase = getSupabase();
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('forum_posts')
      .select('*')
      .order('date', { ascending: false });
    if (error) {
      console.error('Error fetching posts from Supabase:', error);
      return null;
    }
    return data as ForumPost[];
  },

  async saveForumPost(post: ForumPost): Promise<boolean> {
    const supabase = getSupabase();
    if (!supabase) return false;
    const { error } = await supabase
      .from('forum_posts')
      .upsert(post);
    return !error;
  },

  async deleteForumPost(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (!supabase) return false;
    const { error } = await supabase
      .from('forum_posts')
      .delete()
      .eq('id', id);
    return !error;
  },

  // 3. Comments
  async fetchComments(): Promise<Comment[] | null> {
    const supabase = getSupabase();
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .order('date', { ascending: true });
    if (error) {
      console.error('Error fetching comments from Supabase:', error);
      return null;
    }
    return data as Comment[];
  },

  async saveComment(comment: Comment): Promise<boolean> {
    const supabase = getSupabase();
    if (!supabase) return false;
    const { error } = await supabase
      .from('comments')
      .upsert(comment);
    return !error;
  },

  async deleteComment(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (!supabase) return false;
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id);
    return !error;
  },

  // 4. Stories
  async fetchStories(): Promise<ExperienceStory[] | null> {
    const supabase = getSupabase();
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('experience_stories')
      .select('*')
      .order('date', { ascending: false });
    if (error) {
      console.error('Error fetching stories from Supabase:', error);
      return null;
    }
    return data as ExperienceStory[];
  },

  async saveStory(story: ExperienceStory): Promise<boolean> {
    const supabase = getSupabase();
    if (!supabase) return false;
    const { error } = await supabase
      .from('experience_stories')
      .upsert(story);
    return !error;
  },

  async deleteStory(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (!supabase) return false;
    const { error } = await supabase
      .from('experience_stories')
      .delete()
      .eq('id', id);
    return !error;
  },

  // 5. Donations
  async fetchDonations(): Promise<Donation[] | null> {
    const supabase = getSupabase();
    if (!supabase) return null;
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .order('date', { ascending: false });
    if (error) {
      console.error('Error fetching donations from Supabase:', error);
      return null;
    }
    return data as Donation[];
  },

  async saveDonation(donation: Donation): Promise<boolean> {
    const supabase = getSupabase();
    if (!supabase) return false;
    
    // Map property camelCase to snake_case for Supabase if needed or keep standard
    const payload = {
      id: donation.id,
      donor_name: donation.donorName,
      amount: donation.amount,
      message: donation.message || '',
      date: donation.date,
      is_public: donation.isPublic,
      is_verified: donation.isVerified
    };

    const { error } = await supabase
      .from('donations')
      .upsert(payload);
    return !error;
  },

  async deleteDonation(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (!supabase) return false;
    const { error } = await supabase
      .from('donations')
      .delete()
      .eq('id', id);
    return !error;
  },

  // Coparent Connections
  async fetchCoparentConnection(userId: string): Promise<CoparentConnection | null> {
    const supabase = getSupabase();
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('coparent_connections')
        .select('*')
        .or(`parent1Id.eq.${userId},parent2Id.eq.${userId}`)
        .limit(1);

      if (error || !data || data.length === 0) return null;
      return data[0] as CoparentConnection;
    } catch (e) {
      console.warn('Supabase fetchCoparentConnection error:', e);
      return null;
    }
  },

  async findCoparentConnectionByCode(inviteCode: string): Promise<CoparentConnection | null> {
    const supabase = getSupabase();
    if (!supabase) return null;
    try {
      const cleanInput = inviteCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
      const { data, error } = await supabase
        .from('coparent_connections')
        .select('*');

      if (error || !data || data.length === 0) return null;

      const found = data.find((conn: any) => {
        const storedClean = (conn.inviteCode || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
        return storedClean === cleanInput;
      });

      return found ? (found as CoparentConnection) : null;
    } catch (e) {
      console.warn('Supabase findCoparentConnectionByCode error:', e);
      return null;
    }
  },

  async saveCoparentConnection(conn: CoparentConnection): Promise<boolean> {
    const supabase = getSupabase();
    if (!supabase) return false;
    try {
      const { error } = await supabase
        .from('coparent_connections')
        .upsert(conn);
      if (error) console.warn('Supabase saveCoparentConnection error:', error);
      return !error;
    } catch (e) {
      console.warn('Supabase saveCoparentConnection exception:', e);
      return false;
    }
  },

  // One-click Migration Seeder
  async migrateData(
    articles: Article[],
    stories: ExperienceStory[],
    posts: ForumPost[],
    comments: Comment[],
    donations: Donation[],
    onProgress: (msg: string, percent: number) => void
  ): Promise<{ success: boolean; count: number; error?: string }> {
    const supabase = getSupabase();
    if (!supabase) {
      return { success: false, count: 0, error: 'Supabase client is not initialized.' };
    }

    try {
      let migratedCount = 0;

      // Migrate Articles
      onProgress('Migruji odborné články a aktuality...', 10);
      for (const art of articles) {
        const { error } = await supabase.from('articles').upsert(art);
        if (error) throw new Error(`Chyba při migraci článku ${art.title}: ${error.message}`);
        migratedCount++;
      }

      // Migrate Stories
      onProgress('Migruji osobní zkušenosti a příběhy...', 30);
      for (const story of stories) {
        const { error } = await supabase.from('experience_stories').upsert(story);
        if (error) throw new Error(`Chyba při migraci příběhu ${story.title}: ${error.message}`);
        migratedCount++;
      }

      // Migrate Posts
      onProgress('Migruji diskuzní témata na fóru...', 50);
      for (const post of posts) {
        const { error } = await supabase.from('forum_posts').upsert(post);
        if (error) throw new Error(`Chyba při migraci fóra ${post.title}: ${error.message}`);
        migratedCount++;
      }

      // Migrate Comments
      onProgress('Migruji komentáře...', 70);
      for (const comm of comments) {
        const { error } = await supabase.from('comments').upsert(comm);
        if (error) throw new Error(`Chyba při migraci komentáře: ${error.message}`);
        migratedCount++;
      }

      // Migrate Donations
      onProgress('Migruji záznamy o příspěvcích a darech...', 90);
      for (const donation of donations) {
        const payload = {
          id: donation.id,
          donor_name: donation.donorName,
          amount: donation.amount,
          message: donation.message || '',
          date: donation.date,
          is_public: donation.isPublic,
          is_verified: donation.isVerified
        };
        const { error } = await supabase.from('donations').upsert(payload);
        if (error) throw new Error(`Chyba při migraci daru od ${donation.donorName}: ${error.message}`);
        migratedCount++;
      }

      onProgress('Migrace dokončena úspěšně!', 100);
      return { success: true, count: migratedCount };
    } catch (e: any) {
      console.error('Migration failed:', e);
      return { success: false, count: 0, error: e.message || String(e) };
    }
  }
};
