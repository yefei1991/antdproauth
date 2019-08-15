import request from '@/utils/request';
import { ParamType } from './model';

export async function queryUserList(params: ParamType) {
  return request('/server/user/list', {
    params,
  });
}

export async function queryUser(params: {id:number}) {
  return request('/api/user/info', {
    params,
  });
}