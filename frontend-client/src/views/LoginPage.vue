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

const userStore = useUserStore();
const router = useRouter();

onMounted(async () => {
  // TODO: Remove this once we have proper login
  await userStore.login();
  console.log('Logged in:', userStore.user);
  const to = router.currentRoute.value.query?.redirect ?? null;
  if (to) {
    router.push(to);
  } else {
    router.back();
  }
});
</script>

<style scoped>
.card {
  height: 100%;
}
</style>
