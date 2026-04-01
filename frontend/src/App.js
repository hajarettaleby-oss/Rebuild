import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./index.css";
import { LoginPage, RegisterPage, HomePage, BrowsePage, ListingDetailPage, PostPage, CheckoutPage, OrderConfirmedPage, OrdersPage, NotificationsPage, MessagesPage, ChatPage, ProfilePage } from "./pages/Pages";
import { Spinner } from "./components/Shared";

function Guard({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="app" style={{display:"flex",alignItems:"center",justifyContent:"center",flex:1}}><div style={{textAlign:"center"}}><div style={{width:68,height:68,background:"#B8720A",borderRadius:20,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div><div className="spin" style={{margin:"0 auto"}}/></div></div>;
  return user ? children : <Navigate to="/login" replace />;
}
function Public({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/home" replace /> : children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/login" element={<Public><LoginPage /></Public>} />
          <Route path="/register" element={<Public><RegisterPage /></Public>} />
          <Route path="/home" element={<Guard><HomePage /></Guard>} />
          <Route path="/browse" element={<Guard><BrowsePage /></Guard>} />
          <Route path="/listing/:id" element={<Guard><ListingDetailPage /></Guard>} />
          <Route path="/post" element={<Guard><PostPage /></Guard>} />
          <Route path="/checkout/:listingId" element={<Guard><CheckoutPage /></Guard>} />
          <Route path="/order-confirmed/:orderId" element={<Guard><OrderConfirmedPage /></Guard>} />
          <Route path="/orders" element={<Guard><OrdersPage /></Guard>} />
          <Route path="/notifications" element={<Guard><NotificationsPage /></Guard>} />
          <Route path="/messages" element={<Guard><MessagesPage /></Guard>} />
          <Route path="/messages/:userId" element={<Guard><ChatPage /></Guard>} />
          <Route path="/profile" element={<Guard><ProfilePage /></Guard>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
