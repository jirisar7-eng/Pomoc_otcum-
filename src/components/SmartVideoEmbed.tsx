/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  ExternalLink, 
  Youtube, 
  Video, 
  User, 
  Tag, 
  AlertCircle, 
  Loader2, 
  Bookmark, 
  BookmarkCheck,
  Share2
} from 'lucide-react';
import { parseVideoUrl } from '../lib/videoEmbed';
import { VideoSource } from '../types';

interface SmartVideoEmbedProps {
  url: string;
  title?: string;
  author?: string;
  tags?: string[];
  showDetails?: boolean;
  className?: string;
}

export default function SmartVideoEmbed({
  url,
  title = 'Odborné video-vysvětlení',
  author = 'Opatrovnický expert',
  tags = [],
  showDetails = true,
  className = ''
}: SmartVideoEmbedProps) {
  const [video, setVideo] = useState<VideoSource | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  // Initialize and parse URL on load
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    const parsed = parseVideoUrl(url, title, author, tags);
    setVideo(parsed);
    
    // Check if saved in LocalPortal
    try {
      const savedList = JSON.parse(localStorage.getItem('synthesis_saved_videos') || '[]');
      const found = savedList.some((v: any) => v.url === parsed.url);
      setIsSaved(found);
    } catch (e) {
      console.error(e);
    }
  }, [url, title, author, tags]);

  if (!video) return null;

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const savedList = JSON.parse(localStorage.getItem('synthesis_saved_videos') || '[]');
      if (isSaved) {
        const filtered = savedList.filter((v: any) => v.url !== video.url);
        localStorage.setItem('synthesis_saved_videos', JSON.stringify(filtered));
        setIsSaved(false);
      } else {
        const newSave = {
          ...video,
          savedAt: new Date().toISOString()
        };
        savedList.push(newSave);
        localStorage.setItem('synthesis_saved_videos', JSON.stringify(savedList));
        setIsSaved(true);
      }
      // Dispatch custom event to notify other sections (like UserPortal) to reload
      window.dispatchEvent(new Event('saved_videos_updated'));
    } catch (e) {
      console.error(e);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      navigator.clipboard.writeText(video.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const getPlatformLabelAndColor = () => {
    switch (video.platform) {
      case 'youtube':
        return { label: 'YouTube', color: 'bg-red-50 text-red-700 border-red-200/50', icon: Youtube };
      case 'vimeo':
        return { label: 'Vimeo', color: 'bg-sky-50 text-sky-700 border-sky-200/50', icon: Video };
      case 'tiktok':
        return { label: 'TikTok', color: 'bg-slate-950 text-white border-slate-800', icon: Video };
      case 'instagram':
        return { label: 'Instagram', color: 'bg-pink-50 text-pink-700 border-pink-200/50', icon: Video };
      case 'facebook':
        return { label: 'Facebook', color: 'bg-blue-50 text-blue-700 border-blue-200/50', icon: Video };
      case 'x':
        return { label: 'X (Twitter)', color: 'bg-slate-900 text-white border-slate-700', icon: Video };
      default:
        return { label: 'Video odkaz', color: 'bg-slate-50 text-slate-700 border-slate-200/50', icon: Video };
    }
  };

  const { label: platformLabel, color: platformColor, icon: PlatformIcon } = getPlatformLabelAndColor();

  const isEmbeddable = video.platform !== 'unknown' && video.embedUrl;

  return (
    <div 
      className={`bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-3xs transition-all ${className}`}
      id={`smart-video-${video.id}`}
    >
      {/* Aspect Video Frame Container */}
      <div className="relative aspect-video bg-slate-900 w-full overflow-hidden">
        {isEmbeddable && !hasError ? (
          <>
            {/* Loading / Skeleton Overlay */}
            {isLoading && (
              <div className="absolute inset-0 z-10 bg-slate-900 flex flex-col items-center justify-center text-slate-300 space-y-2">
                <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
                <span className="text-[10px] font-mono tracking-wider text-slate-400">Načítání přehrávače...</span>
              </div>
            )}
            <iframe
              src={video.embedUrl}
              title={video.title}
              className="w-full h-full border-0 absolute inset-0 z-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setHasError(true);
                setIsLoading(false);
              }}
              referrerPolicy="no-referrer"
            />
          </>
        ) : (
          /* Non-embeddable or Error Fallback Card */
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4 bg-gradient-to-b from-slate-900 to-slate-950">
            {/* Background pattern */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-overlay"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600')" }}
            />
            
            <div className="relative space-y-3 z-10 max-w-sm">
              <div className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-teal-400 mx-auto shadow-md">
                <Play className="w-5 h-5 ml-0.5 fill-current" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-xs md:text-sm text-white font-display leading-tight">
                  {video.title}
                </h4>
                <p className="text-[10px] text-slate-400">
                  {video.author} &bull; {platformLabel}
                </p>
              </div>
              <p className="text-[10px] text-slate-300 leading-relaxed max-w-xs mx-auto">
                {video.platform === 'unknown' 
                  ? 'Vzhledem k nastavení zabezpečení této platformy nelze video přehrát přímo na portálu.' 
                  : 'Nepodařilo se načíst interaktivní náhled. Video můžete přehrát přímo na zdrojové stránce.'}
              </p>
              <div className="pt-1 flex justify-center">
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Otevřít video <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Video Details Panel */}
      {showDetails && (
        <div className="p-4 space-y-3 border-t border-slate-100">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 border rounded-md font-mono ${platformColor} flex items-center gap-1`}>
                  <PlatformIcon className="w-2.5 h-2.5 shrink-0" />
                  {platformLabel}
                </span>
                {video.tags && video.tags.map((tag, idx) => (
                  <span 
                    key={idx} 
                    className="text-[9px] font-medium text-slate-500 bg-slate-100 border border-slate-200/50 px-2 py-0.5 rounded-md flex items-center gap-0.5"
                  >
                    <Tag className="w-2.5 h-2.5 text-slate-400" />
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="text-xs font-extrabold text-slate-850 font-display leading-tight pt-1">
                {video.title}
              </h3>
            </div>

            {/* Quick Actions Panel */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Save / Bookmark Button */}
              <button
                type="button"
                onClick={handleSaveToggle}
                title={isSaved ? "Odebrat z uložených videí" : "Uložit do mých videí na portálu"}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                  isSaved 
                    ? 'bg-teal-50 text-teal-600 border-teal-200 hover:bg-teal-100' 
                    : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50 hover:text-slate-600'
                }`}
              >
                {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
              </button>

              {/* Share / Copy Link Button */}
              <button
                type="button"
                onClick={handleShare}
                title="Kopírovat odkaz na video"
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                  copied 
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                    : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50 hover:text-slate-600'
                }`}
              >
                {copied ? (
                  <span className="text-[9px] font-bold px-0.5 font-mono">OK</span>
                ) : (
                  <Share2 className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>Autor: <strong className="text-slate-700">{video.author}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}
