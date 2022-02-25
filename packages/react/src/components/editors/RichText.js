import React from 'react';
import { SlateReactPresentation } from 'slate-react-presentation';
import { renderElement, renderLeaf } from './RichTextEditor';
import { deserialize } from './utils';

export function RichText({ value, children }) {
  const document = deserialize(value || children);

  return (
    <SlateReactPresentation
      value={document}
      renderElement={renderElement}
      renderLeaf={renderLeaf}
    />
  );
}

export default RichText;
