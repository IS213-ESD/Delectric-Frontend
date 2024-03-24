import axios from 'axios';

const chargersModule = {
  state: {
    user: {
      chargerListings: [],
    },
  },
  getters: {
    getCHARGERS(state) {
      return state.user.chargerListings;
    },
  },
  mutations: {
    SET_CHARGER_LISTINGS(state, payload) {
      state.user.chargerListings = payload;
    },
  },
  actions: {},
};

export { chargersModule };
