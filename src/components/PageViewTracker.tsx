/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';

interface PageViewTrackerProps {
  activeTab: string;
}

export function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return 'server_side_visitor';
  
  try {
    let visitorId = localStorage.getItem('synthesis_visitor_id');
    if (!visitorId) {
      visitorId = `v_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('synthesis_visitor_id', visitorId);
    }
    return visitorId;
  } catch (e) {
    return `v_anon_${Math.random().toString(36).substring(2, 8)}`;
  }
}

export default function PageViewTracker({ activeTab }: PageViewTrackerProps) {
  const lastTrackedPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const path = activeTab ? (activeTab.startsWith('/') ? activeTab : `/${activeTab}`) : window.location.pathname || '/';

    // Prevent duplicate logs for the exact same path
    if (lastTrackedPathRef.current === path) return;
    lastTrackedPathRef.current = path;

    const visitorId = getOrCreateVisitorId();
    const userAgent = navigator.userAgent || 'Unknown';

    // Record locally in localStorage as client backup
    try {
      const localLog = JSON.parse(localStorage.getItem('synthesis_local_pageviews') || '[]');
      localLog.unshift({
        id: `pv_local_${Date.now()}`,
        path,
        visitor_id: visitorId,
        user_agent: userAgent,
        created_at: new Date().toISOString()
      });
      if (localLog.length > 200) localLog.length = 200;
      localStorage.setItem('synthesis_local_pageviews', JSON.stringify(localLog));
    } catch (e) {
      // ignore quota or storage errors
    }

    // Send payload to backend server API endpoint
    fetch('/api/page-views', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        path,
        visitor_id: visitorId,
        user_agent: userAgent
      })
    }).catch(err => {
      console.warn('[PageViewTracker] Could not record page view on server, stored locally:', err);
    });

  }, [activeTab]);

  return null; // Invisible tracker component
}
