import request from 'umi-request'

export async function fakeAccountLogin(params:{username:string,password:string}){
    return request('/api/login/account',{
        method:'POST',
        data:params,
    })
}