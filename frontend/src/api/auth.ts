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
    }
    
}

export default authApi;