import React from 'react';
import {
    Route,
  } from "react-router-dom";
  
  
const PrivateRoute = ({ component: Component, isAuthenticated, onUnauthorized, ...rest }) => {
  return <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          <Component {...rest} {...props} />
        ) : null
      }
    />
};
  
export default PrivateRoute