<template>

  <div class="card flex justify-content-center">
    <img
      :src="`${catImg}?height=50`"
      alt=""
      class="w-6rem shadow-2 border-round"
      @click="toggle"
      loading="lazy"
      height="50"
      style="cursor:pointer" />

    <!-- This would be the same image, but larger, in a popup box. -->
    <OverlayPanel ref="op" appendTo="body">
      <img :src="`${catImg}?height=300`" alt="" height="300" loading="lazy" />
    </OverlayPanel>

  </div>
</template>

<script setup>
import { ref, defineProps, onMounted } from 'vue';
import OverlayPanel from 'primevue/overlaypanel';

const props = defineProps({
  img: {
    type: String,
    required: true,
  },
});

const op = ref();
const toggle = (event) => {
  op.value.toggle(event);
};

// TEMP: just for the cat img example
async function fetchCat() {
  const d = Date.now();
  const cat = await fetch(`${props.img}?json=true&d=${d}`);
  const json = await cat.json();
  return props.img + json.url.replace('/cat', '');
}
const catImg = ref('');
onMounted(async () => {
  try {
    catImg.value = await fetchCat();
  } catch (err) {
    console.error('err', err);
    catImg.value = 'https://images.placeholders.dev/';
  }
});
</script>

<style scoped>

</style>
