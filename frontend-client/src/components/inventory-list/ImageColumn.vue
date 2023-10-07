<template>

  <div class="card flex justify-content-center">
    <Image alt="" preview>
      <template #image>
        <img
          :src="`${catImg}?height=50`"
          alt=""
          class="w-6rem shadow-2 border-round"
          loading="lazy"
          height="50" />
      </template>
      <template #preview>
        <img
          :src="`${catImg}?height=500`"
          alt=""
          loading="lazy"
          height="500" />
      </template>
    </Image>
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted } from 'vue';
import Image from 'primevue/image';

const props = defineProps({
  img: {
    type: String,
    required: true,
  },
});

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
