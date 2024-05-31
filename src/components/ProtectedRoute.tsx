import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { IUser } from "../interfaces";
import { apiBaseUrl } from "../config";

const ProtectedRoute = () => {
    const [loading, setLoading] =useState<boolean>(true);
    const [user, setUser] = useState<IUser | null>(null);
    const [error, setError] = useState<string | null>(null)
    
    useEffect(() => {
        const fetchUser = async (token: string) => {
            const response = await fetch(`${apiBaseUrl}/users/validateToken`, {
                        mode: "cors",
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
            })
            const data = await response.json();
            return data;            
        }

        const token = localStorage.getItem("login-token");
        if (token !== null) {
            //There is a token, attempt to verify token.
            fetchUser(token)
                .then((data) => {
                    if (data.user !== undefined) {
                        setUser(data.user)
                    }
                }).catch((error) => {
                    setError(error)
                }).finally(()=> setLoading(false));
        } else {
            setLoading(false);
        }
    }, [])    
    
    if (!user && !loading) {
        return <Navigate to="/login" replace/>
    } else if (user && !loading) {
        return <Outlet />;
    }
    return (< div className = "text-center relative top-1/2" > {!error ? "Loading page...": error }</div >)
}

export default ProtectedRoute