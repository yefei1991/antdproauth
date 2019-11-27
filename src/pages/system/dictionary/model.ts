import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import {deleteModel,queryList,queryModel,saveModel} from './service';
import { PaginationProps } from 'antd/lib/pagination';
import {ResponseType} from '@/services/common'

export const model='dictionary'

export interface Model {
  id: number
  name: string
  code: string
  option:string
  optiondesc:string
  sort:string
}

export interface ParamType {
  current?: number;
  pageSize?: number;
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
  currentModel?:Model
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
    fetchInfo:Effect;
    saveModel:Effect;
    deleteModel:Effect;
  };
  reducers: {
    setList: Reducer<StateType>;
    setEditModel:Reducer<StateType>;
  };
}

const dvamodel: ModelType = {
  namespace: `${model}Manage`,

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
    *fetchInfo({ payload }, { call, put }){
      const response: ResponseType = yield call(queryModel, payload);
      const data:Model=response.data
      yield put({
        type: 'setEditModel',
        payload: data,
      });
    },
    *saveModel({payload},{call,put}){
      const response: ResponseType = yield call(saveModel, payload);
      return response
    },
    *deleteModel({payload},{call}){
      const response: ResponseType = yield call(deleteModel, payload);
      return response
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
    setEditModel(state, { payload }) {
      const s1=<StateType> state
      return {
        ...s1,
        currentModel:payload
      };
    },
  },
};

export default dvamodel;
