import React from 'react';
import { ConnectProps } from '@/models/connect';
import Redirect from 'umi/redirect';
import {getAuthority} from '../utils/authority'

interface AuthComponentProps extends ConnectProps {
}

const AuthComponent: React.FC<AuthComponentProps> = ({
  children,
  route = {
    routes: [],
  },
  location = {
    pathname: '',
  },
}) => {
  let authority=getAuthority()
  return (
    authority?<div>{children}</div>:<Redirect to="/user/login" />
  );
};

export default AuthComponent
