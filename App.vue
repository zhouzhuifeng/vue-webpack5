<template>
    <div class="zz">
        <div class="container">
            <div class="left">
                <router-link to="/">Go to Home</router-link>
                <router-link to="/foo">Go to Foo</router-link>
                <router-link to="/bar">Go to Bar</router-link>
                <router-link to="/car">Go to Car</router-link>
            </div>
            <div class="right">
                <transition>
                    <router-view></router-view>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
export default {}
</script>
<style>
body,
html {
    margin: 0 !important;
    padding: 0;
    height: 100%;
}
.green {
    color: #04190c;
}
</style>
<style lang="less">
.zz {
    width: 100%;
    height: 100%;
    display: flex;
    background-image: linear-gradient(to right, #e1bdeb, rgb(141, 241, 226));
}
.container {
    display: flex;
    padding: 20px;
    flex: 1;
    .left {
        border-right: 1px solid #a39e9e;
        width: 200px;
        display: flex;
        flex-flow: column;
        a {
            color: #1fa023;
        }
    }
    .right {
        flex: 1;
        padding-left: 20px;
    }
}
</style>