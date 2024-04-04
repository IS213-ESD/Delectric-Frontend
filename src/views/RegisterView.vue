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
import carvid from '@/assets/electra.mp4';

import { ref } from 'vue';
import { useLoginStore } from '@/stores/login';
import { useSignupStore } from '@/stores/signup';

const form = ref({
  login: '',
  pass: '',
  confirmPass: '',
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

function verifySignup(email, password, confirmPassword) {
  // Regular expression for email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Regular expression for password strength validation
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  // Check if email format is valid
  if (!emailRegex.test(email)) {
    return 'Invalid email format';
  }

  // Check if password meets minimum requirements
  if (!passwordRegex.test(password)) {
    return 'Password must be at least 8 characters long and contain at least one letter, one number, and one special character';
  }

  // Check if password and confirm password match
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }

  // Verification successful
  return null;
}

const submit = async () => {
  form.value.verificationError = verifySignup(
    form.value.login,
    form.value.pass,
    form.value.confirmPass
  );

  console.log(form);
  if (!form.value.verificationError) {
    try {
      // console.log(form.value.login, form.value.pass, form.value.confirmPass)
      await signupStore.signup({
        username: form.value.login,
        password: form.value.pass,
      });
      await loginStore.login({
        username: form.value.login,
        password: form.value.pass,
      });
      router.push('/card');
    } catch (error) {
      // console.error('Login failed:', error)
      form.value.verificationError = 'Email already in use';
    }
  }
};
</script>
<template>
  <LayoutGuest>
    <SectionFullScreen
      v-slot="{ cardClass }"
      class="bg-slate-100 flex-col animated-background h-screen bg-gradient-to-r from-slate-100 via-teal-100 to-teal-400"
    >
      <FooterBar></FooterBar>
      <h3 class="font-bold text-2xl m-6 mt-2 text-slate-100">
        Empowering EV drivers to connect, charge, and share power seamlessly.
      </h3>

      <CardBox
        :class="cardClass"
        class="bg-slate-900"
        is-form
        @submit.prevent="submit"
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
        <FormField
          label="Email"
          help="Please enter your email"
          class="text-slate-400"
        >
          <FormControl
            v-model="form.login"
            :icon="mdiAccount"
            name="login"
            autocomplete="username"
          />
        </FormField>

        <FormField
          label="Password"
          help="Please enter your password"
          class="text-slate-400"
        >
          <FormControl
            v-model="form.pass"
            :icon="mdiAsterisk"
            type="password"
            name="password"
            autocomplete="current-password"
          />
        </FormField>

        <FormField
          label="Confirm Password"
          help="Confirm your password"
          class="text-slate-400"
        >
          <FormControl
            v-model="form.confirmPass"
            :icon="mdiAsterisk"
            type="password"
            name="ConfirmPassword"
            autocomplete="confirm-password"
          />
        </FormField>

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
              color="bg-teal-300 font-bold"
              label="Register"
            />
            <BaseButton
              to="/login"
              color="bg-teal-100"
              label="I have an account"
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
