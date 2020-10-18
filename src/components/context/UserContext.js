import React, { useState, createContext, useMemo } from 'react';

export const UserContext = createContext();

export const UserProvider = props => {
  const [user, setUser] = useState(null);
  const value = useMemo(() => ({ user, setUser }), [user, setUser]);

  return (
    <UserContext.Provider value={value}>
      {props.children}
    </UserContext.Provider>
  );
}

