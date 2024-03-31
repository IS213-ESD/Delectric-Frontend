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
  confirmPass: '',
  remember: false,
  verificationError: null
})

const loginStore = useLoginStore()
const signupStore = useSignupStore()
const router = useRouter()

function verifySignup(email, password, confirmPassword) {
  // Regular expression for email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Regular expression for password strength validation
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

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
    form.value.verificationError = verifySignup(form.value.login, form.value.pass, form.value.confirmPass)

    console.log(form)
    if (!form.value.verificationError){
        try {
            // console.log(form.value.login, form.value.pass, form.value.confirmPass)
            await signupStore.signup({
            "username": form.value.login,
            "password": form.value.pass,
            })
            await loginStore.login({
                "username": form.value.login,
                "password": form.value.pass,
                })
            router.push('/card')
        } catch (error) {
            // console.error('Login failed:', error)
            form.value.verificationError = "Email already in use"
        }
    }
}

</script>
<template>
  <LayoutGuest>
    <SectionFullScreen v-slot="{ cardClass }" bg="purplePink">
      <CardBox :class="cardClass" is-form @submit.prevent="submit">
        <FormField label="Email" help="Please enter your email">
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

        <FormField label="ConfirmPassword" help="Confirm your password">
          <FormControl
            v-model="form.confirmPass"
            :icon="mdiAsterisk"
            type="password"
            name="ConfirmPassword"
            autocomplete="confirm-password"
          />
        </FormField>

        <p v-if="loginStore.error" class="text-red-500 mt-5">{{ loginStore.error }}</p>
        <p v-if="form.verificationError != null" class="text-red-500 mt-5">{{ form.verificationError }}</p>
        <template #footer>
          <BaseButtons>
            <BaseButton type="submit" color="info" label="Register" />
            <BaseButton to="/login" color="info" outline label="Have an account" />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>
