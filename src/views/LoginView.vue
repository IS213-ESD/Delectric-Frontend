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
    <SectionFullScreen v-slot="{ cardClass }" class="bg-slate-100 flex-col">
      <FooterBar></FooterBar>

      <CardBox
        :class="cardClass"
        is-form
        @submit.prevent="submit"
        class="bg-slate-200"
      >
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
            <BaseButton type="submit" color="info" label="Login" />
            <BaseButton
              to="/register"
              color="info"
              outline
              label="No account?"
            />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>
