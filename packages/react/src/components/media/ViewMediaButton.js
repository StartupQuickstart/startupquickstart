import React from 'react';
import { useLightbox } from 'simple-react-lightbox';

export function ViewMediaButton({ media }) {
  const { openLightbox } = useLightbox();

  if (media.type.startsWith('image/') || media.type.startsWith('video/')) {
    return (
      <button
        className="btn btn-primary btn-sm mx-0 mx-sm-1"
        onClick={() => openLightbox(media.index)}
      >
        View
      </button>
    );
  } else {
    return (
      <a
        target="_blank"
        rel="noreferrer"
        className="btn btn-primary btn-sm mx-0 mx-sm-1"
        href={`${window.location.origin}/${media.path}`}
      >
        View
      </a>
    );
  }
}

export default ViewMediaButton;
