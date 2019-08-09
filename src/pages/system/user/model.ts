import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { queryUserList } from './service';
import { PaginationProps } from 'antd/lib/pagination';

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

export interface ResponseType {
  total: number;
  rows: any[];
  current: number;
  pageSize: number;
}
export interface StateType {
  list: User[];
  pagination: PaginationProps;
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
    pagination: { current: 1, pageSize: 10, showSizeChanger: true },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response: ResponseType = yield call(queryUserList, payload);
      yield put({
        type: 'queryList',
        payload: response,
      });
    },
  },

  reducers: {
    queryList(state, { payload }) {
      const pl = <ResponseType>payload;
      const { pagination } = state as StateType;
      pagination.total = pl.total;
      pagination.current = pl.current;
      pagination.pageSize = pl.pageSize;
      return {
        pagination,
        list: pl.rows,
      };
    },
  },
};

export default Model;
