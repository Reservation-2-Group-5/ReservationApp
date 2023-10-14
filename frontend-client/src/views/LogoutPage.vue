<template>
  <Card class="card">
    <template #title>
      Logout
    </template>
    <template #content>
      <p>Logging out...</p>
    </template>
  </Card>
</template>

<script setup>
import { onMounted } from 'vue';
import { useUserStore } from '@/store';
import { useRouter } from 'vue-router';
import Card from 'primevue/card';
import sleep from '@/utils/sleep';

const userStore = useUserStore();
const router = useRouter();

onMounted(async () => {
  await sleep(1000);
  // TODO: Remove this once we have proper login
  userStore.setUser(null);
  router.push('/');
});
</script>

<style scoped>
.card {
  height: 100%;
}
</style>
