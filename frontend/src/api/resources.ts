import axios from "axios";
import authApi from "./auth";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API_BASE_URL,
    withCredentials: true
})

// Add a request interceptor
axiosInstance.interceptors.response.use(function onFulfilled(response) {
    return response
}, async function onRejected(error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // Mark the request as retried to avoid infinite loops.
        try {
            await authApi.getNewAccessToken();
            return axiosInstance(originalRequest); // Retry the original request with the new access token.
        } catch (refreshError) {
            // redirect the user to login
            window.location.href = "/login";

            // clear JWT httpOnly cookies
            try {
                await authApi.logoutUser();
            } catch (logoutError) {
                console.error(logoutError);
            }

            return Promise.reject(refreshError);
        }
    }
    return Promise.reject(error); // For all other errors, return the error as is.
})


const resourcesApi = {

    async getUser() {
        try {
            const response = await axiosInstance.get("/users/me")
            return response.data;
        } catch(err) {
            console.error(err);
        }

    }
}

export default resourcesApi;