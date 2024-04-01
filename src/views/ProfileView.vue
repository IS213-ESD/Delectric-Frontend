<script setup>
import { reactive, computed, ref } from 'vue';
import { useMainStore } from '@/stores/main';
import { useLoginStore } from '@/stores/login';
import {
  mdiAccount,
  mdiMail,
  mdiAsterisk,
  mdiFormTextboxPassword,
  mdiGithub,
} from '@mdi/js';
import SectionMain from '@/components/SectionMain.vue';
import CardBox from '@/components/CardBox.vue';
import BaseDivider from '@/components/BaseDivider.vue';
import FormField from '@/components/FormField.vue';
import FormControl from '@/components/FormControl.vue';
import FormFilePicker from '@/components/FormFilePicker.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseButtons from '@/components/BaseButtons.vue';
import UserCard from '@/components/UserCard.vue';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
import { useRouter } from 'vue-router';

const mainStore = useMainStore();
const loginStore = useLoginStore();
const router = useRouter();

const userDetails = computed(() => loginStore.userDetails);
const profileForm = reactive({
  name: userDetails?.username || '',
  email: userDetails?.email || '',
});

const passwordForm = reactive({
  password_current: '',
  password: '',
  password_confirmation: '',
});

const submitProfile = () => {
  mainStore.setUser(profileForm);
};

const submitPass = () => {
  //
};

const logoutRedirect = () => {
  router.push('/login');
};
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiAccount" title="Profile" main>
      </SectionTitleLineWithButton>

      <UserCard class="mb-6" />

      <div class="grid grid-cols-1">
        <CardBox>
          <FormField label="E-mail">
            <FormControl
              v-model="userDetails.username"
              :icon="mdiMail"
              type="email"
              name="email"
              required
              disabled="disabled"
            />
          </FormField>
          <FormField label="Phone">
            <FormControl
              v-model="userDetails.phone"
              :icon="mdiMail"
              type="phone"
              name="phone"
              required
              disabled="disabled"
            />
          </FormField>
          <template #footer>
            <BaseButtons>
              <BaseButton
                color="danger"
                label="LOGOUT"
                @click="logoutRedirect()"
                class="w-full"
              />
            </BaseButtons>
          </template>
        </CardBox>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
