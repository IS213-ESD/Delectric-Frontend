<script setup>
import carvid from '@/assets/carvid.mp4';
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';

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

const videoPlayer = ref(null);


const restartVideo = () => {
  videoPlayer.value.currentTime = 0;
  videoPlayer.value.play();
};
const router = useRouter();

const routeView = () => {
  router.push('/booking');
};
</script>

<template>
  <div role="alert" class="shadow-lg overflow-hidden p-0">
    <div class="absolute w-full">
      <div class="absolute ml-8">
        <h1 class="mt-8 font-bold text-white text-2xl">{{ message }}</h1>
        <button @click="routeView" class="btn btn-sm mt-2">
          {{ btnmessage }}
        </button>

        <div class="text-xs mt-4 text-slate-300">{{ submessage }}</div>
      </div>
    </div>
    <!-- <img :src="carvid" class="w-full rounded-xl object-cover h-32" /> -->
    <div>
      <video
        ref="videoPlayer"
        class="w-full rounded-xl object-cover h-36"
        autoplay
        muted
        @ended="restartVideo"
      >
        <source :src="carvid" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  </div>
</template>
