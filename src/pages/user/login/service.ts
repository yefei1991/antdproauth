import request from 'umi-request'

export async function fakeAccountLogin(params:{username:string,password:string}){
    return request('/server/user/login',{
        requestType:'form',
        method:'POST',
        data:params,
    })
}