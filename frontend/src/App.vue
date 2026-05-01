<script setup lang="ts">
// 应用根组件
import AppLayout from '@/components/layout/AppLayout.vue'
</script>

<template>
  <div id="app-root">
    <!-- 全局噪点叠加层 -->
    <div class="app-noise"></div>
    <AppLayout />
  </div>
</template>

<style lang="scss">
@import '@/assets/styles/variables.scss';

#app-root {
  position: relative;
  width: 100%;
  height: 100%;
}

// 全局噪点纹理 — 给整个界面增加颗粒感
.app-noise {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 9998;
  opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 256px 256px;
}
</style>
