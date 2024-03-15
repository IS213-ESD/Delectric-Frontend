<template>
  <div class="drawer drawer_bottom z-50">
    <input :id="drawerId" type="checkbox" class="drawer-toggle" />

    <div class="drawer-side">
      <label
        :for="drawerId"
        aria-label="close sidebar"
        class="drawer-overlay"
      ></label>
      <div
        class="bottomDrawer bg-zinc-900 menu p-6 w-full text-base-content h-1/2"
      >
        <form method="dialog"></form>
        <div class="mb-12 mt-6">
          <div>
            <h3 class="font-bold text-lg text-black">{{ drawerTitle }}</h3>
            <p class="text-md text-black">{{ drawerSubtitle }}</p>
          </div>
        </div>
        <form method="dialog" class="flex flex-col justify-around gap-2">
          <CustomButton
            width="full"
            roundness="round"
            color="green"
            @click="onDrawerClose"
          >
            {{ buttonTrue }}
          </CustomButton>

          <CustomButton
            width="full"
            roundness="round"
            color="ghost"
            @click="onDrawerClose"
          >
            {{ buttonFalse }}
          </CustomButton>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import CustomButton from '@/components/Button/CustomButton.vue';
import { toggleDrawer } from '@/helpers/common';

export default {
  name: 'CustomDrawer',
  components: {
    CustomButton,
  },
  props: {
    drawerId: {
      type: String,
      default: '',
    },
    pageName: {
      type: String,
      default: '',
    },
    contentHere: {
      type: String,
      default: '',
    },
    drawerTitle: {
      type: String,
      default: '',
    },
    drawerSubtitle: {
      type: String,
      default: '',
    },
    buttonFalse: {
      type: String,
      default: '',
    },
    buttonTrue: {
      type: String,
      default: '',
    },
  },
  methods: {
    onDrawerClose() {
      toggleDrawer(this.drawerId);
    },
    changeTab() {
      this.$router.push(this.pageName);
    },
  },
};
</script>

<style scoped>
.drawer_bottom .drawer-toggle:checked ~ .drawer-side > *:not(.drawer-overlay) {
  transform: translateY(0%);
}

.drawer_bottom .drawer-toggle ~ .drawer-side > *:not(.drawer-overlay) {
  transform: translateY(100%);
}

.bottomDrawer {
  background: white;
  color: black;
  position: absolute;
  bottom: 0;
  left: 0;
  border-radius: 20px 20px 0 0;
}
</style>
