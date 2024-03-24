import axios from 'axios';

const bookingsModule = {
  state: {
    user: {
      bookingListings: [],
    },
  },
  getters: {
    getBOOKINGS(state) {
      return state.user.bookingListings;
    },
  },
  mutations: {
    SET_BOOKING_LISTINGS(state, payload) {
      state.user.bookingListings = payload;
    },
  },
  actions: {},
};

export { bookingsModule };
