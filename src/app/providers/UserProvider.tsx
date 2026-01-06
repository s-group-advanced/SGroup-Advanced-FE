// src/app/providers/UserProvider.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { userApi } from "@/features/home/api/userApi";

interface User {
    id: string;
    name: string;
    email: string;
    avatar_url: string | null;
}

interface UserContextType {
    user: User | null;
    isLoading: boolean;
    error: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const cached = localStorage.getItem('user');
        return cached ? JSON.parse(cached) : null;
    });
    const [isLoading, setIsLoading] = useState(!user);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            fetchUser();
        }
    }, []);

    const fetchUser = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await userApi.getUserById();
            setUser(response as unknown as User);
            localStorage.setItem('user', JSON.stringify(response));
        } catch (err) {
            console.error("Failed to fetch user:", err);
            setError("Failed to fetch user data");
        } finally {
            setIsLoading(false);
        }
    };

    const value: UserContextType = {
        user,
        isLoading,
        error,
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}