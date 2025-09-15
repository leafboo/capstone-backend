import { useEffect, useState } from "react"

type UserType = {
    userId: string;
    userName: string;
    email: string;
    salt: string;
    hash: string;
}

export default function Dashboard() {
    const [UserDetails, setUserDetails] = useState<UserType>();

    useEffect(() => {
        getUser();
    }, [UserDetails]);

    // put the urls for fetch in an environment variable
    async function getUser() {
        const response = await fetch("http://localhost:3000/users/me", {
            credentials: 'include'
        });
        const result = await response.json();
        setUserDetails(result);
        console.log(result);
    }
    
    
    // do some fetch request to the endpoint "/users/me"

    return (
        <>
            <h2>Welcome {UserDetails?.userName}</h2><br />
            
            <div>User Details:</div>
            <ul>
                <li>User Name: {UserDetails?.userName}</li>
                <li>User Email: {UserDetails?.email}</li>
                <li>More User details to be added...</li>
            </ul>
        </>
    )
}