import React from 'react';
import { Link } from 'react-router-dom';

export default function SidebarCallToAction({
  actionTitle,
  actionTo,
  title,
  description,
  newTab
}) {
  if (!title) {
    return '';
  }

  return (
    <div className="sidebar-cta">
      <div className="sidebar-cta-content">
        {title && <strong className="d-inline-block mb-2">{title}</strong>}
        {description && <div className="mb-3 text-sm">{description}</div>}
        {actionTitle && !actionTo.startsWith('https') && (
          <Link
            to={actionTo || '/'}
            className="btn btn-primary btn-block"
            target={newTab ? '_blank' : '_self'}
          >
            {actionTitle}
          </Link>
        )}

        {actionTitle && actionTo.startsWith('https') && (
          <a href={actionTo} className="btn btn-primary btn-block">
            {actionTitle}
          </a>
        )}
      </div>
    </div>
  );
}
