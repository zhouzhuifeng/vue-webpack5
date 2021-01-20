import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
Vue.use(Vuex);
const state = {
  todos: [
    {
      done: 'done1',
      id: 1
    },
    {
      done: 'done2',
      id: 2
    },
  ]
};

const modulesFiles = require.context('./modules', false, /\.js$/);
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {});

export default new Vuex.Store({
  state: () => (state),
  modules,
  getters
});
