<template>
  <div class="card relative z-2 header">
    <Menubar
      :model="items"
      :pt="{
        menuItem: ({ props, context }) => ({
          class: assignClasses(props, context),
        }),
      }">
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
    </Menubar>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import Menubar from 'primevue/menubar';
import { useUserStore } from '@/store';
import navbarItems from '@/config/navbarItems';

const userStore = useUserStore();
const { isAdmin } = storeToRefs(userStore);

const items = ref(navbarItems);
const rightAlignedCount = ref(2);

function assignClasses(props, context) {
  const classList = [];
  if (context.index === props.items.length - rightAlignedCount.value) {
    classList.push('right-aligned');
  }
  if (context.item.item.label === 'Admin' && !isAdmin.value) {
    // hide admin menu item if not admin
    classList.push('hidden-menuitem');
  }
  return classList.join(' ');
}
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
  width: 100%;
}

:deep(.p-menubar-root-list) {
  flex: 1;
  width: 100%;
}

:deep(.right-aligned) {
  margin-left: auto;
}

:deep(.hidden-menuitem) {
  display: none;
}
</style>
