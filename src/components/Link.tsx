import React from 'react';
import { SmartLink } from './SmartLink';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Next.js compatible Link component wrapper for Vite SPA environment.
 * Delegates internal link parsing and tab switching smoothly.
 */
export const Link: React.FC<LinkProps> = ({ href, children, className, ...rest }) => {
  return (
    <SmartLink href={href} className={className} {...rest}>
      {children}
    </SmartLink>
  );
};

export default Link;
