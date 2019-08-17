import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { queryUserList,queryUser,saveUser,deleteUser,userRoles,allocateRole } from './service';
import { PaginationProps } from 'antd/lib/pagination';
import {ResponseType} from '@/services/common'

export interface User {
  id: number;
  name: string;
  username: string;
}

export interface ParamType {
  current?: number;
  pageSize?: number;
}

export interface UserListResponse extends ResponseType {
  data:{
    list:User[]
    pageNum:number
    pageSize:number
    total:number
  }
}

export interface UserRoleResponse extends ResponseType{
  data:UserRoles[]
}

export interface UserRoles{
  label:string
  value:number
  checked:boolean
}
export interface StateType {
  list: User[];
  pagination: PaginationProps;
  currentUser?:User
  userRoles?:UserRoles[]
  roleChecked?:number[]
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    fetchUserInfo:Effect;
    saveUser:Effect;
    deleteUser:Effect;
    userRoles:Effect;
    allocateRole:Effect;
  };
  reducers: {
    queryList: Reducer<StateType>;
    setCurrentUser:Reducer<StateType>;
    setUserRoles:Reducer<StateType>;
    setRoleChecked:Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'userManage',

  state: {
    list: [],
    pagination: { current: 1, pageSize: 10, showSizeChanger: true },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response: UserListResponse = yield call(queryUserList, payload);
      yield put({
        type: 'queryList',
        payload: response,
      });
    },
    *fetchUserInfo({ payload }, { call, put }){
      const response: ResponseType = yield call(queryUser, payload);
      const data:User=response.data
      yield put({
        type: 'setCurrentUser',
        payload: data,
      });
    },
    *saveUser({payload},{call,put}){
      const response: ResponseType = yield call(saveUser, payload);
      return response
    },
    *deleteUser({payload},{call}){
      const response: ResponseType = yield call(deleteUser, payload);
      return response
    },
    *allocateRole({payload},{call}){
      yield call(allocateRole, payload);
    },
    *userRoles({payload},{call,put}){
      const response:UserRoleResponse=yield call(userRoles,payload);
      let arr:number[]=[]
      response.data.forEach(e=>{
        if(e.checked){
          arr.push(e.value)
        }
      })
      yield put({
        type: 'setUserRoles',
        payload: response.data,
      });
      yield put({
        type: 'setRoleChecked',
        payload: arr,
      });
    }
  },

  reducers: {
    queryList(state, { payload }) {
      const pl = <UserListResponse>payload;
      const { pagination } = state as StateType;
      pagination.total = pl.data.total;
      pagination.current = pl.data.pageNum;
      pagination.pageSize = pl.data.pageSize;
      return {
        pagination,
        list: pl.data.list,
      };
    },
    setCurrentUser(state, { payload }) {
      const s1=<StateType> state
      return {
        ...s1,
        currentUser:payload
      };
    },
    setUserRoles(state, { payload }) {
      const s1=<StateType> state
      return {
        ...s1,
        userRoles:payload
      };
    },
    setRoleChecked(state, { payload }) {
      const s1=<StateType> state
      return {
        ...s1,
        roleChecked:payload
      };
    },
  },
};

export default Model;
