<script setup>
import { computed, ref, onMounted } from 'vue';
import car from '@/assets/car.png';

defineProps({
  message: {
    type: String,
    default: null,
  },
  submessage: {
    type: String,
    default: null,
  },
  btnmessage: {
    type: String,
    default: null,
  },
});
</script>

<template>
  <div role="alert" class="shadow-lg overflow-hidden p-0">
    <div class="absolute">
      <!-- <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        class="stroke-info shrink-0 w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg> -->
      <div class="absolute ml-8">
        <h1 class="mt-4 font-bold text-white text-2xl">{{ message }}</h1>
        <button class="btn btn-sm">{{ btnmessage }}</button>

        <div class="text-xs mt-4 text-slate-300">{{ submessage }}</div>
      </div>
    </div>
    <img :src="car" class="w-full rounded-xl object-cover h-32" />
  </div>
</template>
