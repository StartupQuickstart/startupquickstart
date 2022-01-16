import { Toast } from '@/lib';
import React from 'react';
import { CopyToClipboard as CopyToClipboardReact } from 'react-copy-to-clipboard';
import { Tooltip } from './';

export function CopyToClipboard({ text, children, tooltip, copyMessage }) {
  function handleCopy() {
    Toast.success(copyMessage, { autoClose: 2000 });
  }

  return (
    <CopyToClipboardReact text={text} onCopy={handleCopy}>
      <span className="btn-text">
        <Tooltip tooltip={tooltip}>{children}</Tooltip>
      </span>
    </CopyToClipboardReact>
  );
}

CopyToClipboard.defaultProps = {
  tooltip: 'Copy to Clipboard',
  copyMessage: 'Copied to Clipboard'
};

export default CopyToClipboard;
