import React from 'react';
import { Link } from 'react-router-dom';

export default function SidebarCallToAction({
  actionTitle,
  actionLink,
  title,
  description
}) {
  return (
    <div className="sidebar-cta">
      <div className="sidebar-cta-content">
        {title && <strong className="d-inline-block mb-2">{title}</strong>}
        {description && <div className="mb-3 text-sm">{description}</div>}
        {actionTitle && (
          <Link to={actionLink || '/'} className="btn btn-primary btn-block">
            {actionTitle}
          </Link>
        )}
      </div>
    </div>
  );
}
