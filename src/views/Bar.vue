<template>
    <div class="green">
        <div>{{msg}}</div>
        <div>getters：{{doneTodos}}</div>
        <div>获取用户模块的用户名 getterUserData: {{getterUserData}}</div>
        <div>
            <el-button type="danger" size="mini" @click="increment">increment</el-button>
        </div>
    </div>
</template>

<script>
import { mapMutations, mapActions, mapState, mapGetters } from 'vuex'
export default {
    data() {
        return {}
    },

    computed: {
        ...mapState('app', ['msg']),
        ...mapGetters(['doneTodos', 'getterUserData'])
    },
    methods: {
        ...mapActions('app', ['login']),
        ...mapMutations('app', ['increment'])
    }
}
</script>

<style lang="less" scoped>

</style>