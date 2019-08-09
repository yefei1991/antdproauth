import request from 'umi-request';
import { ParamType } from './model';

export async function queryUserList(params: ParamType) {
  return request('/api/user/list', {
    params,
  });
}
