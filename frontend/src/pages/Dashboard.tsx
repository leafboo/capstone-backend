import { useEffect, useState } from "react"
import resourcesApi from "../api/resources";

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
        const getUserData = async() => {
            try {
                const {Id, UserName, Email, Salt, Hash} = await resourcesApi.getUser();
                setUserDetails({
                    userId: Id,
                    userName: UserName,
                    email: Email,
                    salt: Salt,
                    hash: Hash
                });
            } catch(err) {
                console.error(err);
            }
        }
        getUserData();
    }, []);

    console.log("user details:", UserDetails);

    
    
    // do some fetch request to the endpoint "/users/me"

    return (
        <>
            <h2>Welcome {UserDetails?.userName}</h2><br />
            
            <div>User Details:</div>
            <ul className="list-disc">
                <li>User Name: {UserDetails?.userName}</li>
                <li>User Email: {UserDetails?.email}</li>
                <li>More User details to be added...</li>
                <li>lorem ipsum</li>
            </ul>
        </>
    )
}