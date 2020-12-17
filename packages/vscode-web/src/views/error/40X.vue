<template>
  <div class="l-page">
    <div class="l-page-content">
      <img class="error-image" :src="errorImg" :alt="errorCode" />
      <div class="error-text">
        <h4>{{ errorCode }}</h4>
        <h5 v-if="errorDesc">{{ errorDesc }}</h5>
      </div>
      <div class="page-actions">
        <a-button size="large" type="text" @click="goHome">返回首页</a-button>
        <a-button size="large" type="text" @click="goPrev">
          <span>返回上一页</span>
          <!-- <span v-if="is404">({{ seconds }}s)</span> -->
        </a-button>
      </div>
    </div>
  </div>
</template>

<script lange="ts">
import errorImg from '@/assets/sad.svg'

export default {
  data() {
    return {
      seconds: 5,
      errorImg,
      errorCode: 404,
      errorDesc: '',
      timer: undefined
    }
  },

  computed: {
    is404() {
      return this.errorCode == '404'
    }
  },

  mounted() {
    const rParams = this.$route.params
    this.errorCode = rParams.code || 404

    // if (this.is404) {
    //   this.timer = setInterval(() => {
    //     if (this.seconds === 0) this.goPrev()
    //     else this.seconds--
    //   }, 1000)
    // }
  },

  beforeUnmount() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },

  methods: {
    goHome() {
      this.$router.replace({
        name: 'home'
      })
    },

    goPrev() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less" scoped>
.l-page {
  height: 100vh;
  width: 100vw;
  position: relative;
  background: #f8f8f9;
}

.l-page-content {
  width: 700px;
  height: 600px;
  padding: 50px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -60%);

  .error-image {
    display: block;
    width: 100%;
    height: 100%;
  }

  .error-text {
    position: absolute;
    left: 0px;
    top: 0px;
    h4 {
      position: absolute;
      left: 0px;
      top: 0px;
      font-size: 80px;
      font-weight: 700;
      color: #348eed;
    }
    h5 {
      position: absolute;
      width: 700px;
      left: 0px;
      top: 100px;
      font-size: 20px;
      font-weight: 700;
      color: #67647d;
    }
  }

  .page-actions {
    position: absolute;
    right: 0px;
    bottom: 20px;
  }
}
</style>
