<script setup>
import { computed, ref, onMounted } from 'vue';
import { useMainStore } from '@/stores/main';
import {
  mdiAccountMultiple,
  mdiCartOutline,
  mdiChartTimelineVariant,
  mdiReload,
  mdiChartPie,
  mdiListBox,
} from '@mdi/js';
import Charge from '@/images/charge.vue';
import * as chartConfig from '@/components/Charts/chart.config.js';
import LineChart from '@/components/Charts/LineChart.vue';
import SectionMain from '@/components/SectionMain.vue';
import CardBoxWidget from '@/components/CardBoxWidget.vue';
import CardBox from '@/components/CardBox.vue';
import TableSampleClients from '@/components/TableSampleClients.vue';
import NotificationBar from '@/components/NotificationBar.vue';
import BaseButton from '@/components/BaseButton.vue';
import CardBoxTransaction from '@/components/CardBoxTransaction.vue';
import CardBoxClient from '@/components/CardBoxClient.vue';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
import SectionBannerStarOnGitHub from '@/components/SectionBannerStarOnGitHub.vue';
import GoogleMaps from '@/components/Maps/Maps.vue';
import CustomDrawer from '@/components/Drawer/CustomDrawer.vue';
import { toggleDrawer } from '@/helpers/common';

const mapView = ref(true); // Set default view to map view
const chartData = ref(null);
const listItems = ref([]); // Array to hold list items

const fillChartData = () => {
  chartData.value = chartConfig.sampleChartData();
};

onMounted(() => {
  fillChartData();
  addSampleItems();
});

const mainStore = useMainStore();

const clientBarItems = computed(() => mainStore.clients.slice(0, 4));

const transactionBarItems = computed(() => mainStore.history);

const toggleView = () => {
  mapView.value = !mapView.value; // Toggle view between map and list
};

const addSampleItems = () => {
  // Add sample items to the list
  listItems.value.push(
    {
      id: 1,
      name: 'NAFA Campus 1',
      street: '21 Tampines Avenue 1, Singapore 599242',
      distance: 0.55,
    },
    { id: 2, name: 'Odeon Towers', street: 'ljfnvjnv', distance: 0.44 },
    { id: 3, name: 'Fortune Centre', street: 'ljfnvjnv', distance: 0.35 }
  );
};

const cardContent = ref([
  { id: 1, name: 'NAFA Campus 1', street: 'ljfnvjnv', distance: 0.55 },
]);

const logValues = (item) => {
  console.log('Clicked Item:', item.name);
  cardContent.value = [];
  cardContent.value.push({
    id: item.id,
    name: item.name,
    street: item.street,
    distance: 0.55,
  });
  console.log(cardContent);
  toggleDrawer('1');
};

const onDrawerClose = () => {
  toggleDrawer(this.drawerId);
};
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiChartTimelineVariant"
        title="Charging Locations"
      >
        <BaseButton
          @click="toggleView"
          target="_blank"
          :icon="mdiListBox"
          :label="mapView ? 'List View' : 'Map View'"
          color="contrast"
          rounded-full
          small
        />
      </SectionTitleLineWithButton>
      <div>
        <!-- Toggle button -->
        <!-- <button @click="toggleView">{{ mapView ? 'List View' : 'Map View' }}</button> -->

        <!-- Display map or list based on toggle state -->
        <div v-if="!mapView">
          <!-- Map View -->
          <!-- Your map component goes here -->
          <div id="map">
            <!-- Map rendering goes here -->
            <GoogleMaps></GoogleMaps>
          </div>
        </div>
        <div v-else>
          <!-- List View -->
          <!-- Your list component goes here -->
          <!-- <ul>
            <li v-for="item in listItems" :key="item.id">{{ item.name }}</li>
          </ul> -->
          <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
            <CardBoxWidget
              v-for="item in listItems"
              :key="item.id"
              trend="12%"
              trend-type="up"
              color="text-emerald-500"
              :icon="mdiAccountMultiple"
              :distance="item.distance"
              :label="item.name"
              :street="item.street"
              @click="logValues(item)"
            />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
        <CardBoxWidget
          trend="12%"
          trend-type="up"
          color="text-emerald-500"
          :icon="mdiAccountMultiple"
          :number="512"
          label="Clients"
        />
        <CardBoxWidget
          trend="12%"
          trend-type="down"
          color="text-blue-500"
          :icon="mdiCartOutline"
          :number="7770"
          prefix="$"
          label="Sales"
        />
        <CardBoxWidget
          trend="Overflow"
          trend-type="alert"
          color="text-red-500"
          :icon="mdiChartTimelineVariant"
          :number="256"
          suffix="%"
          label="Performance"
        />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div class="flex flex-col justify-between">
          <CardBoxTransaction
            v-for="(transaction, index) in transactionBarItems"
            :key="index"
            :amount="transaction.amount"
            :date="transaction.date"
            :business="transaction.business"
            :type="transaction.type"
            :name="transaction.name"
            :account="transaction.account"
          />
        </div>
        <div class="flex flex-col justify-between">
          <CardBoxClient
            v-for="client in clientBarItems"
            :key="client.id"
            :name="client.name"
            :login="client.login"
            :date="client.created"
            :progress="client.progress"
          />
        </div>
      </div>

      <CustomDrawer
        :drawer-id="1"
        :page-name="hello"
        :drawer-title="cardContent[0].name"
        :drawer-subtitle="cardContent[0].street"
        button-false="Not now"
        button-true="Scan QR"
      >
        {{ hello }}
      </CustomDrawer>

      <SectionBannerStarOnGitHub class="mt-6 mb-6" />

      <SectionTitleLineWithButton :icon="mdiChartPie" title="Trends overview">
        <BaseButton
          :icon="mdiReload"
          color="whiteDark"
          @click="fillChartData"
        />
      </SectionTitleLineWithButton>

      <CardBox class="mb-6">
        <div v-if="chartData">
          <line-chart :data="chartData" class="h-96" />
        </div>
      </CardBox>

      <SectionTitleLineWithButton :icon="mdiAccountMultiple" title="Clients" />

      <NotificationBar color="info" :icon="mdiMonitorCellphone">
        <b>Responsive table.</b> Collapses on mobile
      </NotificationBar>

      <CardBox has-table>
        <TableSampleClients />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
