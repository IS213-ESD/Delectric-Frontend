// Import necessary modules from Pinia
import { defineStore } from 'pinia'
import authService from '@/services/authService'

// Define the login store using Pinia
export const useLoginStore = defineStore({
  // Name of the store
  id: 'login',

  // State of the store
  state: () => ({
    // Define state properties here
    user: localStorage.getItem('user') || null,
    userId: localStorage.getItem('userId') || null,
    isLoggedIn: false,
    error: null,
    profileCompleted: localStorage.getItem('profileCompleted') || null,
    paymentToken: localStorage.getItem('payment') || null,
    userDetails: null
  }),

  // Actions to perform asynchronous operations
  actions: {
    async login({ username, password }) {
      try {
        // Perform login operation here
        // Example: Call API to authenticate user
        // If login successful, update state
        console.log(username, password)
        let result = await authService.login(username, password)
        this.user = username
        this.userId = result?.user_id
        this.isLoggedIn = true
        localStorage.setItem('user', username)
        localStorage.setItem('userId', result?.user_id)
        console.log("[LOGIN SUCCESS]", this.user, this.userId)
        let response = await authService.getuserdetails(this.userId)
        console.log(response)
        if (response?.phone == ""){
            this.profileCompleted = false
        }else{
            this.profileCompleted = true
        }
      } catch (error) {
        // If login fails, update error state
        throw error
      }
    },
    async getuserdetails(){
        try{
            let result = await authService.getuserdetails(this.userId)
            this.userDetails = result
            console.log(this.userDetails.username)
        }catch (error){
            throw error
        }
    },
    clearState(){
      this.user= localStorage.getItem('user') || null
      this.userId= localStorage.getItem('userId') || null
      this.isLoggedIn= false
      this.error= null
      this.profileCompleted= localStorage.getItem('profileCompleted') || null
      this.paymentToken= localStorage.getItem('payment') || null
      this.userDetails= null
    }

    // async logout({ commit }) {
    //   // Perform logout operation here
    //   // Example: Call API to logout user
    //   // If logout successful, reset state
    //   await authService.logout()
    //   commit('setUser', null)
    //   commit('setIsLoggedIn', false)
    // }
  }
})
