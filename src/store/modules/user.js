const state = { name: 'userName' };
const actions = {
    commitData({ dispatch, commit, getters, rootGetters }) {
        setTimeout(() => {
            commit('app/increment', 'zz提交了')
        }, 1000)
    }
};
const mutations = {
    increment(state, item) {
        state.name = item
    }
}
export default {
    //开启带命名空间
    namespaced: true,
    state: () => (state),
    actions,
    mutations
}