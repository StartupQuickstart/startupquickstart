import { OverlayTrigger, Tooltip as RBTooltip } from 'react-bootstrap';

export function Tooltip({ children, placement, tooltip }) {
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
