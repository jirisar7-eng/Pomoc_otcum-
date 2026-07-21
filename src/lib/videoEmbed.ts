/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { VideoSource } from '../types';

/**
 * Parses a given video sharing URL and returns structured VideoSource metadata.
 * Centralizes regex parsing for YouTube, Facebook, Vimeo, TikTok, and Instagram.
 */
export function parseVideoUrl(
  url: string,
  title: string = 'Video',
  author: string = 'Neznámý autor',
  tags: string[] = []
): VideoSource {
  const trimmedUrl = url.trim();
  let platform: VideoSource['platform'] = 'unknown';
  let embedUrl = '';
  let id = '';

  try {
    // 1. YouTube Parser
    // Matches:
    // - https://www.youtube.com/watch?v=VIDEO_ID
    // - https://youtu.be/VIDEO_ID
    // - https://www.youtube.com/embed/VIDEO_ID
    // - https://www.youtube.com/shorts/VIDEO_ID
    // - https://m.youtube.com/watch?v=VIDEO_ID
    if (/youtube\.com|youtu\.be/i.test(trimmedUrl)) {
      platform = 'youtube';
      let videoId = '';

      if (trimmedUrl.includes('youtu.be/')) {
        // Short URL format
        const parts = trimmedUrl.split('youtu.be/');
        if (parts[1]) {
          videoId = parts[1].split(/[?#]/)[0];
        }
      } else if (trimmedUrl.includes('/shorts/')) {
        // Shorts format
        const parts = trimmedUrl.split('/shorts/');
        if (parts[1]) {
          videoId = parts[1].split(/[?#]/)[0];
        }
      } else if (trimmedUrl.includes('/embed/')) {
        // Embed format
        const parts = trimmedUrl.split('/embed/');
        if (parts[1]) {
          videoId = parts[1].split(/[?#]/)[0];
        }
      } else {
        // Standard watch URL or mobile watch URL
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = trimmedUrl.match(regExp);
        if (match && match[2] && match[2].length === 11) {
          videoId = match[2];
        } else {
          // Fallback parsing query parameter
          const urlObj = new URL(trimmedUrl);
          videoId = urlObj.searchParams.get('v') || '';
        }
      }

      if (videoId) {
        id = videoId;
        embedUrl = `https://www.youtube.com/embed/${videoId}`;
      } else {
        embedUrl = trimmedUrl; // Fallback
      }
    }

    // 2. Vimeo Parser
    // Matches:
    // - https://vimeo.com/123456
    // - https://vimeo.com/channels/staffpicks/123456
    // - https://player.vimeo.com/video/123456
    else if (/vimeo\.com/i.test(trimmedUrl)) {
      platform = 'vimeo';
      const regExp = /vimeo\.com\/(?:video\/|channels\/(?:\w+\/)+|groups\/(?:\w+\/)+|album\/\d+\/video\/|)?(\d+)/i;
      const match = trimmedUrl.match(regExp);
      
      if (match && match[1]) {
        id = match[1];
        embedUrl = `https://player.vimeo.com/video/${id}`;
      } else {
        const parts = trimmedUrl.split('/');
        const lastPart = parts[parts.length - 1]?.split(/[?#]/)[0];
        if (lastPart && /^\d+$/.test(lastPart)) {
          id = lastPart;
          embedUrl = `https://player.vimeo.com/video/${id}`;
        } else {
          embedUrl = trimmedUrl;
        }
      }
    }

    // 3. Facebook Video Parser
    // Matches:
    // - https://www.facebook.com/watch/?v=123456
    // - https://www.facebook.com/username/videos/123456
    // - https://fb.watch/abcd/
    else if (/facebook\.com|fb\.watch/i.test(trimmedUrl)) {
      platform = 'facebook';
      // Facebook videos can be embedded using the official Facebook Embedded Video Player plugin URL
      embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(trimmedUrl)}&show_text=0&autoplay=0`;
      
      // Try to parse out a potential numerical ID for local tracking
      const videoIdMatch = trimmedUrl.match(/videos\/(\d+)/i) || trimmedUrl.match(/v=(\d+)/i);
      if (videoIdMatch && videoIdMatch[1]) {
        id = videoIdMatch[1];
      } else {
        // Generate a pseudo-ID based on hash
        id = 'fb-' + Math.abs(hashCode(trimmedUrl));
      }
    }

    // 4. TikTok Parser
    // Matches:
    // - https://www.tiktok.com/@user/video/123456
    // - https://m.tiktok.com/v/123456.html
    else if (/tiktok\.com/i.test(trimmedUrl)) {
      platform = 'tiktok';
      const regExp = /tiktok\.com\/@[^\/]+\/video\/(\d+)/i;
      const match = trimmedUrl.match(regExp);
      
      if (match && match[1]) {
        id = match[1];
        embedUrl = `https://www.tiktok.com/embed/v2/${id}`;
      } else {
        // Handle short v/ID patterns if any
        const altMatch = trimmedUrl.match(/tiktok\.com\/v\/(\d+)/i);
        if (altMatch && altMatch[1]) {
          id = altMatch[1];
          embedUrl = `https://www.tiktok.com/embed/v2/${id}`;
        } else {
          embedUrl = trimmedUrl;
          id = 'tt-' + Math.abs(hashCode(trimmedUrl));
        }
      }
    }

    // 5. Instagram Parser
    // Matches:
    // - https://www.instagram.com/p/CODE/
    // - https://www.instagram.com/reel/CODE/
    // - https://www.instagram.com/tv/CODE/
    else if (/instagram\.com/i.test(trimmedUrl)) {
      platform = 'instagram';
      const regExp = /instagram\.com\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/i;
      const match = trimmedUrl.match(regExp);
      
      if (match && match[1]) {
        id = match[1];
        // Clean trailing slash if present in code
        const code = match[1].replace(/\/$/, '');
        embedUrl = `https://www.instagram.com/p/${code}/embed/`;
      } else {
        embedUrl = trimmedUrl;
        id = 'ig-' + Math.abs(hashCode(trimmedUrl));
      }
    }

    // 6. X (Twitter) Parser
    // Matches:
    // - https://x.com/username/status/123456789
    // - https://twitter.com/username/status/123456789
    else if (/x\.com|twitter\.com/i.test(trimmedUrl)) {
      platform = 'x';
      const match = trimmedUrl.match(/status\/(\d+)/i);
      if (match && match[1]) {
        id = match[1];
        embedUrl = `https://platform.twitter.com/embed/Tweet.html?id=${id}`;
      } else {
        embedUrl = trimmedUrl;
        id = 'x-' + Math.abs(hashCode(trimmedUrl));
      }
    }
  } catch (error) {
    console.error('Error parsing video URL:', error);
  }

  // If we couldn't match a platform or determine an embed URL
  if (!embedUrl) {
    embedUrl = trimmedUrl;
    id = 'vid-' + Math.abs(hashCode(trimmedUrl));
  }

  return {
    id,
    url: trimmedUrl,
    title,
    author,
    platform,
    embedUrl,
    tags,
    savedAt: new Date().toISOString()
  };
}

/**
 * Simple hash code function to generate fallback unique IDs
 */
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}
