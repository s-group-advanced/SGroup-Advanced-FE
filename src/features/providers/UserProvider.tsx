// src/app/providers/UserProvider.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { userApi } from "@/features/home/api/userApi";
import type { UpdateProfileRequest } from "../auth/login/api/type";
import { authApi } from "../auth/login/api/authApi";

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
    clearUser: () => void;
    refreshUser: () => Promise<void>;
    handleUpdateProfile: (request: UpdateProfileRequest) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await userApi.getUserById();
            const userData = response as unknown as User;
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (err) {
            console.error("Failed to fetch user:", err);
            setError("Failed to fetch user data");
            localStorage.removeItem('user');
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const clearUser = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const refreshUser = async () => {
        await fetchUser();
    };

    // update profile
    const handleUpdateProfile = async (request: UpdateProfileRequest) => {
        try {
            await authApi.updateProfile(request);
            
            await fetchUser();
        } catch (err) {
            console.error("Failed to update profile:", err);
        }
    } 
    const value: UserContextType = {
        user,
        isLoading,
        error,
        clearUser,
        refreshUser,
        handleUpdateProfile,
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