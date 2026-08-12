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
import { BrandProfilePreviewPage } from "./pages/profile/BrandProfilePreviewPage.tsx";
import { BrandProfilePage } from "./pages/profile/BrandProfilePage.tsx";
import { DiscoverPage } from "./pages/discover/DiscoverPage.tsx";
import { CampaignFormPage } from "./pages/campaigns/CampaignFormPage.tsx";
import { CampaignsListPage } from "./pages/campaigns/CampaignsListPage.tsx";
import { BrowseCampaignsPage } from "./pages/campaigns/BrowseCampaignsPage.tsx";
import { ReviewApplicantsPage } from "./pages/campaigns/ReviewApplicantsPage.tsx";
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
                        <Route
                            path="/profile/preview/:id"
                            element={
                                <ProtectedRoute>
                                    <Layout><InfluencerProfilePreviewPage /></Layout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/brand/profile/edit"
                            element={
                                <ProtectedRoute allowedRole="Brand">
                                    <Layout><BrandProfilePage /></Layout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/brand/profile/preview"
                            element={
                                <ProtectedRoute allowedRole="Brand">
                                    <Layout><BrandProfilePreviewPage /></Layout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/brand/campaigns"
                            element={
                                <ProtectedRoute allowedRole="Brand">
                                    <Layout><CampaignsListPage /></Layout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/brand/campaigns/new"
                            element={
                                <ProtectedRoute allowedRole="Brand">
                                    <Layout><CampaignFormPage /></Layout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/brand/campaigns/:id/edit"
                            element={
                                <ProtectedRoute allowedRole="Brand">
                                    <Layout><CampaignFormPage /></Layout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/campaigns"
                            element={<Layout><BrowseCampaignsPage /></Layout>}
                        />
                        <Route
                            path="/brand/campaigns/:id/applicants"
                            element={
                                <ProtectedRoute allowedRole="Brand">
                                    <Layout><ReviewApplicantsPage /></Layout>
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