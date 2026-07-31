import fs from 'fs';
import path from 'path';

export interface PageViewRecord {
  id: string;
  path: string;
  visitor_id: string;
  user_agent: string;
  ip_address?: string;
  created_at: string;
}

export interface PageViewsStats {
  totalViews: number;
  uniqueVisitors: number;
  views24h: number;
  views7d: number;
  topPages: { path: string; views: number; uniqueVisitors: number; pct: number }[];
  hourlyStats: { timeLabel: string; views: number }[];
  deviceBreakdown: { desktop: number; mobile: number; tablet: number; other: number };
  recentViews: PageViewRecord[];
}

const PAGE_VIEWS_FILE = path.join(process.cwd(), 'data', 'page_views.json');
let inMemoryPageViews: PageViewRecord[] = [];

// Initialize seed data if file doesn't exist
function initPageViewsFile() {
  const dataDir = path.dirname(PAGE_VIEWS_FILE);
  if (!fs.existsSync(dataDir)) {
    try {
      fs.mkdirSync(dataDir, { recursive: true });
    } catch (e) {
      console.error('[PageViews] Failed to create data directory:', e);
    }
  }

  if (fs.existsSync(PAGE_VIEWS_FILE)) {
    try {
      const content = fs.readFileSync(PAGE_VIEWS_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inMemoryPageViews = parsed;
        console.log(`[PageViews] Loaded ${inMemoryPageViews.length} page views from storage.`);
        return;
      }
    } catch (e) {
      console.error('[PageViews] Error reading page_views.json:', e);
    }
  }

  // Seed with realistic demo initial entries if empty
  const now = Date.now();
  const samplePaths = [
    '/home', 
    '/judikatura', 
    '/ke-stazeni', 
    '/ai-guide', 
    '/opatrovnicka-agenda', 
    '/videoteka', 
    '/forum', 
    '/cesta-zakladatele', 
    '/knihovna-studii', 
    '/plan-pece'
  ];
  const sampleVisitors = Array.from({ length: 48 }, (_, i) => `visitor_${1000 + i}_${Math.random().toString(36).substring(2, 6)}`);
  const initialEntries: PageViewRecord[] = [];

  for (let i = 0; i < 340; i++) {
    const randomHoursAgo = Math.random() * 168; // 7 days
    const timestamp = new Date(now - randomHoursAgo * 3600 * 1000).toISOString();
    const p = samplePaths[Math.floor(Math.random() * samplePaths.length)];
    const v = sampleVisitors[Math.floor(Math.random() * sampleVisitors.length)];
    const isMobile = Math.random() > 0.4;
    
    initialEntries.push({
      id: `pv-${Math.random().toString(36).substring(2, 10)}`,
      path: p,
      visitor_id: v,
      user_agent: isMobile 
        ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1'
        : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36',
      ip_address: `194.228.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}`,
      created_at: timestamp
    });
  }

  initialEntries.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  inMemoryPageViews = initialEntries;
  
  try {
    fs.writeFileSync(PAGE_VIEWS_FILE, JSON.stringify(inMemoryPageViews, null, 2), 'utf-8');
    console.log(`[PageViews] Initialized page_views.json with ${inMemoryPageViews.length} seed records.`);
  } catch (e) {
    console.error('[PageViews] Failed to write initial page_views.json:', e);
  }
}

initPageViewsFile();

export function recordPageView(record: { path: string; visitor_id: string; user_agent?: string; ip_address?: string }): PageViewRecord {
  const newEntry: PageViewRecord = {
    id: `pv-${Math.random().toString(36).substring(2, 11)}`,
    path: record.path || '/',
    visitor_id: record.visitor_id || `visitor_${Math.random().toString(36).substring(2, 8)}`,
    user_agent: record.user_agent || 'Unknown Browser',
    ip_address: record.ip_address || '127.0.0.1',
    created_at: new Date().toISOString()
  };

  inMemoryPageViews.unshift(newEntry);
  if (inMemoryPageViews.length > 5000) {
    inMemoryPageViews.length = 5000;
  }

  try {
    fs.writeFileSync(PAGE_VIEWS_FILE, JSON.stringify(inMemoryPageViews, null, 2), 'utf-8');
  } catch (err) {
    console.error('[PageViews] Failed to save page_views.json:', err);
  }

  return newEntry;
}

export function getPageViewsStats(): PageViewsStats {
  const totalViews = inMemoryPageViews.length;
  const uniqueVisitorSet = new Set(inMemoryPageViews.map(v => v.visitor_id));
  const uniqueVisitors = uniqueVisitorSet.size;

  const now = Date.now();
  const cutoff24h = now - 24 * 3600 * 1000;
  const cutoff7d = now - 7 * 24 * 3600 * 1000;

  let views24h = 0;
  let views7d = 0;

  const pathCounts: Record<string, { views: number; visitors: Set<string> }> = {};
  const deviceBreakdown = { desktop: 0, mobile: 0, tablet: 0, other: 0 };

  // Hourly stats for last 24h (24 buckets)
  const hourlyBuckets: Record<string, number> = {};
  for (let i = 23; i >= 0; i--) {
    const d = new Date(now - i * 3600 * 1000);
    const label = `${d.getHours().toString().padStart(2, '0')}:00`;
    hourlyBuckets[label] = 0;
  }

  inMemoryPageViews.forEach(v => {
    const t = new Date(v.created_at).getTime();
    if (t >= cutoff24h) {
      views24h++;
      const d = new Date(t);
      const label = `${d.getHours().toString().padStart(2, '0')}:00`;
      if (hourlyBuckets[label] !== undefined) {
        hourlyBuckets[label]++;
      }
    }
    if (t >= cutoff7d) {
      views7d++;
    }

    if (!pathCounts[v.path]) {
      pathCounts[v.path] = { views: 0, visitors: new Set() };
    }
    pathCounts[v.path].views++;
    pathCounts[v.path].visitors.add(v.visitor_id);

    const ua = (v.user_agent || '').toLowerCase();
    if (ua.includes('ipad') || ua.includes('tablet')) {
      deviceBreakdown.tablet++;
    } else if (ua.includes('mobile') || ua.includes('iphone') || ua.includes('android')) {
      deviceBreakdown.mobile++;
    } else if (ua.includes('mozilla') || ua.includes('chrome') || ua.includes('safari') || ua.includes('windows') || ua.includes('macintosh')) {
      deviceBreakdown.desktop++;
    } else {
      deviceBreakdown.other++;
    }
  });

  const topPages = Object.entries(pathCounts)
    .map(([pathStr, data]) => ({
      path: pathStr,
      views: data.views,
      uniqueVisitors: data.visitors.size,
      pct: totalViews > 0 ? Math.round((data.views / totalViews) * 100) : 0
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 12);

  const hourlyStats = Object.entries(hourlyBuckets).map(([timeLabel, views]) => ({
    timeLabel,
    views
  }));

  return {
    totalViews,
    uniqueVisitors,
    views24h,
    views7d,
    topPages,
    hourlyStats,
    deviceBreakdown,
    recentViews: inMemoryPageViews.slice(0, 50)
  };
}

export default {
  recordPageView,
  getPageViewsStats
};
