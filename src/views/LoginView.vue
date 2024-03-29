<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { mdiAccount, mdiAsterisk } from '@mdi/js'
import SectionFullScreen from '@/components/SectionFullScreen.vue'
import CardBox from '@/components/CardBox.vue'
import FormCheckRadio from '@/components/FormCheckRadio.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import LayoutGuest from '@/layouts/LayoutGuest.vue'

import { ref } from 'vue'
import { useLoginStore } from '@/stores/login'
import { useSignupStore } from '@/stores/signup'

const form = ref({
  login: '',
  pass: '',
  remember: false
})

const loginStore = useLoginStore()
const signupStore = useSignupStore()
const router = useRouter()

const submit = async () => {
  try {
    console.log(form.value.login, form.value.pass)
    await loginStore.login({
      "username": form.value.login,
      "password": form.value.pass
    })
    router.push('/dashboard')
  } catch (error) {
    console.error('Login failed:', error)
    // Handle login error (e.g., display error message)
  }
}

</script>
<template>
  <LayoutGuest>
    <SectionFullScreen v-slot="{ cardClass }" bg="purplePink">
      <CardBox :class="cardClass" is-form @submit.prevent="submit">
        <FormField label="Login" help="Please enter your login">
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
        <p v-if="loginStore.error" class="text-red-500 mt-5">{{ loginStore.error }}</p>
        <template #footer>
          <BaseButtons>
            <BaseButton type="submit" color="info" label="Login" />
            <BaseButton to="/register" color="info" outline label="No account?" />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>
