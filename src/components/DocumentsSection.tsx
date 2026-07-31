/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import KeStazeniSection from './KeStazeniSection';

interface DocumentsSectionProps {
  searchQuery?: string;
}

export default function DocumentsSection({ searchQuery }: DocumentsSectionProps) {
  return <KeStazeniSection />;
}
