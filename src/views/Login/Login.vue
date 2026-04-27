<script setup lang="ts">
import { LoginForm } from './components'
import { useDesign } from '@/hooks/web/useDesign'
import { ref } from 'vue'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('login')

const isLogin = ref(true)
</script>

<template>
  <div :class="prefixCls" class="h-[100%] relative <xl:dark:bg-v-dark">
    <div class="relative h-full flex mx-auto">
      <div class="flex-1 relative login-bg">
        <Transition appear enter-active-class="animate__animated animate__bounceInRight">
          <div class="w-full h-full flex justify-center items-center">
            <div class="flex items-center">
              <LoginForm
                v-if="isLogin"
                class="p-20px h-auto m-auto <xl:(rounded-3xl light:bg-white)"
              />
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-login';

.@{prefix-cls} {
  &__left {
    &::before {
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      background-image: url('@/assets/svgs/login-bg.svg');
      background-position: center;
      background-repeat: no-repeat;
      content: '';
    }
  }
}
.login-bg {
  background-image: url('@/assets/imgs/login-bg.png');
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
</style>
