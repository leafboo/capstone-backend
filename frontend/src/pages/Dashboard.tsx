import { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import resourcesApi from "../api/resources";
import authApi from "../api/auth";

type UserType = {
    userId: string;
    userName: string;
    email: string;
    salt: string;
    hash: string;
}



export default function Dashboard() {
    const [UserDetails, setUserDetails] = useState<UserType>();
    const { setIsAuthenticated } = useContext(AuthContext);

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


    async function handleLogout() {
        try {
            await authApi.logoutUser();
            setIsAuthenticated(false);
        } catch(err) {
            console.error(err);
        }
    }


    
    
    // do some fetch request to the endpoint "/users/me"

    return (
        <>
            <h2>Welcome {UserDetails?.userName}</h2><br />
            
            <div>User Details:</div>
            <ul className="list-disc">
                <li>User Name: {UserDetails?.userName}</li>
                <li>User Email: {UserDetails?.email}</li>
                <li>More User details to be added...</li>
            </ul> <br />


            <form action="">
                <input type="text" placeholder="Enter workspace name" required />
                <button className="border border-black p-[.5rem] mt-[1.5rem] cursor-pointer" >Generate workspace</button>
            </form>
            <span>Your workspaces: </span>
            <div>Workspaces here</div>


            <button className="border border-black p-[.5rem] mt-[1.5rem] cursor-pointer" onClick={handleLogout} >Log out</button> 
        </>
    )
}