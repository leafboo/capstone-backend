const resourcesApi = {

    // put the urls for fetch in an environment variable
    async getUser() {
        const response = await fetch("http://localhost:3000/users/me", {
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