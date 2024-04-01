<script setup>
import { mdiCog } from '@mdi/js';
import CardBox from '@/components/CardBox.vue';
import NumberDynamic from '@/components/NumberDynamic.vue';
import BaseIcon from '@/components/BaseIcon.vue';
import BaseLevel from '@/components/BaseLevel.vue';
import PillTagTrend from '@/components/PillTagTrend.vue';
import BaseButton from '@/components/BaseButton.vue';
import Charge from '@/assets/Charge.png';

import { ref } from 'vue';
import { TimeScale } from 'chart.js';

defineProps({
  number: {
    type: Number,
    default: 0,
  },
  icon: {
    type: String,
    default: null,
  },
  prefix: {
    type: String,
    default: null,
  },
  suffix: {
    type: String,
    default: null,
  },
  label: {
    type: String,
    default: null,
  },
  street: {
    type: String,
    default: null,
  },
  TimeSlot: {
    // For calendar
    type: String,
    default: null,
  },
  TimeSlotStatusColor: {
    // For calendar
    type: String,
    default: null,
  },
  distance: {
    type: String,
    default: 0,
  },
  color: {
    type: String,
    default: null,
  },
  trend: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    default: null,
  },
  trendType: {
    type: String,
    default: null,
  },
});

// const imagePath = ref('@/assets/charge.png');
</script>

<template>
  <CardBox class="cursor-pointer" :class="TimeSlotStatusColor">
    <BaseLevel v-if="trend" class="mb-3" mobile>
      <PillTagTrend :trend="status" :trend-type="trendType" small />
      <!-- <BaseButton
        :icon="mdiCog"
        icon-w="w-4"
        icon-h="h-4"
        color="lightDark"
        small
      /> -->
    </BaseLevel>
    <BaseLevel mobile>
      <div class="max-w-full">
        <h1 class="text-2xl leading-tight font-semibold">
          {{ label }}
        </h1>
        <div class="flex flex-row gap-2 overflow-hidden">
          <h1 class="text-lg leading-tight">
            {{ distance }}
            {{ TimeSlot }}

            <!-- <NumberDynamic :value="number" :prefix="prefix" :suffix="suffix" /> -->
          </h1>

          <h1
            class="text-ellipsis overflow-hidden text-lg leading-tight text-slate-400 truncate"
          >
            {{ street }}
          </h1>
        </div>
      </div>
      <div class="flex">
        <img :src="Charge" class="w-8" />
      </div>
    </BaseLevel>
  </CardBox>
</template>
