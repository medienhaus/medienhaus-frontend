import React, { createContext, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom'

export const LocationContext = createContext();

export const LocationProvider = props => {
  const loc = useLocation;
  const [location, setLocation] = useState(loc.pathname);
  return (
    <LocationContext.Provider value={[location, setLocation]}>
      {props.children}
    </LocationContext.Provider>
  );
}