import {  useSelector } from "react-redux/es/hooks/useSelector"
import { Outlet, Navigate } from "react-router-dom"
import React from "react";

export default function ProtectedRoutes() {
    const { currentUser } = useSelector((state) => state.user)
  return currentUser ? <Outlet /> : <Navigate to="/sign-in" />
}
