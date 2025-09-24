const authApi = {
    
    async loginUser(userName: string, password: string) {
        const response = await fetch(`${import.meta.env.VITE_AUTH_SERVER_API_BASE_URL}/login`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userName: userName, password: password }),
        });

        if (!response.ok) { // if the status code is anything other than 2xx
            throw new Error("Login failed");
        }

        return response.text(); 
    },

    async logoutUser() {
        const response = await fetch(`${import.meta.env.VITE_AUTH_SERVER_API_BASE_URL}/logout`, {
            method: 'DELETE',
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Logout failed");
        }

        console.log("Successfully logged out");
    },

    async getNewAccessToken() {
        await fetch(`${import.meta.env.VITE_AUTH_SERVER_API_BASE_URL}/token`, {
            method: 'POST',
            credentials: "include"
        });

    }
    
}

export default authApi;