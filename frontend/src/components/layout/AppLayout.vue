<script setup lang="ts">
// 主布局容器 - 反无技战法生成模块
import TopBar from './TopBar.vue'
import SideNav from './SideNav.vue'
</script>

<template>
  <div class="app-layout bg-grid">
    <!-- 顶栏 -->
    <TopBar class="app-layout__topbar" />

    <!-- 主内容区 -->
    <div class="app-layout__main">
      <!-- 侧边导航 -->
      <SideNav class="app-layout__sidenav" />

      <!-- 路由视图 -->
      <div class="app-layout__content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';
@import '@/assets/styles/mixins.scss';

.app-layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;

  &__topbar {
    height: $topbar-height;
    flex-shrink: 0;
  }

  &__main {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  &__sidenav {
    width: $sidenav-width;
    flex-shrink: 0;
  }

  &__content {
    flex: 1;
    overflow: hidden;
  }
}
</style>
