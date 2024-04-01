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

const playVideo = () => {
  if (videoPlayer.value) {
    videoPlayer.value.play();
  }
};

onMounted(() => {
  playVideo();
});

const handleAutoplay = () => {
  if (videoPlayer.value.paused) {
    videoPlayer.value.play();
  }
};

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
        <button @click="routeView" class="btn btn-sm mt-2">
          {{ btnmessage }}
        </button>

        <div class="text-xs mt-4 text-slate-300">{{ submessage }}</div>
      </div>
    </div>
    <!-- <img :src="carvid" class="w-full rounded-xl object-cover h-32" /> -->
    <div @click="playVideo">
      <video
        ref="videoPlayer"
        class="w-full rounded-xl object-cover h-32"
        autoplay
        @play="handleAutoplay"
        @ended="restartVideo"
      >
        <source :src="carvid" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  </div>
</template>
