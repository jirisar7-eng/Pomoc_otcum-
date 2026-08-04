// src/hooks/useFeatures.ts
// Custom React hook for dynamic Feature Flags inspection and control

import { useState, useEffect, useCallback } from 'react';
import {
  FeatureFlag,
  FeatureCategory,
  getStoredFeatureFlags,
  isFeatureActive,
  toggleFeatureFlag,
  setBulkFeaturesState,
  resetFeatureFlagsToDefaults,
  FEATURE_FLAGS_EVENT
} from '../services/featureFlagsService';

export function useFeatures() {
  const [flags, setFlags] = useState<FeatureFlag[]>(() => getStoredFeatureFlags());

  useEffect(() => {
    // Initial fetch
    setFlags(getStoredFeatureFlags());

    // Listener for real-time changes
    const handleUpdate = (e: Event) => {
      const customEv = e as CustomEvent<FeatureFlag[]>;
      if (customEv.detail) {
        setFlags(customEv.detail);
      } else {
        setFlags(getStoredFeatureFlags());
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener(FEATURE_FLAGS_EVENT, handleUpdate);
      window.addEventListener('storage', handleUpdate);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener(FEATURE_FLAGS_EVENT, handleUpdate);
        window.removeEventListener('storage', handleUpdate);
      }
    };
  }, []);

  const isEnabled = useCallback(
    (featureKey: string): boolean => {
      const flag = flags.find((f) => f.feature_key === featureKey);
      return flag ? flag.is_enabled : true;
    },
    [flags]
  );

  const toggleFeature = useCallback((featureKey: string, enabled?: boolean, updatedBy?: string) => {
    const updated = toggleFeatureFlag(featureKey, enabled, updatedBy);
    setFlags(updated);
  }, []);

  const setBulkState = useCallback((target: 'all' | 'ai_tools' | FeatureCategory, enabled: boolean, updatedBy?: string) => {
    const updated = setBulkFeaturesState(target, enabled, updatedBy);
    setFlags(updated);
  }, []);

  const resetDefaults = useCallback((updatedBy?: string) => {
    const updated = resetFeatureFlagsToDefaults(updatedBy);
    setFlags(updated);
  }, []);

  const activeCount = flags.filter((f) => f.is_enabled).length;
  const totalCount = flags.length;
  const aiActiveCount = flags.filter((f) => f.category === 'ai_tools' && f.is_enabled).length;
  const aiTotalCount = flags.filter((f) => f.category === 'ai_tools').length;

  return {
    flags,
    isEnabled,
    toggleFeature,
    setBulkState,
    resetDefaults,
    activeCount,
    totalCount,
    aiActiveCount,
    aiTotalCount
  };
}
