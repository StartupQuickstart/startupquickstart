import React from 'react';
import { OverlayTrigger, Tooltip as RBTooltip } from 'react-bootstrap';

export function Tooltip({ children, placement, tooltip }) {
  if (!tooltip) {
    return children;
  }

  return (
    <OverlayTrigger
      placement={placement || 'top'}
      overlay={(props) => <RBTooltip {...props}>{tooltip}</RBTooltip>}
    >
      {children}
    </OverlayTrigger>
  );
}

export default Tooltip;
