import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import {queryList} from './service';
import {ResponseType} from '@/services/common'
import { routerRedux } from 'dva/router';

export const model='chapter'

export interface Model {
  id: number
  title: string
}

export interface ModelListResponse extends ResponseType {
  data:{
    author:string,
    novel:string,
    chapters:Model[],
  }
}

export interface StateType {
  list: Model[]
  author?:string
  novel?:string
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
  },

  effects: {
    *fetchList({ payload }, { call, put }) {
      if(payload.novelId){
        const response: ModelListResponse = yield call(queryList, payload);
        yield put({
          type: 'setList',
          payload: response,
        });
      }else{
          yield put(routerRedux.push('/chapter/404'));
      }
    },
  },

  reducers: {
    setList(state, { payload }) {
      //const pl = <ModelListResponse>payload;
      return {
        list: payload.data.chapters,
        author:payload.data.author,
        novel:payload.data.novel,
      };
    },
  },
};

export default dvamodel;
