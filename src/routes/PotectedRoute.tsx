
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import type { ReactNode } from "react";
import type { AppRole, UserRole, SchoolRole } from "./roles";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: AppRole[];
}

interface DecodedToken {
  id: number;
  name: string;
  role: UserRole;
  schoolRoles?: { schoolId: number; role: SchoolRole }[];
  exp: number;
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const token = localStorage.getItem("token");

  if (!token) {
    console.log("No token found in localStorage");
    return <Navigate to="/login" replace />;
  }

  // console.log("Raw token from localStorage:", token);
  // console.log("Token length:", token.length);

  try {
    // Decode JWT from backend (JS)
    const decoded = jwtDecode<DecodedToken>(token);
    // console.log("Decoded token:", decoded);
    // console.log("Decoded token keys:", Object.keys(decoded));

    // Check if the decoded token has the minimum required structure
    if (!decoded.id || !decoded.role || !decoded.name) {
      console.error("Token missing required fields:", { id: decoded.id, role: decoded.role, name: decoded.name });
      localStorage.removeItem("token");
      return <Navigate to="/" replace />;
    }

    // Token expiration check
    if (decoded.exp * 1000 < Date.now()) {
      console.log("Token expired, removing from localStorage");
      localStorage.removeItem("token");
      return <Navigate to="/" replace />;
    }

    // Role-based access check
    if (allowedRoles) {
      // Get all roles the user has: their main role + all school roles.
      const userRoles: AppRole[] = [decoded.role, ...(decoded.schoolRoles?.map(sr => sr.role) || [])];
      
      // Check if the user has at least one of the allowed roles.
      const isAuthorized = allowedRoles.some(allowedRole => userRoles.includes(allowedRole));

      if (!isAuthorized) {
        console.log("User roles:", userRoles);
        console.log("Allowed roles:", allowedRoles);
        console.log("User is not authorized for this route.");
        return <Navigate to="/unauthorized" replace />;
      }
    }

    return <>{children}</>;
  } catch (error) {
    console.error("JWT decode error:", error);
    console.error("Error details:", error instanceof Error ? error.message : String(error));
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
}
