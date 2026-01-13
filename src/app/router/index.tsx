import React from "react"
import { Route, Routes } from "react-router-dom"
import { AuthRedirect } from "./AuthRediect"
import { AuthGuard } from "./AuthGuard"
import { MainLayout } from "../layouts/MainLayout" 
import { AcceptInvitationPage } from "@/pages/invitation/ui/AcceptInvitationPage"
import OAuthCallbackPage from "@/pages/login/ui/OAuthCallbackPage"
import { ProfilePage } from "@/pages/profile/index"

const RegisterPage = React.lazy(() => import("@/pages/register/ui/RegisterPage").then(module => ({ default: module.RegisterPage })))
const LoginPage = React.lazy(() => import("@/pages/login/ui/LoginPage").then(module => ({ default: module.LoginPage })))
const HomePage = React.lazy(() => import("@/pages/home/ui/HomePage").then(module => ({ default: module.HomePage })))
const WorkspacePage = React.lazy(() => import("@/pages/workspaces/ui/WorkspacePage").then(module => ({ default: module.WorkspacePage })))
const InputOTPForm = React.lazy(() => import("@/features/auth/login/ui/FormInputOTP").then(module => ({ default: module.InputOTPForm })))
const InputEmail = React.lazy(() => import("@/pages/changePassword/ui/inputEmail").then(module => ({ default: module.InputEmail })))
const InputOTPChangePassword = React.lazy(() => import("@/pages/changePassword/ui/inputOTP").then(module => ({ default: module.InputOTPChangePassword })))
const ChangePassword = React.lazy(() => import("@/pages/changePassword/ui/changePassword").then(module => ({ default: module.ChangePassword })))
const BoardPage = React.lazy(() => import("@/pages/board/ui/BoardPage").then(module => ({ default: module.BoardPage })))

export function AppRoutes() {
    return (
        <Routes>
            {/* Routes sidebar */}
            <Route path="/" element={
                <AuthRedirect>
                    <React.Suspense fallback>
                        <LoginPage />
                    </React.Suspense>
                </AuthRedirect>
            }></Route>

            <Route path="/oauth-callback" element={
                <React.Suspense fallback={<div>Loading...</div>}>
                    <OAuthCallbackPage />
                </React.Suspense>
            }></Route>
            
            <Route path="/register" element={
                <AuthRedirect>
                    <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center">
                        <div className="text-center">
                            <h1 className="text-6xl font-bold">Loading...</h1>
                        </div>
                    </div>}>
                        <RegisterPage />
                    </React.Suspense>
                </AuthRedirect>
            }></Route>
            
            <Route path="/input-otp" element={
                <React.Suspense fallback={<div>Loading...</div>}>
                    <InputOTPForm />
                </React.Suspense>
            }></Route>
            
            <Route path="/forgot-password" element={
                <React.Suspense fallback={<div>Loading...</div>}>
                    <InputEmail />
                </React.Suspense>
            }></Route>
            
            <Route path="/verify-otp" element={
                <React.Suspense fallback={<div>Loading...</div>}>
                    <InputOTPChangePassword />
                </React.Suspense>
            }></Route>
            
            <Route path="/change-password" element={
                <React.Suspense fallback={<div>Loading...</div>}>
                    <ChangePassword />
                </React.Suspense>
            }></Route>

            {/* Routes CẦN sidebar - Wrap trong MainLayout */}
            <Route element={
                <AuthGuard>
                    <MainLayout />
                </AuthGuard>
            }>
                {/* Nested routes - sẽ render vào <Outlet> */}
                <Route path="/home" element={
                    <React.Suspense fallback={<div>Loading...</div>}>
                        <HomePage />
                    </React.Suspense>
                } />
                
                <Route path="/board/:boardId" element={
                    <React.Suspense fallback={<div>Loading...</div>}>
                        <BoardPage />
                    </React.Suspense>
                } />

                <Route path="/workspaces/:workspaceId" element={
                    <React.Suspense fallback={<div>Loading...</div>}>
                        <WorkspacePage />
                    </React.Suspense>
                } />

                <Route path="/profile" element={
                    <React.Suspense fallback={<div>Loading...</div>}>
                        <ProfilePage />
                    </React.Suspense>
                } />
            </Route>

            <Route path="/boards/invitations/:token/accept" element={
                <AuthGuard>
                    <React.Suspense fallback={<div>Loading...</div>}>
                        <AcceptInvitationPage />
                    </React.Suspense>
                    </AuthGuard>
            }></Route>

            {/* 404 */}
            <Route path="*" element={
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-6xl font-bold">404</h1>
                        <p className="text-xl mt-4">Page Not Found</p>
                    </div>
                </div>
            }></Route>
        </Routes>
    )
}