<template>
  <div class="app">
    <NavBar class="navbar" />
    <main class="router">
      <div class="routes">
        <router-view />
      </div>
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
  height: 100vh;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.router {
  height: calc(100vh - 104px);
  margin: 20px;
  overflow: hidden;
  display: flex;
}

.routes {
  flex: 1;
  height: 100%;
}
</style>
