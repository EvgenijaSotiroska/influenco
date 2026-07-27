import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./providers/authProvider.tsx";
import { SnackbarProvider } from "./providers/snackbarProvider.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import { Layout } from "./components/Layout/Layout.tsx";
import { HomePage } from "./pages/home/HomePage.tsx";
import { LoginPage } from "./pages/auth/LoginPage.tsx";
import { RegisterPage } from "./pages/auth/RegisterPage.tsx";
import { DashboardPage } from "./pages/DashboardPage.tsx";
import { InfluencerProfilePage } from "./pages/profile/InfluencerProfilePage.tsx";
import { InfluencerProfilePreviewPage } from "./pages/profile/Influencerprofilepreviewpage.tsx";
import { DiscoverPage } from "./pages/discover/DiscoverPage.tsx";
import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <SnackbarProvider>
                <AuthProvider>
                    <Routes>
                        <Route path="/" element={<Layout><HomePage /></Layout>} />
                        <Route path="/login" element={<Layout><LoginPage /></Layout>} />
                        <Route path="/register" element={<Layout><RegisterPage /></Layout>} />
                        <Route path="/discover" element={<Layout><DiscoverPage /></Layout>} />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Layout><DashboardPage /></Layout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/profile/edit"
                            element={
                                <ProtectedRoute allowedRole="Influencer">
                                    <Layout><InfluencerProfilePage /></Layout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/profile/preview"
                            element={
                                <ProtectedRoute allowedRole="Influencer">
                                    <Layout><InfluencerProfilePreviewPage /></Layout>
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </AuthProvider>
            </SnackbarProvider>
        </BrowserRouter>
    );
}

export default App;