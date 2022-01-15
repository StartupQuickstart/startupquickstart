import React, { useMemo, useState } from 'react';
import isHotkey from 'is-hotkey';
import { Editable, withReact, useSlate, Slate } from 'slate-react';
import {
  Editor,
  Transforms,
  createEditor,
  Element as SlateElement
} from 'slate';
import { withHistory } from 'slate-history';
import * as Feather from 'react-feather';
import classnames from 'classnames';

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code'
};

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

/**
 *  Based off Rich Text Example from 'slate-react
 *  https://github.com/ianstormtaylor/slate/blob/main/site/examples/richtext.tsx
 */
export const RichTextEditor = ({
  placeholder,
  defaultValue,
  onChange,
  onBlur,
  height
}) => {
  const transformed = transformValue(defaultValue);

  const [value, setValue] = useState(transformed);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  function _onChange(value) {
    setValue(value);

    if (onChange) {
      onChange(JSON.stringify(value));
    }
  }

  return (
    <div className="rich-text-editor" style={{ minHeight: height }}>
      <Slate editor={editor} value={value} onChange={_onChange}>
        <div className="editor-toolbar">
          <MarkButton format="bold" icon="fa fa-bold" />
          <MarkButton format="italic" icon="fa fa-italic" />
          <MarkButton format="underline" icon="fa fa-underline" />
          <MarkButton format="code" icon="fa fa-code" />
          <BlockButton format="heading-one" text="H1" />
          <BlockButton format="heading-two" text="H2" />
          <BlockButton format="heading-three" text="H3" />
          <BlockButton format="heading-four" text="H4" />
          <BlockButton format="heading-five" text="H5" />
          <BlockButton format="block-quote" icon="fa fa-quote-right" />
          <BlockButton format="numbered-list" icon="fa fa-list-ol" />
          <BlockButton format="bulleted-list" icon="fa fa-list" />
        </div>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
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
};

export const renderElement = (props) => <Element {...props} />;
export const renderLeaf = (props) => <Leaf {...props} />;

export const transformValue = (value) => {
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value);
    } catch (err) {}

    if (typeof value === 'string') {
      value = [
        {
          type: 'paragraph',
          children: [{ text: value }]
        }
      ];
    }
  }

  return value;
};

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      LIST_TYPES.includes(
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type
      ),
    split: true
  });
  const newProperties = {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format
  };
  Transforms.setNodes(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format
  });

  return !!match;
};

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const Icon = ({ icon }) => {
  const FeatherIcon = Feather[icon];

  if (FeatherIcon) {
    return <FeatherIcon />;
  } else {
    return <i className={icon} />;
  }
};

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
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const BlockButton = ({ format, icon, text }) => {
  const editor = useSlate();

  return (
    <span
      className={classnames(
        'clickable',
        isBlockActive(editor, format) ? 'active' : ''
      )}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      {icon && <Icon icon={icon} />}
      {text && <span className="icon-text">{text}</span>}
    </span>
  );
};

const MarkButton = ({ format, icon, text }) => {
  const editor = useSlate();
  return (
    <span
      className={classnames(
        'clickable',
        isMarkActive(editor, format) ? 'active' : ''
      )}
      onMouseDown={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {icon && <Icon icon={icon} />}
      {text && <span className="icon-text">{text}</span>}{' '}
    </span>
  );
};

RichTextEditor.defaultProps = {
  placeholder: 'Enter text here',
  defaultValue: [
    {
      type: 'paragraph',
      children: [{ text: '' }]
    }
  ]
};

export default RichTextEditor;
