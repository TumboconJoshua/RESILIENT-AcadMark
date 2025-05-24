import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Add a request interceptor
API.interceptors.request.use(
    (config) => {
        // You can add any request headers or authentication tokens here
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
API.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle common errors here
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('API Error:', error.response.data);
            
            // Handle specific error cases
            switch (error.response.status) {
                case 401:
                    // Handle unauthorized
                    break;
                case 403:
                    // Handle forbidden
                    break;
                case 404:
                    // Handle not found
                    break;
                case 500:
                    // Handle server error
                    break;
                default:
                    // Handle other errors
                    break;
            }
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error setting up request:', error.message);
        }
        
        return Promise.reject(error);
    }
);

export default API;