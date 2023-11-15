<template>
  <div class="container">
    <h3 v-if="title">{{ title }}</h3>
    <span>{{ content }}</span>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: false,
    default: null,
  },
  content: {
    type: String,
    required: false,
    default: null,
  },
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  /* align-items: center; */
  height: 100%;
}
</style>
