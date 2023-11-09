<template>
  <div class="card relative z-2 header">
    <Menubar
      :model="items"
      :pt="{
        menuItem: ({ props, context }) => ({
          class: assignClasses(props, context),
        }),
      }"
      ref="navbar">
      <template #start>
        <img alt="logo" src="logo.svg" height="40" class="mr-2 logo" />
      </template>
      <template
        #item="{
          label,
          item,
          props,
          root,
          hasSubmenu,
        }">
        <router-link v-if="item.route" :to="item.route" class="p-menuitem-link" @mouseup="unsetClick">
          <span v-if="item.icon" v-bind="props.icon" />
          <span v-bind="props.label">{{ label }}</span>
        </router-link>
        <a v-else :href="item.url" :target="item.target" v-bind="props.action">
          <span v-if="item.icon" v-bind="props.icon" />
          <span v-bind="props.label">{{ label }}</span>
          <span :class="[hasSubmenu && (root ? 'pi pi-fw pi-angle-down' : 'pi pi-fw pi-angle-right')]" v-bind="props.submenuicon" /> -->
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
import sleep from '@/utils/sleep';

const userStore = useUserStore();
const { isAdmin, isLoggedIn } = storeToRefs(userStore);

const items = ref(navbarItems);
const navbar = ref(null);

function assignClasses(props, context) {
  const classList = [];
  const { label } = context.item.item;
  if (label === 'Login' || label === 'Admin'
    || (label === 'Logout' && isLoggedIn.value && !isAdmin.value)) {
    classList.push('right-aligned');
  }
  if ((label === 'Admin' && !isAdmin.value)
    || (label === 'Logout' && !isLoggedIn.value)
    || (label === 'Login' && isLoggedIn.value)) {
    classList.push('hidden-menuitem');
  }
  return classList.join(' ');
}

async function unsetClick() {
  await sleep(100);
  navbar.value.container.querySelectorAll('.p-focus').forEach((el) => {
    el.classList.remove('p-focus');
  });
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
  content: '';
  margin-left: auto;
}

:deep(.hidden-menuitem) {
  display: none;
}

:deep(.p-menuitem.p-focus > .p-menuitem-content) {
  background-color: #00000000;
}

:deep(.p-menuitem.p-focus > .p-menuitem-content .p-menuitem-text),
:deep(.p-menuitem.p-focus > .p-menuitem-content .p-menuitem-icon) {
  color: var(--text-color-secondary);
}
</style>
