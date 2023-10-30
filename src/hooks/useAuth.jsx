import { useState, useEffect } from "react";

const useAuth = () => {
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
    useEffect(() => {
        fetch("/auth")
            .then((res) => res.json())
            .then((data) => {
                setIsUserAuthenticated(data.auth);
            });
    }, []);
    return isUserAuthenticated;
};

export default useAuth;