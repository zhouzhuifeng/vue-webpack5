const state = { msg: 'vuex引用' };
const actions = {
    login({ dispatch, commit, getters, rootGetters }) {
        setTimeout(() => {
            commit('app/increment')
        }, 1000)
    }
};
const mutations = {
    increment(state) {
        state.msg = '开始使用vuex'
    }
}
export default {
    //开启带命名空间
    namespaced: true,
    state: () => (state),
    actions,
    mutations
}