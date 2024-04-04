<script setup>
import { containerMaxW } from '@/config.js';
import BaseLevel from '@/components/BaseLevel.vue';

const year = new Date().getFullYear();
</script>

<template>
  <footer class="py-2 px-6" :class="containerMaxW">
    <BaseLevel type="justify-center">
      <div class="text-center md:text-center">
        <b>
          <a href="https://github.com/IS213-ESD" target="_blank">Delectric</a
          >.</b
        >
        <slot />
      </div>
      <div class="md:py-2">
        <a href="https://github.com/IS213-ESD">
          <!-- <JustboilLogo class="w-auto h-8 md:h-6" /> -->
        </a>
      </div>
    </BaseLevel>
  </footer>
</template>
