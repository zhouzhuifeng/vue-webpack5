<template>
    <div class="isred">
        234 is hom234e324
        <img :src="imgSrc" class="img" alt="zz">
    </div>
</template>

<script>
import img from '../assets/imgs/wx.jpg'
export default {
    data() {
        return {
            imgSrc: img
        }
    },
    mounted() {
        console.log(this.imgSrc, '----')
    }
}
</script>
<style lang="less" scoped>
.isred {
    color: red;
}
</style>