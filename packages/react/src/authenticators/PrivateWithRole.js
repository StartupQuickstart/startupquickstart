import { PrivateWithProps } from './Private';

export function PrivateWithRole(requiredRoles) {
  return PrivateWithProps({ requiredRoles });
}

export default PrivateWithRole;
