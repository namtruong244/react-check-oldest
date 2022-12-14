import axios from "axios";

const baseURL = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PROD_API_URL : process.env.REACT_APP_DEV_API_URL

const axiosClient = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json'
    },
})

// Add a request interceptor
axiosClient.interceptors.request.use((config) =>
    // Do something before request is sent
     config
, (error) =>
    // Do something with request error
     Promise.reject(error)
);

// Add a response interceptor
axiosClient.interceptors.response.use((response) =>
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
     response.data
, (error) =>
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
     Promise.reject(error)
);

export default axiosClient;
