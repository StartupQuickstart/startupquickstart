import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'react-feather';
import { FileIcon, defaultStyles } from 'react-file-icon';

export function FileDropzone({ multiple, value, onChange = console.log }) {
  const onDrop = useCallback(
    (files) => {
      const value = multiple ? files : files.length && files[0];
      onChange(value);
    },
    [onChange, multiple]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple
  });

  function removefile(index) {
    const newValue = [...value];
    newValue.splice(index, 1);
    onDrop(newValue);
  }

  const fileLabel = multiple ? 'files' : 'file';
  const files = Array.isArray(value) ? value : value ? [value] : [];

  return (
    <>
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the {fileLabel} here ...</p>
        ) : (
          <p>
            Drop {fileLabel} here, or click to select {fileLabel}
          </p>
        )}
        <UploadCloud />
      </div>
      <ul className="list-group mt-2">
        {files?.map((file, index) => {
          const icon = file?.name?.split('.').pop() || 'txt';
          return (
            <li key={index} className="list-group-item">
              <span className="file-icon me-2">
                <FileIcon extension={icon} {...defaultStyles[icon]} />
              </span>
              {file.name}
              <span className="float-end">
                <button
                  type="button"
                  className="btn btn-link btn-sm"
                  onClick={() => removefile(index)}
                >
                  <span className="fa fa-times fa-lg text-muted" />
                </button>
              </span>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default FileDropzone;
