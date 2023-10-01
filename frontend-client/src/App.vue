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
  max-height: 100vh;
  display: flex;
  flex-direction: column;
}

.router {
  height: calc(100vh - 64px);
  width: 100vw;
  display: flex;
}

.routes {
  display: flex;
  margin: 20px;
}

/* .navbar {
  height: 64px;
}

main.router {
  position: absolute;
  top: 64px;
  bottom: 0;
  width: 100vw;
  overflow-y: scroll;
} */
</style>
