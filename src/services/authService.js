import axios from 'axios';

const BASE_URL = 'http://localhost:5002';

// Define the authService object
const authService = {
  // Method to perform login
  async login(email, password) {
    try {
      // Send a POST request to the signin endpoint with email and password
      const response = await axios.post(`${BASE_URL}/signin`, { email, password });
      
      // Return the data from the response (e.g., user information, token, etc.)
      return response.data;
    } catch (error) {
      // If an error occurs (e.g., network error, server error), throw the error
      error.message = error?.response?.data?.message
      throw error;
    }
  },
  async signup(email, password) {
    try {
      // Perform signup operation here
      // Example: Call API to register new user
      // If signup successful, return success message
      const response = await axios.post(`${BASE_URL}/signup`, {email, password, phone: ""})
      console.log(response)
      return response.data
    } catch (error) {
      // If signup fails, throw error
      error.message = error?.response?.data?.message
      throw error
    }
  },
  async getuserdetails(user_id) {
    try {
      // Perform signup operation here
      // Example: Call API to register new user
      // If signup successful, return success message
      const response = await axios.get(`${BASE_URL}/getuserdetails/${user_id}`)
      return response.data
    } catch (error) {
      // If signup fails, throw error
      error.message = error?.response?.data?.message
      throw error
    }
  },
  async updateuserdetails({phone, username}) {
    try {
      const response = await axios.post(`${BASE_URL}/userdetails`, {
        phone,
        username,
        user_id,
        "homeaddress": "",
      })
      return response.data
    } catch (error) {
      error.message = error?.response?.data?.message
      throw error
    }
  },
  async updateuserpayment({user_id, token}) {
    try {
      const response = await axios.post(`${BASE_URL}/paymentdetails`, {
        "user_id": user_id,
        "token": {
          "id": token
        }
      })
      return response.data
    } catch (error) {
      error.message = error?.response?.data?.message
      throw error
    }
  }
};

// Export the authService object for use in other parts of the application
export default authService;