<script setup>
<<<<<<< HEAD
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import BaseButton from '@/components/BaseButton.vue';
=======
    import { reactive } from 'vue'
    import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
    import { useMainStore } from '@/stores/main'
    const mainStore = useMainStore()
    // const profileForm = reactive({
    //     name: mainStore.userName,
    //     email: mainStore.userEmail
    // })
>>>>>>> origin/charging-stations
</script>

<template>
  <LayoutAuthenticated>
    <BaseButton to="/dashboard" color="info" class="ml-6 mt-4" label="Back" />

    <div class="grid grid-cols-1 gap-5 px-5 mt-5">
      <div class="card bg-base-100 flex justify-between">
        <figure>
          <img
            src="https://static1.straitstimes.com.sg/s3fs-public/styles/large30x20/public/articles/2021/01/09/us-automobile-environment-tesla-052911.jpg?VersionId=VBWE6tjAISYWZ3s1BLeqAM7N_IKrMyOW"
          />
        </figure>
        <div class="card-body">
          <div class="flex justify-between items-baseline">
            <span class="text-slate-400 text-xs"
              >Est. 3 Hours to fully charged</span
            >
            <span>⚡60%</span>
          </div>
          <progress
            class="progress h-3 progress-accent w-100"
            value="60"
            max="100"
          ></progress>
          <div class="flex justify-between align-middle">
            <h2 class="card-title">NAFA Campus Charging Station</h2>
          </div>
          <span class="text-slate-400">190 Middle Rd, Singapore 188979</span>
          <span class="text-slate-400"
            >Booked From: 1PM-3PM (30 Mins remaining)</span
          >
          <div class="card-actions mt-5">
            <button class="btn btn-primary btn-outline w-full">
              END CHARGING
            </button>
          </div>
        </div>
      </div>
      <div class="card bg-base-100">
        <figure>
          <img
            src="https://static1.straitstimes.com.sg/s3fs-public/styles/large30x20/public/articles/2021/01/09/us-automobile-environment-tesla-052911.jpg?VersionId=VBWE6tjAISYWZ3s1BLeqAM7N_IKrMyOW"
          />
        </figure>
        <div class="card-body">
          <progress
            class="progress h-3 progress-neutral w-100"
            value="30"
            max="100"
          ></progress>
          <div class="flex justify-between align-middle">
            <h2 class="card-title">NAFA Campus Charging Station</h2>
          </div>
          <span class="text-slate-400">190 Middle Rd, Singapore 188979</span>
          <span class="text-slate-400"
            >Booked From: 10PM-12AM (5 Hours to booking)</span
          >
          <div class="card-actions mt-5">
            <button class="btn btn-primary btn-outline w-full">
              CANCEL BOOKING
            </button>
          </div>
        </div>
      </div>
    </div>
  </LayoutAuthenticated>
</template>
