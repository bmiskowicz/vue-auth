import {ActionContext, createStore} from 'vuex'

export default createStore({
    state: () => ({
        auth: false,
        id: 0,
        message: ''
    }),
    getters: {
        getUser: state => {
            console.log('Retrieving user...')
            return state.id;
        }
    },
    mutations: {
        setId: (state: { id: number }, id: number) => {
            state.id = id;
        },
        setAuth: (state: { auth: boolean }, auth: boolean) => {
            state.auth = auth;
        },
        setMessage: (state: {message: string}, message: string) => {
            state.message = message;
        }
    },
    actions: {
        setId: (context: ActionContext<any, any>, id: number) => {
            context.commit('setId', id);
        },
        setAuth: (context: ActionContext<any, any>, auth: boolean) => {
            context.commit('setAuth', auth);
        },
        setMessage: (context: ActionContext<any, any>, message: string) => {
            context.commit('setMessage', message);
        }

    },
    modules: {}
})