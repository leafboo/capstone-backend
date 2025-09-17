const resourcesApi = {

    // put the urls for fetch in an environment variable
    async getUser() {
        const response = await fetch(`${import.meta.env.VITE_SERVER_API_BASE_URL}/users/me`, {
            credentials: 'include'
        });
        //setUserDetails(result);

        if (!response.ok) {
            throw new Error("Failed to get user resources");
        }

        return response.json();

    }
}

export default resourcesApi;