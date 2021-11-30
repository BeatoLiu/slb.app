import { App, InjectionKey } from "@vue/runtime-dom";
import { createStore, Store, useStore as baseUseStore } from "vuex";
import UserModule from "./modules/user";
import { UserStateTypes } from './modules/user/interface'

export interface RootState {
    // count: number
    user: UserStateTypes
}


const store = createStore<RootState>({
    // state: {
    //     count: 1
    // },
    // mutations: {},
    // actions: {},
    modules: { user: UserModule },
});

export const key: InjectionKey<Store<RootState>> = Symbol('vue-store')

export const useStore = () => baseUseStore(key)

export const setupStore = (app: App) => {
    app.use(store, key)
}
