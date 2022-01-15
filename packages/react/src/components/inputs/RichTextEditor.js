import React from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

export class RichTextEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: EditorState.createEmpty()
    };

    const contentBlock = htmlToDraft(this.props.defaultValue || '');
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      this.state.editorState = EditorState.createWithContent(contentState);
    }
  }

  onChange = (editorState) => {
    this.setState({ editorState });

    if (this.props.onChange) {
      const htmlValue = draftToHtml(
        convertToRaw(editorState.getCurrentContent())
      );

      const inputValue = {
        target: {
          value: htmlValue.trim() === '<p></p>' ? null : htmlValue,
          name: this.props.name
        }
      };

      this.props.onChange(inputValue);
    }
  };

  onBlur = (editorState) => {
    if (this.props.onBlur) {
      this.props.onBlur({
        target: { name: this.props.name }
      });
    }
  };

  render() {
    return (
      <Editor
        editorState={this.state.editorState}
        toolbarClassName="rich-text-editor-toolbar"
        wrapperClassName={`rich-text-editor-wrapper ${
          this.props.isInvalid ? 'is-invalid' : ''
        }`}
        editorClassName="rich-text-editor rich-text-editor-md"
        onEditorStateChange={this.onChange}
        readOnly={this.props.disabled}
        placeholder={this.props.placeholder}
        onBlur={this.onBlur}
      />
    );
  }
}

export default RichTextEditor;
