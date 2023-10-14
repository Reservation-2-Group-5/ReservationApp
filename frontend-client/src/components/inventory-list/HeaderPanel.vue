<template>
  <div class="flex flex-wrap align-items-center justify-content-between gap-2">
    <span class="text-xl text-900 font-bold">{{ name }}</span>
    <div class="right-header-buttons">
      <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter" />
      <span class="p-input-icon-left">
        <i class="pi pi-search" />
        <InputText :modelValue="filters['global'].value" @update:modelValue="$emit('inputUpdate', $event)" placeholder="Keyword Search" />
      </span>
      <Button icon="pi pi-refresh" raised @click="fetchData" severity="secondary" />
    </div>
  </div>
</template>

<script setup>
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

defineProps({
  filters: {
    type: Object,
    required: true,
  },
  fetchData: {
    type: Function,
    required: true,
  },
  clearFilter: {
    type: Function,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.right-header-buttons {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
