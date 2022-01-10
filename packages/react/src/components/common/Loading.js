import React from 'react';

export function Loading({ small }) {
  const styles = small ? { position: 'relative', height: '100px' } : {};
  return (
    <div className="d-block" style={styles}>
      <div className="loading spinner-border text-primary">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

export default Loading;
