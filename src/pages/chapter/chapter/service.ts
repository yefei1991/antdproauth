import request from '@/utils/request';

export async function queryList(params: {novelId:number}) {
  return request(`/server/novel/chapters`, {
    params,
  });
}
