import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import {queryList} from './service';
import { PaginationProps } from 'antd/lib/pagination';
import {ResponseType} from '@/services/common'

export const model='novel'

export interface Model {
  id: number
  name: string
  author: string
  type:string
}

export interface ParamType {
  current?: number;
  pageSize?: number;
  name?:string
}

export interface ModelListResponse extends ResponseType {
  data:{
    list:Model[]
    pageNum:number
    pageSize:number
    total:number
  }
}

export interface StateType {
  list: Model[];
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
    fetchList: Effect;
  };
  reducers: {
    setList: Reducer<StateType>;
  };
}

const dvamodel: ModelType = {
  namespace: `${model}`,

  state: {
    list: [],
    pagination: { current: 1, pageSize: 10, showSizeChanger: true },
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      const response: ModelListResponse = yield call(queryList, payload);
      yield put({
        type: 'setList',
        payload: response,
      });
    },
  },

  reducers: {
    setList(state, { payload }) {
      const pl = <ModelListResponse>payload;
      const { pagination } = state as StateType;
      pagination.total = pl.data.total;
      pagination.current = pl.data.pageNum;
      pagination.pageSize = pl.data.pageSize;
      return {
        pagination,
        list: pl.data.list,
      };
    },
  },
};

export default dvamodel;
