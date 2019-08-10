import request from 'umi-request';
import { ParamType } from './model';

export async function queryUserList(params: ParamType) {
  return request('/api/user/list', {
    params,
  });
}

export async function queryUser(params: {id:number}) {
  return request('/api/user/info', {
    params,
  });
}