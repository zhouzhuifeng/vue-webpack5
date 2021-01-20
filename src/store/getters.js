export default {
    doneTodos: state => {
        return state.todos.filter(todo => todo.done)
    },
    // 获取user某块state里的name属性
    getterUserData: state => {
        return state.user.name
    }
}