import { getAuthority } from './authority';
/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable import/no-mutable-exports */
let Authorized = getAuthority()

// Reload the rights component
const reloadAuthorized = (): void => {
  Authorized = getAuthority()
};

export { reloadAuthorized };
export default Authorized;
