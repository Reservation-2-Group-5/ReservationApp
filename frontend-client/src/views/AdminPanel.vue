<template>
  <main>
    <Card v-if="isAdmin">
      <template #title>
        Admin Panel
      </template>
      <template #content>
        <p>Admin Panel</p>
      </template>
    </Card>
  </main>
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
  if (!isAdmin.value) {
    router.push('/');
  }
});
</script>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  width: 100vw;
}
</style>
