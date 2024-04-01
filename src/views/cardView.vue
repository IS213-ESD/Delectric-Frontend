<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { mdiAccount, mdiPhone, mdiCard, mdiCalendar, mdiKey } from '@mdi/js';
import SectionFullScreen from '@/components/SectionFullScreen.vue';
import CardBox from '@/components/CardBox.vue';
import FormField from '@/components/FormField.vue';
import FormControl from '@/components/FormControl.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseButtons from '@/components/BaseButtons.vue';
import LayoutGuest from '@/layouts/LayoutGuest.vue';
import FooterBar from '@/components/FooterBar.vue';

import paymentService from '@/services/paymentService';
import authService from '@/services/authService';
import { useLoginStore } from '@/stores/login';

const loginStore = useLoginStore();

const personalDetails = ref({
  username: '',
  phoneNumber: '',
});

const cardDetails = ref({
  cardNumber: '',
  expiryDate: {
    month: '',
    year: '',
  },
  cvv: '',
});

const form = ref({
  verificationError: null,
});

const router = useRouter();

const submitParticulars = async () => {
  try {
    // Validate personal details
    if (!personalDetails.value.username || !personalDetails.value.phoneNumber) {
      throw new Error('Please fill in all personal details');
    }
    const sgPhoneNumberRegex = /^(?:\+65)?[689]\d{7}$/; // Singaporean phone number regex
    if (!sgPhoneNumberRegex.test(personalDetails.value.phoneNumber)) {
      throw new Error('Please enter a valid Singaporean phone number');
    }
    // Validate card details
    if (
      !cardDetails.value.cardNumber ||
      !cardDetails.value.expiryDate ||
      !cardDetails.value.cvv
    ) {
      throw new Error('Please fill in all card details');
    }

    // Perform particulars submission logic here
    // Example: Call API to submit user particulars
    console.log('Submitted personal details:', personalDetails.value);
    console.log('Submitted card details:', cardDetails.value);
    let response = await paymentService.addCard({
      number: cardDetails.value.cardNumber,
      exp_month: parseInt(cardDetails.value.expiryDate.month),
      exp_year: parseInt(cardDetails.value.expiryDate.year),
      cvc: cardDetails.value.cvv,
    });
    let payment_id = response?.payment_method_id;
    console.log(loginStore.userId);
    await authService.updateuserdetails({
      user_id: loginStore.userId,
      phone: personalDetails.value.phoneNumber,
      username: personalDetails.value.username,
    });
    await authService.updateuserpayment({
      user_id: loginStore.userId,
      token: payment_id,
    });

    router.push('/dashboard');
  } catch (error) {
    form.value.verificationError = error;
  }
};
</script>

<template>
  <LayoutGuest>
    <SectionFullScreen v-slot="{ cardClass }" class="bg-slate-900 flex-col">
      <FooterBar class="text-white"></FooterBar>

      <CardBox
        :class="cardClass"
        is-form
        @submit.prevent="submitParticulars"
        class="bg-slate-800"
      >
        <!-- Personal Details -->
        <div class="mb-12">
          <FormField
            label="Username"
            help="Please enter your username"
            class="text-slate-400"
          >
            <FormControl
              v-model="personalDetails.username"
              :icon="mdiAccount"
              name="username"
              autocomplete="username"
              placeholder="Enter your username"
            />
          </FormField>

          <FormField
            label="Phone Number"
            help="Please enter your phone number"
            class="text-slate-400"
          >
            <FormControl
              v-model="personalDetails.phoneNumber"
              :icon="mdiPhone"
              name="phoneNumber"
              autocomplete="tel"
              placeholder="Enter your phone number"
            />
          </FormField>
        </div>

        <!-- Card Details -->
        <div>
          <h2 class="text-sm font-bold text-slate-400">CARD DETAILS</h2>
          <FormField help="Please enter your card number" class="mt-4">
            <FormControl
              v-model="cardDetails.cardNumber"
              :icon="mdiCard"
              name="cardNumber"
              autocomplete="cc-number"
              placeholder="Enter your card number"
            />
          </FormField>

          <div class="flex space-x-4">
            <FormField help="Please enter the expiry month of your card">
              <FormControl
                v-model="cardDetails.expiryDate.month"
                :icon="mdiCalendar"
                name="expiryMonth"
                placeholder="MM"
              />
            </FormField>

            <FormField help="Please enter the expiry year of your card">
              <FormControl
                v-model="cardDetails.expiryDate.year"
                :icon="mdiCalendar"
                name="expiryYear"
                placeholder="YYYY"
              />
            </FormField>
          </div>

          <FormField help="Please enter the CVV of your card">
            <FormControl
              v-model="cardDetails.cvv"
              :icon="mdiKey"
              type="password"
              name="cvv"
              autocomplete="cc-csc"
              placeholder="Enter CVV"
            />
          </FormField>
        </div>
        <p v-if="form.verificationError != null" class="text-red-500 mt-5">
          {{ form.verificationError }}
        </p>
        <template #footer>
          <BaseButtons>
            <BaseButton type="submit" color="info" label="Submit" />
            <BaseButton
              to="/dashboard"
              color="info"
              outline
              label="Skip for now"
            />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>
