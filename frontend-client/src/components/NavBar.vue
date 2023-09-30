<template>
  <div class="card relative z-2 header">
    <Menubar :model="items">
      <template #start>
        <img alt="logo" src="https://primefaces.org/cdn/primevue/images/logo.svg" height="40" class="mr-2 logo" />
      </template>
      <template
        #item="{
          label,
          item,
          props,
          root,
          hasSubmenu,
        }">
        <router-link v-if="item.route" v-slot="routerProps" :to="item.route" custom>
          <a :href="routerProps.href" v-bind="props.action">
            <span v-if="item.icon" v-bind="props.icon" />
            <span v-bind="props.label">{{ label }}</span>
          </a>
        </router-link>
        <a v-else :href="item.url" :target="item.target" v-bind="props.action">
          <span v-if="item.icon" v-bind="props.icon" />
          <span v-bind="props.label">{{ label }}</span>
          <span :class="[hasSubmenu && (root ? 'pi pi-fw pi-angle-down' : 'pi pi-fw pi-angle-right')]" v-bind="props.submenuicon" />
        </a>
      </template>
      <template #end>
        <InputText placeholder="Search" type="text" />
      </template>
    </Menubar>
  </div>
</template>

<script setup>
import Menubar from 'primevue/menubar';
import InputText from 'primevue/inputtext';
import { ref } from 'vue';
import navbarItems from '@/config/navbarItems';

const items = ref(navbarItems);
</script>

<style scoped>
.header {
  width: 100vw;
}

.header img.logo {
  margin-right: 1rem;
}

:deep(.p-menubar) {
  border-radius: 0;
}
</style>
