import React from 'react';
import { SlateReactPresentation } from 'slate-react-presentation';
import { renderElement, renderLeaf, transformValue } from './RichTextEditor';

export function RichText({ value }) {
  const document = transformValue(value);

  return (
    <SlateReactPresentation
      value={document}
      renderElement={renderElement}
      renderLeaf={renderLeaf}
    />
  );
}

export default RichText;
