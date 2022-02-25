import React from 'react';
import { useSlate } from 'slate-react';
import classnames from 'classnames';
import { toggleBlock, toggleMark, isBlockActive, isMarkActive } from './utils';
import { Feather } from 'react-feather';

export const EditorIcon = ({ icon }) => {
  const FeatherIcon = Feather[icon];

  if (FeatherIcon) {
    return <FeatherIcon />;
  } else {
    return <i className={icon} />;
  }
};

export function EditorButton({ format, icon, text, type }) {
  const editor = useSlate();

  function isActive() {
    if (type === 'block') {
      return isBlockActive(editor, format);
    } else if (type === 'mark') {
      return isMarkActive(editor, format);
    }

    return false;
  }

  return (
    <span
      className={classnames('clickable', isActive() ? 'active' : '')}
      onMouseDown={(event) => {
        event.preventDefault();

        if (type === 'block') {
          toggleBlock(editor, format);
        } else if (type === 'mark') {
          toggleMark(editor, format);
        }
      }}
    >
      {icon && <EditorIcon icon={icon} />}
      {text && <span className="icon-text">{text}</span>}
    </span>
  );
}

export default EditorButton;
