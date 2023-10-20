<template>
  <div class="flex align-items-center gap-2">
    <Avatar :image="image" size="small" shape="circle" />
    <div><span>{{ name }}</span><span v-if="netId" class="netId">({{ netId }})</span></div>
  </div>
</template>

<script setup>
import Avatar from 'primevue/avatar';

defineProps({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  netId: {
    type: String,
    required: false,
    default: null,
  },
});
</script>

<style scoped>
.netId {
  font-size: 0.8rem;
  color: var(--text-color-secondary);
  padding-left: 0.3rem;
}
</style>
