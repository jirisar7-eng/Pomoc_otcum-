/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { parseInternalLink, navigateToTabAndAnchor } from '../lib/navigation';

interface SmartLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
  children: React.ReactNode;
  className?: string;
  activeTab?: string;
}

/**
 * SmartLink Component.
 * Intercepts clicks on internal links (e.g. /kategorie/stridava-pece#podminky or #podminky),
 * switches the application tab smoothly without page reload, and scrolls to the target anchor.
 */
export const SmartLink: React.FC<SmartLinkProps> = ({
  href = '',
  children,
  className = '',
  activeTab,
  onClick,
  ...rest
}) => {
  const parsed = parseInternalLink(href, activeTab);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }

    if (!parsed.isExternal && parsed.targetTab) {
      e.preventDefault();
      navigateToTabAndAnchor(parsed.targetTab, parsed.anchor);
    }
  };

  if (parsed.isExternal) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <a
      href={href}
      className={className}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </a>
  );
};

export default SmartLink;
