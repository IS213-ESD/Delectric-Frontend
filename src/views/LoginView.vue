<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { mdiAccount, mdiAsterisk } from '@mdi/js';
import SectionFullScreen from '@/components/SectionFullScreen.vue';
import CardBox from '@/components/CardBox.vue';
import FormCheckRadio from '@/components/FormCheckRadio.vue';
import FormField from '@/components/FormField.vue';
import FormControl from '@/components/FormControl.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseButtons from '@/components/BaseButtons.vue';
import LayoutGuest from '@/layouts/LayoutGuest.vue';
import FooterBar from '@/components/FooterBar.vue';
import carvid from '@/assets/carvid.mp4';

import { ref } from 'vue';
import { useLoginStore } from '@/stores/login';
import { useSignupStore } from '@/stores/signup';

const form = ref({
  login: '',
  pass: '',
  remember: false,
  verificationError: null,
});

const loginStore = useLoginStore();
const signupStore = useSignupStore();
const router = useRouter();

const videoPlayer = ref(null);

const restartVideo = () => {
  videoPlayer.value.currentTime = 0;
  videoPlayer.value.play();
};

const submit = async () => {
  try {
    // console.log(form.value.login, form.value.pass)
    await loginStore.login({
      username: form.value.login,
      password: form.value.pass,
    });

    if (
      loginStore.profileCompleted != null &&
      loginStore.profileCompleted != false
    ) {
      router.push('/dashboard');
    } else {
      router.push('/card');
    }
  } catch (error) {
    // console.error('Login failed:', error)
    form.value.verificationError = 'Invalid email or password';
  }
};
</script>
<template>
  <LayoutGuest>
    <SectionFullScreen
      v-slot="{ cardClass }"
      class="bg-slate-900 flex-col bg-slate-100 flex-col animated-background h-screen bg-gradient-to-r from-slate-900 via-teal-900 to-teal-600"
    >
      <FooterBar class="text-white"></FooterBar>
      <h3 class="font-bold text-2xl m-6 mt-2 text-slate-900">
        Empowering EV drivers to connect, charge, and share power seamlessly.
      </h3>

      <CardBox
        :class="cardClass"
        is-form
        @submit.prevent="submit"
        class="bg-slate-200"
      >
        <div class="mb-2">
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
        <FormField label="Login" help="Please enter your email">
          <FormControl
            v-model="form.login"
            :icon="mdiAccount"
            name="login"
            autocomplete="username"
          />
        </FormField>

        <FormField label="Password" help="Please enter your password">
          <FormControl
            v-model="form.pass"
            :icon="mdiAsterisk"
            type="password"
            name="password"
            autocomplete="current-password"
          />
        </FormField>

        <FormCheckRadio
          v-model="form.remember"
          name="remember"
          label="Remember"
          :input-value="true"
        />
        <p v-if="loginStore.error" class="text-red-500 mt-5">
          {{ loginStore.error }}
        </p>
        <p v-if="form.verificationError != null" class="text-red-500 mt-5">
          {{ form.verificationError }}
        </p>
        <template #footer>
          <BaseButtons>
            <BaseButton
              type="submit"
              color="bg-teal-300"
              label="Login"
              class="font-bold"
            />
            <BaseButton
              to="/register"
              color="bg-teal-100"
              outline
              label="No account?"
            />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>

<style scoped>
.animated-background {
  background-size: 400%;

  -webkit-animation: animation 3s ease infinite;
  -moz-animation: animation 3s ease infinite;
  animation: animation 3s ease infinite;
}

@keyframes animation {
  0%,
  100% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }
}
</style>
