import React from 'react';

// Import React FilePond
import { FilePond, registerPlugin } from 'react-filepond';

// Import FilePond styles
import 'filepond/dist/filepond.min.css';

import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import Auth from '@/lib/demo/auth';
import querystring from 'querystring';

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

export class FileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = { files: [] };
  }

  /**
   * Handles file changes
   *
   * @param {Array} files Array of files
   */
  onChange = (files) => {
    this.setState({ files });

    if (this.props.onChange) {
      this.props.onChange(files);
    }
  };

  render() {
    let url = `/api/v1/media`;

    if (this.props.params) {
      url += `?${querystring.stringify(this.props.params)}`;
    }

    return (
      <FilePond
        onupdatefiles={this.onChange}
        allowMultiple={true}
        maxFiles={10}
        server={{
          url,
          headers: { authorization: `bearer ${Auth.getToken()}` }
        }}
        name="files"
      />
    );
  }
}

export default FileUpload;
