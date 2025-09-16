const authApi = {
    
    async loginUser(userName: string, password: string) {
        const response = await fetch("http://localhost:4000/login", {
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