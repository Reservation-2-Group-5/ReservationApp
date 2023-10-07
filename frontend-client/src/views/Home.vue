<template>
  <main>
    <Card>
      <template #title>
        Home
      </template>
      <template #content>
        <p>Form to reserve an inventory item or campus space.</p>
      </template>
    </Card>
  </main>
</template>

<script setup>
import Card from 'primevue/card';
</script>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  width: 100vw;
}
</style>
