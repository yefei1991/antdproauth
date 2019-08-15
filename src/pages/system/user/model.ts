import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { queryUserList,queryUser } from './service';
import { PaginationProps } from 'antd/lib/pagination';
import {ResponseType} from '@/services/common'

export interface User {
  id: number;
  name: string;
  username: string;
  role: string;
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
  // total: number;
  // rows: any[];
  // current: number;
  // pageSize: number;
}
export interface StateType {
  list: User[];
  pagination: PaginationProps;
  currentUser?:User
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
  };
  reducers: {
    queryList: Reducer<StateType>;
    setCurrentUser:Reducer<StateType>;
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
      const response: User = yield call(queryUser, payload);
      yield put({
        type: 'setCurrentUser',
        payload: response,
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
  },
};

export default Model;
