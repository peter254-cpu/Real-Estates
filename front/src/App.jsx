import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Headers from "./components/Headers";
import SignUp from "./pages/SignUp";
import ProtectedRoutes from "./components/ProtectedRoutes";
import CreateListing from "./pages/CreateListing";
import UpdateListing from "./pages/UpdateListing";
import Listing from "./pages/Listing"
import Search from "./components/Search";
import React from "react";
import Footer from "./components/Footer";


export default function App() {
  return <BrowserRouter>
  <Headers />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="sign-in" element = {<SignIn />} />
      <Route path="/sign-up" element ={<SignUp />} />
      <Route path="/about" element ={<About />} />
      <Route path="/listing/:listingId" element={<Listing />} />
      <Route path="/search" element={<Search />} />
      <Route element={<ProtectedRoutes />}>
          <Route path="/profile" element ={<Profile />} />
          <Route path="/create-listing" element ={<CreateListing />} />
          <Route path="/update-listing/:listingId" element ={<UpdateListing />} />
      </Route>
    </Routes>
    <Footer />
  </BrowserRouter>
}
