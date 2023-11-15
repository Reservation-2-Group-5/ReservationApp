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
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const userStore = useUserStore();
const router = useRouter();

onMounted(async () => {
  // TODO: Remove this once we have proper login
  try {
    await userStore.login();
    console.log('Logged in:', userStore.user);
  } catch (e) {
    console.error(e);
    toast.add({
      severity: 'error',
      summary: 'Login failed',
      detail: e.message,
      life: 5000,
    });
  }

  const to = router.currentRoute.value.query?.redirect ?? null;
  if (to && userStore.isLoggedIn) {
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
