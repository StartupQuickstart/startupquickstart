import { default as ReactAvatar } from 'react-avatar';
import classnames from 'classnames';

export function Avatar({ src, name, size, className, color }) {
  if (src) {
    return (
      <img
        alt={name}
        src={src}
        width="auto"
        height={size || 45}
        className={classnames('rounded', className)}
      />
    );
  }

  return (
    <ReactAvatar
      color={color || '#6c757d'}
      name={name && name.match(/^[0-9]/) ? 'R S' : name}
      className={classnames('img-fluid rounded', className)}
      size={size || 45}
    />
  );
}

export default Avatar;
