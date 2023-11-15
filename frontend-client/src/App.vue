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
  max-width: calc(100% - 40px);
}

.routes {
  flex: 1;
  height: 100%;
  max-width: 100%;
}

:deep(.p-column-filter-menu-button.p-column-filter-menu-button-active) {
  background-color: transparent;
  color: #8dd0ff;
}
</style>
