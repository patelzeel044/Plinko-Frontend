import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom"; 
import { AuthLayout, } from "./components/AuthLayout";
import { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "./store/Slices/authSlice";
import Layout from "./components/Layout";
import PlinkoPage from "./components/game/PlinkoPage.jsx";
import PlinkoSimulation from "./components/game/PlinkoSimulation.jsx";
import WalletPage from "./components/WalletPage.jsx";
import AdminLayout from "./components/admin/AdminLayout.jsx";
import TransactionManagement from "./components/admin/TransactionManagement.jsx";
import UserManagement from "./components/admin/UserManagement.jsx";
import UserById from "./components/admin/UserById.jsx";
import LoginPopup from "./components/LoginPopup.jsx";
import SignupPopup from "./components/SignupPopup.jsx";
import PlinkoRoundManagement from "./components/admin/PlinkoRoundManagement.jsx";
import AdminDashboard from "./components/admin/AdminDashboard";
import TransactionPage1 from "./components/TransactionPage1";
import { pendingRound } from "./store/Slices/plinkoGSlice";
import { getWalletBalance } from "./store/Slices/walletSlice";

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
      (async()=>{ 
        const user = await dispatch(getCurrentUser());
        if (user?.type === "getCurrentUser/fulfilled") {
            dispatch(pendingRound()).then(()=>dispatch(getWalletBalance()))
        }
      })();
       
    }, [dispatch]);

    return (
        <>
            <Routes>
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={
                  <AuthLayout authentication admin>
                    <AdminDashboard />
                  </AuthLayout>
                } />
                <Route path="dashboard" element={
                  <AuthLayout authentication admin>
                    <AdminDashboard />
                  </AuthLayout>
                } />
                <Route path="users" element={
                      <AuthLayout authentication admin>
                        <UserManagement />
                      </AuthLayout>
                    } />
                <Route path="users/:id" element={
                      <AuthLayout authentication admin>
                        <UserById />
                      </AuthLayout>
                    } />
                <Route path="transactions" element={
                  <AuthLayout authentication admin>
                    <TransactionManagement />
                  </AuthLayout>
                } />
                <Route path="plinkorounds" element={
                  <AuthLayout authentication admin>
                    <PlinkoRoundManagement />
                  </AuthLayout>
                } />
            </Route>
            <Route path="/" element={<Layout />}>

                <Route index element={
                    <AuthLayout authentication>
                      <PlinkoPage />
                    </AuthLayout>
                    } />
                <Route path="/wallet" element={
                    <AuthLayout authentication>
                      <WalletPage />
                    </AuthLayout>
                    } />
                <Route path="/transaction" element={
                    <AuthLayout authentication>
                      <TransactionPage1 />
                    </AuthLayout>
                    } />
            </Route>
            
            <Route path="/sim" element={
              <AuthLayout authentication>
                <PlinkoSimulation />
              </AuthLayout>
              }/>
            <Route
              path="/login"
              element={<LoginPopup />}
            />
            <Route
              path="/signup"
              element={<SignupPopup />}
            />
            </Routes>

            <Toaster
                position="top-right"
                reverseOrder={true}
                toastOptions={{
                    error: {
                        style: { borderRadius: "0", color: "red" },
                    },
                    success: {
                        style: { borderRadius: "0", color: "green" },
                    },
                    duration: 3000,
                }}
            />
        </>
    );
}

export default App;
