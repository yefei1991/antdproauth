import request from 'umi-request';

export async function queryUserList(params:any) {
    return request('/api/user/list', {
        params,
    });
}