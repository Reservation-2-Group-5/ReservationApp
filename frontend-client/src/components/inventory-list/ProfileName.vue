<template>
  <div class="flex align-items-center gap-2">
    <Avatar :image="image" size="small" shape="circle" />
    <span>{{ name }}</span>
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
});
</script>

<style scoped>

</style>
