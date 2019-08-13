import { AnyAction, Reducer } from 'redux';
import { parse, stringify } from 'qs';
import { EffectsCommandMap } from 'dva';
import { fakeAccountLogin } from '../pages/user/login/service';
import { routerRedux } from 'dva/router';
import {setAuthority,removeAuthority} from '../utils/authority'
import {ResponseType} from '../services/common'

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

interface LoginResponse extends ResponseType{
  data?:{currentUser:User,currentMenu:Menu[]}
}

export interface StateType {
  status?: 'ok' | 'error';
  currentUser?: User;
  currentMenu?: Menu[];
  errorMessage?:string
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

function getPageQuery(): {
  [key: string]: string;
} {
  return parse(window.location.href.split('?')[1]);
}

const Model: ModelType = {
  namespace: 'userLogin',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response: LoginResponse = yield call(fakeAccountLogin, payload);
      if (response.code === 200) {
        const authority:AuthorityType={status:'ok',currentUser:response.data!.currentUser,currentMenu:response.data!.currentMenu}
        setAuthority(authority)
        let {redirect}=getPageQuery()
        if(redirect){
          const redirectUrlParams = new URL(redirect);
          redirect = redirect.substr(redirectUrlParams.origin.length);
          yield put(routerRedux.push(redirect));
        }else{
          yield put(routerRedux.push('/'));
        }
      }else{
        yield put({
          type: 'changeLoginStatus',
          payload: {status:'error',errorMessage:response.message},
        });
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
          search: stringify({
            redirect: window.location.href,
          }),
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
