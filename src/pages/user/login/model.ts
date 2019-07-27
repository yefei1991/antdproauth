import { AnyAction, Reducer } from 'redux'
import { EffectsCommandMap } from 'dva';
import { fakeAccountLogin } from './service'
import { routerRedux } from 'dva/router';

interface Menu {
    path: string
    name: string
    icon?: string
    exact?: boolean
    children: Menu[]
}

export interface StateType {
    status?: 'ok' | 'error'
    currentUser?: { id: number, name: string }
    currentMenu?: Menu[]
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
        status: undefined
    },
    effects: {
        *login({ payload }, { call, put }) {
            const response: StateType = yield call(fakeAccountLogin, payload)
            console.info(response)
            yield put({
                type: 'changeLoginStatus',
                payload: response
            });
            if(response.status==='ok'){
                yield put(routerRedux.replace('/'))
            }
        }
    },
    reducers: {
        changeLoginStatus(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
}

export default Model