import React from 'react';
import { SlateReactPresentation } from 'slate-react-presentation';
import { renderElement, renderLeaf } from './RichTextEditor';
import { deserialize } from './utils';

export function RichText({ value, children }) {
  const body = value || children || '';

  const richText =
    typeof body === 'string'
      ? '<p>' + body.split('\n').join('</p><p>') + '</p>'
      : '';
  const document = deserialize(richText);

  return (
    <SlateReactPresentation
      value={document}
      renderElement={renderElement}
      renderLeaf={renderLeaf}
    />
  );
}

export default RichText;
