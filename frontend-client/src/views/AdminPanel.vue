<template>
  <div class="card">
    <TabView :lazy="true">
      <TabPanel header="Device Reservations">
        <AdminDeviceRes />
      </TabPanel>
      <TabPanel header="Room Reservations">
        <AdminRoomRes />
      </TabPanel>
    </TabView>
  </div>
</template>

<script setup>
import { onBeforeMount } from 'vue';
import AdminDeviceRes from '@/components/AdminDeviceRes.vue';
import AdminRoomRes from '@/components/AdminRoomRes.vue';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import { useUserStore } from '@/store';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

// setup the data stores
const userStore = useUserStore();
const { isAdmin } = storeToRefs(userStore);

// setup the router
const router = useRouter();

// redirect to home if not admin
// should have already been checked by the router, but just in case
onBeforeMount(() => {
  if (!isAdmin.value) {
    router.push('/');
  }
});
</script>

<style scoped>
.card {
  height: 100%;
  width: 100%;
  background-color: #191e25;
}

:deep(.p-tabview.p-component),
:deep(.p-tabview-panel) {
  height: 100%;
}

:deep(.p-tabview-panels) {
  height: calc(100% - 40px);
}
</style>
