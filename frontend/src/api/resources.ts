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
    // ----------------------------user----------------------------------
    async getUserDetails() {
        try {
            const response = await axiosInstance.get("/users/me");
            return response.data;
        } catch(err) {
            console.error(err);
        }

    },

    async addUser() {
        try {
            const response = await axiosInstance.post("/users", {
                userName: "",
                email: "",
                password: ""
            });
            console.log(response);
        } catch(err) {
            console.error(err);
        }
    },

    async deleteUser() {
        try {
            const response = await axiosInstance.delete("/users/me");
            console.log(response);
        } catch(err) {
            console.error(err);
        }
    },
    // ----------------------------workspaces----------------------------------
    async getWorkspaces() {
        try {
            const response = await axiosInstance.get("/workspaces");
            return response.data;
        } catch(err) {
            console.error(err);
        }
    }, 

    async getWorkspace(workspaceId: number) {
        try {
            const response = await axiosInstance.get(`/workspaces/${workspaceId}`);
            console.log(response);
        } catch(err) {
            console.error(err);
        }
    },

    async addWorkspace() {
        try {
            const response = await axiosInstance.post("/workspaces", {
                workspaceName: "",
                dateCreated: "",
                numberOfPapers: ""
            });
            console.log(response);
        } catch(err) {
            console.error(err);
        }
    },

    async deleteWorkspace(workspaceId: number) {
        try {
            const response = await axiosInstance.delete(`/workspaces/${workspaceId}`);
            console.log(response);
        } catch(err) {
            console.error(err);
        }
    },
    // ----------------------------researchPaper----------------------------------
    async addResearchPaper(workspaceId: number) {
        try {
            const response = await axios.post(`/workspaces/${workspaceId}/researchPapers`, {
                title: "",
                yearOfPublication: "",
                keywords: "",
                abstract: "",
                methods: "",
                findings: "",
                apa: "",
                ieee: ""
            });
            console.log(response);
        } catch (err) {
            console.error(err);
        }
    },

    async getResearchPapers(workspaceId: number) {
        try {
            const response = await axiosInstance.get(`/workspaces/${workspaceId}/reserachPapers`);
            console.log(response);
        } catch (err) {
            console.error(err);
        }
    },

    async deleteResearchPaper(researchPaperId: number) {
        try {
            const response = await axiosInstance.delete(`/researchPapers/${researchPaperId}`);
            console.log(response.data);
        } catch(err) {
            console.error(err);
        }
    }
 }

export default resourcesApi;