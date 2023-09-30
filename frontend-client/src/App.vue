<template>
  <div class="app">
    <NavBar class="navbar" />
    <main class="router">
      <router-view class="routes" />
    </main>
  </div>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue';
</script>

<style scoped>
.app {
  min-height: 100vh;
}

.navbar {
  height: 64px;
}

main.router {
  position: absolute;
  top: 64px;
  bottom: 0;
  width: 100vw;
  overflow-y: scroll;
}

.routes {
  margin: 20px;
}
</style>
