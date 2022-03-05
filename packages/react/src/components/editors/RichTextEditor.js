import React, { useMemo, useState } from 'react';
import isHotkey from 'is-hotkey';
import { Editable, withReact, Slate } from 'slate-react';
import { createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { deserialize, serialize, toggleMark } from './utils';
import EditorButton from './EditorButton';

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code'
};

export function RichTextEditor({
  placeholder,
  defaultValue,
  onChange,
  onBlur,
  height
}) {
  const transformed = useMemo(
    () =>
      deserialize('<p>' + defaultValue.split('\n').join('</p><p>') + '</p>'),
    [defaultValue]
  );

  const [value, setValue] = useState(transformed);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  function _onChange(value) {
    setValue(value);
    onChange && onChange(serialize(value));
  }

  return (
    <div className="rich-text-editor" style={{ minHeight: height }}>
      <Slate editor={editor} value={value} onChange={_onChange}>
        <div className="editor-toolbar">
          <EditorButton type="mark" format="bold" icon="fa fa-bold" />
          <EditorButton type="mark" format="italic" icon="fa fa-italic" />
          <EditorButton type="mark" format="underline" icon="fa fa-underline" />
          <EditorButton type="mark" Button format="code" icon="fa fa-code" />
          <EditorButton
            type="mark"
            format="strikethrough"
            icon="fa fa-strikethrough"
          />
          <EditorButton type="block" format="heading-one" text="H1" />
          <EditorButton type="block" format="heading-two" text="H2" />
          <EditorButton type="block" format="heading-three" text="H3" />
          <EditorButton type="block" format="heading-four" text="H4" />
          <EditorButton type="block" format="heading-five" text="H5" />
          <EditorButton
            type="block"
            format="block-quote"
            icon="fa fa-quote-right"
          />
          <EditorButton
            type="block"
            format="numbered-list"
            icon="fa fa-list-ol"
          />
          <EditorButton type="block" format="bulleted-list" icon="fa fa-list" />
        </div>
        <Editable
          renderElement={Element}
          renderLeaf={Leaf}
          placeholder={placeholder}
          onBlur={onBlur}
          spellCheck
          autoFocus
          onKeyDown={(event) => {
            for (const hotkey in HOTKEYS) {
              if (isHotkey(hotkey, event)) {
                event.preventDefault();
                const mark = HOTKEYS[hotkey];
                toggleMark(editor, mark);
              }
            }
          }}
        />
      </Slate>
    </div>
  );
}

export const renderElement = (props) => <Element {...props} />;
export const renderLeaf = (props) => <Leaf {...props} />;

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>;
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>;
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>;
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>;
    case 'heading-three':
      return <h3 {...attributes}>{children}</h3>;
    case 'heading-four':
      return <h4 {...attributes}>{children}</h4>;
    case 'heading-five':
      return <h5 {...attributes}>{children}</h5>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong {...attributes}>{children}</strong>;
  }

  if (leaf.code) {
    children = <code {...attributes}>{children}</code>;
  }

  if (leaf.italic) {
    children = <em {...attributes}>{children}</em>;
  }

  if (leaf.underline) {
    children = <u {...attributes}>{children}</u>;
  }

  if (leaf.strikethrough) {
    children = <strike {...attributes}>{children}</strike>;
  }

  return <span {...attributes}>{children}</span>;
};

RichTextEditor.defaultProps = {
  placeholder: 'Enter text here',
  defaultValue: ''
};

export default RichTextEditor;
