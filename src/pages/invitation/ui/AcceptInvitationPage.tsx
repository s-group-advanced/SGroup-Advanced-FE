// src/pages/invitation/ui/AcceptInvitationPage.tsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBoards } from "@/features/boards";

export function AcceptInvitationPage() {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const { acceptInvitationToBoard } = useBoards();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setErrorMessage("Invalid invitation link");
            return;
        }

        const acceptInvite = async () => {
            try {
                const board = await acceptInvitationToBoard({ token });
                setStatus("success");
                
                // Redirect to board after 2 seconds
                setTimeout(() => {
                    navigate(`/board/${board.id}`);
                }, 2000);
            } catch (error: any) {
                setStatus("error");
                setErrorMessage(error?.response?.data?.message || "Failed to accept invitation");
            }
        };

        acceptInvite();
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                {status === "loading" && (
                    <>
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <h2 className="text-xl font-semibold">Accepting invitation...</h2>
                    </>
                )}
                
                {status === "success" && (
                    <>
                        <div className="text-green-500 text-6xl mb-4">✓</div>
                        <h2 className="text-xl font-semibold mb-2">Success!</h2>
                        <p className="text-gray-600">You've joined the board. Redirecting...</p>
                    </>
                )}
                
                {status === "error" && (
                    <>
                        <div className="text-red-500 text-6xl mb-4">✗</div>
                        <h2 className="text-xl font-semibold mb-2">Error</h2>
                        <p className="text-gray-600 mb-4">{errorMessage}</p>
                        <button
                            onClick={() => navigate("/home")}
                            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Go to Home
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}