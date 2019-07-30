import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { fakeAccountLogin } from '../pages/user/login/service';
import { routerRedux } from 'dva/router';

export interface Menu {
  path: string;
  name: string;
  icon?: string;
  exact?: boolean;
  children: Menu[];
}

export interface User {
  id: number;
  name: string;
}

export interface AuthorityType extends StateType {
  currentUser: User;
  currentMenu: Menu[];
}

export interface StateType {
  status?: 'ok' | 'error';
}

type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'userLogin',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response: StateType = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      if (response.status === 'ok') {
        localStorage.setItem('authority', JSON.stringify(response));
        yield put(routerRedux.push('/'));
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default Model;
