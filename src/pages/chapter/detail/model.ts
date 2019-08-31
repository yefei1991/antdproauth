import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import {queryDetail} from './service';
import {ResponseType} from '@/services/common'
import { routerRedux } from 'dva/router';

export const model='detail'

export interface Model {
  novelId: number
  content: string
  title: string
  next?: number
  prev?: number
}

export interface ModelListResponse extends ResponseType {
  data:Model
}

export interface StateType {
  detail?:Model
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetchDetail: Effect;
  };
  reducers: {
    setDetail: Reducer<StateType>;
  };
}

const dvamodel: ModelType = {
  namespace: `${model}`,

  state: {
  },

  effects: {
    *fetchDetail({ payload }, { call, put }) {
      if(payload.chapterId){
        const response: ModelListResponse = yield call(queryDetail, payload);
        console.info(response)
        yield put({
          type: 'setDetail',
          payload: response,
        });
      }else{
          yield put(routerRedux.push('/chapter/404'));
      }
    },
  },

  reducers: {
    setDetail(state, { payload }) {
      const pl = <ModelListResponse>payload;
      return {
        detail:pl.data
      };
    },
  },
};

export default dvamodel;
