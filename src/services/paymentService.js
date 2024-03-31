import axios from 'axios';

const BASE_URL = 'http://localhost:5004';

// Define the paymentService object
const paymentService = {
  // Method to perform login
  async addCard({number, exp_month, exp_year, cvc}) {
    console.log({number, exp_month, exp_year, cvc})
    try {
        // Send a POST request to the signin endpoint with email and password
        const response = await axios.post(`${BASE_URL}/create-payment-method`, { number, exp_month, exp_year, cvc });
      
      // Return the data from the response (e.g., user information, token, etc.)
      return response.data;
    } catch (error) {
        console.log(error)
        // If an error occurs (e.g., network error, server error), throw the error
        error.message = "Invalid Card, try again"
        throw error;
    }
  },
};

// Export the authService object for use in other parts of the application
export default paymentService;