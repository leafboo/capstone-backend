const authApi = {
    
    async loginUser(userName: string, password: string) {
        const response = await fetch(`${import.meta.env.VITE_AUTH_SERVER_API_BASE_URL}/login`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userName: userName, password: password }),
        });

        if (!response.ok) {
            throw new Error("Login failed");
        }

        return response.json(); // returns your JWT or response object
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
        const response = await fetch(`${import.meta.env.VITE_AUTH_SERVER_API_BASE_URL}/token`, {
            method: 'POST',
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Failed to get a new access token");
        }

        console.log(await response.text());
    }
    
}

export default authApi;