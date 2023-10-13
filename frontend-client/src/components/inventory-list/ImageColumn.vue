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
import { ref, onMounted, watch } from 'vue';
import Image from 'primevue/image';
import { useInventoryStore } from '@/store';

const inventoryStore = useInventoryStore();

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
});

// TODO: temporary just for the cat img example
async function fetchCat() {
  const d = Date.now();
  const cat = await fetch(`${props.data.image}?json=true&d=${d}`);
  const json = await cat.json();
  return props.data.image + json.url.replace('/cat', '');
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
watch(catImg, (newVal) => {
  if (!newVal) return;
  if (!props.data?.id) return;
  inventoryStore.setItemImg(props.data.id, newVal);
});
</script>

<style scoped>

</style>
