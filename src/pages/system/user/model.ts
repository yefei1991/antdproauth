import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { queryUserList } from './service';
import { PaginationProps } from 'antd/lib/pagination';

export interface User{
  id:number
  name:string
  username:string
  role:string
}
export interface StateType {
  list: User[];
  pagination:PaginationProps
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
  };
  reducers: {
    queryList: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'userManage',

  state: {
    list: [],
    pagination:{current:1,pageSize:10},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response:{total:number,rows:any[],current?:number} = yield call(queryUserList, payload);
      response.current=payload.current
      yield put({
        type: 'queryList',
        payload: response,
      });
    },
  },

  reducers: {
    queryList(state, {payload}) {
      return {
        pagination:{total:payload.total,current:payload.current},
        list: payload.rows
      };
    },
  },
};

export default Model;
