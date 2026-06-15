import React from "react";
import { Route, Redirect } from "react-router-dom";

function ProtectedRoute({ component: Component, isAdmin = false, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (isAdmin) {
          const adminKey = localStorage.getItem("adminKey");
          return adminKey ? (
            <Component {...props} />
          ) : (
            <Redirect to="/admin/login" />
          );
        }
        
        const userInfo = localStorage.getItem("userInfo");
        return userInfo ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        );
      }}
    />
  );
}

export default ProtectedRoute;
