import _ from 'lodash';
import { jsx } from 'slate-hyperscript';
import { Editor, Transforms, Element as SlateElement } from 'slate';

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

const EMPTY_NODE = (el, children) => jsx('fragment', {}, children);

export const leaves = [
  { element: 'b', name: 'bold' },
  { element: 'i', name: 'italic' },
  { element: 'u', name: 'underline' },
  { element: 'code', name: 'code' },
  { element: 'strike', name: 'strikethrough' }
];

export const blocks = [
  { element: 'body', getJsx: EMPTY_NODE },
  { element: 'br', getJsx: () => '\n' },
  { element: 'blockquote', name: 'block-quote' },
  { element: 'p', name: 'paragraph' },
  { element: 'h1', name: 'heading-one' },
  { element: 'h2', name: 'heading-two' },
  { element: 'h3', name: 'heading-thre' },
  { element: 'h4', name: 'heading-four' },
  { element: 'h5', name: 'heading-five' },
  { element: 'ol', name: 'numbered-list' },
  { element: 'ul', name: 'bulleted-list' },
  { element: 'li', name: 'list-item' },
  { element: 'span', name: 'span', getJsx: EMPTY_NODE },
  {
    element: 'a',
    name: 'link',
    getJsx: (el, children) =>
      jsx('element', { type: 'link', url: el.getAttribute('href') }, children)
  }
];

export function getNodeConfig(lookup) {
  const searchFun = (el) => [el.element, el.name].includes(lookup);

  let config = _.find(leaves, searchFun);

  if (config) {
    config.type = 'leaf';
  } else {
    config = _.find(blocks, searchFun);

    if (config) {
      config.type = 'block';

      if (!config.getJsx) {
        config.getJsx = (el, children) =>
          jsx('element', { type: config.name }, children);
      }
    }
  }
  return config;
}

export const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

export const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

export const isBlockActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format
  });

  return !!match;
};

export const toggleBlock = (editor, format) => {
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

export function serialize(nodes) {
  let html = '';

  if (nodes) {
    for (const node of nodes) {
      const nodeConfig = getNodeConfig(node.type);

      if (node.text) {
        const { text, ...props } = node;
        let leafHtml = text;

        for (const prop in props) {
          if (props[prop]) {
            const nodeConfig = getNodeConfig(prop);
            const element = nodeConfig.element;

            leafHtml = `<${element}>${leafHtml}</${element}>`;
          }
        }

        html += leafHtml;
      } else if (getNodeConfig(node.type)) {
        const element = nodeConfig.element;
        html += `<${element}>${serialize(node.children)}</${element}>`;
      } else {
        html += `<span>${serialize(node.children)}</span>`;
      }
    }
  }

  return html;
}

export function deserialize(el, props = {}, parent) {
  if (typeof el === 'string') {
    if (el.startsWith('<') && el.endsWith('>')) {
      el = new DOMParser().parseFromString(el, 'text/html');
    } else {
      el = new DOMParser().parseFromString(`<p>${el}</p>`, 'text/html');
    }

    el = el.body;
  }

  if (el.nodeType === 3) {
    const text = el.textContent;

    if (parent.nodeName === 'BODY' && !text.trim().length) {
      return jsx('element', { type: 'paragraph' }, [{ text: '\n' }]);
    }

    return { text, ...props };
  } else if (el.nodeType !== 1) {
    return null;
  }

  const nodeName = el.nodeName.toLowerCase();
  const nodeConfig = getNodeConfig(nodeName);

  if (nodeConfig?.type === 'leaf') {
    props[nodeConfig.name] = true;
  }

  const elProps = { ...props };
  let children = Array.from(el.childNodes).map((child) =>
    deserialize(child, elProps, el)
  );

  if (!nodeConfig) {
    console.log(`Config for nodeName ${nodeName} does not exist`);
    return jsx('fragment', {}, children);
  }

  if (children.length === 0) {
    children = [{ text: '' }];
  }

  if (nodeConfig.type === 'leaf') {
    return jsx('fragment', {}, children);
  } else if (nodeConfig.type === 'block') {
    return nodeConfig.getJsx(el, children);
  }
}
