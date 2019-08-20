import request from '@/utils/request';
import { ParamType, Model,model} from './model';

export async function queryList(params: ParamType) {
  return request(`/server/${model}/list`, {
    params,
  });
}

export async function queryModel(params: { id: number }) {
  return request(`/server/${model}/info`, {
    params,
  });
}

export async function deleteModel(params: { id: number }) {
  return request(`/server/${model}/delete`, {
    requestType: 'form',
    method: 'POST',
    data: params,
  });
}

export async function saveModel(param: Model) {
  return request(`/server/${model}/save`, {
    requestType: 'form',
    method: 'POST',
    data: param,
    }
  );
}
