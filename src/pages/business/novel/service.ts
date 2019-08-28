import request from '@/utils/request';
import { ParamType, model} from './model';

export async function queryList(params: ParamType) {
  return request(`/server/${model}/list`, {
    params,
  });
}
