// Import necessary modules from Pinia
import { defineStore } from 'pinia'
import authService from '@/services/authService'

// Define the login store using Pinia
export const useSignupStore = defineStore({
  // Name of the store
  id: 'signup',

  // State of the store
  state: () => ({
    // Define state properties here
    user: null,
    isLoggedIn: false,
    error: null
  }),

  // Actions to perform asynchronous operations
  actions: {
    async signup({ username, password }) {
      try {
        // Perform login operation here
        // Example: Call API to authenticate user
        // If login successful, update state
        console.log(username, password)
        await authService.signup(username, password)
        this.user = username
        console.log(this.user)
      } catch (error) {
        // If login fails, update error state
        throw error
      }
    }
  }
})
