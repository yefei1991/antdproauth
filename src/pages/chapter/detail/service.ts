import request from '@/utils/request';

export async function queryDetail(params: {chapterId:number}) {
  return request(`/server/novel/detail`, {
    params,
  });
}
