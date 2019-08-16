import request from '@/utils/request';
import { ParamType,User } from './model';

export async function queryUserList(params: ParamType) {
  return request('/server/user/list', {
    params,
  });
}

export async function queryUser(params: {id:number}) {
  return request('/server/user/info', {
    params,
  });
}

export async function deleteUser(params: {id:number}) {
  return request('/server/user/delete', {
    requestType:'form',
    method:'POST',
    data:params,
  });
}

export async function saveUser(param:User){
  return request('/server/user/save',{
    requestType:'form',
    method:'POST',
    data:param,
    }
  );

}