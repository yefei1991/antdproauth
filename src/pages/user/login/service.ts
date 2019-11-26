import request from '@/utils/request'

export async function fakeAccountLogin(params:{username:string,password:string}){
    return request('/server/user/login',{
        requestType:'form',
        method:'POST',
        data:params,
    })
}

export async function logout(){
    return request('/server/user/logout',{
        requestType:'form',
        method:'POST',
    })
}