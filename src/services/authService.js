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
      const response = await axios.post('http://localhost:5002/signup', { email, password })
      console.log(response)
      return response.data
    } catch (error) {
      // If signup fails, throw error
      error.message = error?.response?.data?.message
      throw error
    }
  }
};

// Export the authService object for use in other parts of the application
export default authService;