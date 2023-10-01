<template>

  <div class="card flex justify-content-center">
    <img
      :src="`${img}?height=120&now=${Date.now()}`"
      alt=""
      class="w-6rem shadow-2 border-round"
      @click="toggle"
      loading="lazy"
      style="cursor:pointer" />

    <!-- This would be the same image, but larger, in a popup box. -->
    <OverlayPanel ref="op" appendTo="body">
      <img :src="`${img}?height=300&now=${Date.now()}`" alt="" height="300" loading="lazy" />
    </OverlayPanel>

  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue';
import OverlayPanel from 'primevue/overlaypanel';

defineProps({
  img: {
    type: String,
    required: true,
  },
});

const op = ref();
const toggle = (event) => {
  op.value.toggle(event);
};
</script>

<style scoped>

</style>
