<template>
  <Card class="card">
    <template #title>
      Login
    </template>
    <template #content>
      <p>Logging in...</p>
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
  userStore.setUser({
    id: 1,
    name: 'John Doe',
    role: 'admin',
  });
  router.push('/');
});
</script>

<style scoped>
.card {
  height: 100%;
}
</style>
