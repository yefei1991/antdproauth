import { AuthorityType } from '../models/login';

// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(): AuthorityType | null {
  const authStr = localStorage.getItem('authority');
  if (authStr) {
    const auth: AuthorityType = JSON.parse(authStr);
    return auth;
  } else {
    return null;
  }
}

export function setAuthority(authority: AuthorityType): void {
  localStorage.setItem('authority', JSON.stringify(authority));
}


export function removeAuthority():void{
  localStorage.removeItem('authority')
}