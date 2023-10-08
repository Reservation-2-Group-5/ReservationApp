<template>
  <Card v-if="isAdmin" class="card">
    <template #title>
      Admin Panel
    </template>
    <template #content>
      <p>Admin Panel</p>
    </template>
  </Card>
</template>

<script setup>
import { onBeforeMount } from 'vue';
import Card from 'primevue/card';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store';

const store = useUserStore();
const { isAdmin } = store;

const router = useRouter();

// redirect to home if not admin
onBeforeMount(() => {
  if (!isAdmin) {
    router.push('/');
  }
});
</script>

<style scoped>
.card {
  height: 100%;
}
</style>
