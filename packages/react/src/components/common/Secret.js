import React, { useState } from 'react';
import CopyToClipboard from './CopyToClipboard';

export function Secret({ value }) {
  const [hideSecret, setHideSecret] = useState(true);

  return (
    <span>
      <span className="d-inline-block py-2">
        {hideSecret ? '*'.repeat(value?.length) : value}
      </span>
      <span className="btn-text-group ms-2">
        <span className="btn-text" onClick={() => setHideSecret(!hideSecret)}>
          {hideSecret ? 'Show' : 'Hide'}
        </span>
        <span className="btn-text-seperator">|</span>
        <CopyToClipboard text={value}>
          <span className="btn-text">Copy</span>
        </CopyToClipboard>
      </span>
    </span>
  );
}
