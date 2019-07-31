import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { fakeAccountLogin } from '../pages/user/login/service';
import { routerRedux } from 'dva/router';
import {setAuthority,removeAuthority} from '../utils/authority'

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
  currentUser?: User;
  currentMenu?: Menu[];
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
    logout:Effect;
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
      const response: AuthorityType = yield call(fakeAccountLogin, payload);
      if (response.status === 'ok') {
        setAuthority(response)
        yield put(routerRedux.push('/'));
      }
    },
    *logout(_, { put }) {
      removeAuthority()
      yield put({
        type: 'changeLoginStatus',
        payload: {},
      });
      yield put(
        routerRedux.push({
          pathname: '/user/login',
        }),
      );
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
