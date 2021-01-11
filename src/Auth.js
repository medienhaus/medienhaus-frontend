import React, {createContext, useContext, useEffect, useState} from "react";
import Matrix from "./Matrix";

const AuthContext = createContext(undefined);

function AuthProvider({ children }) {
  const auth = useAuthProvider();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

function useAuthProvider() {
  const [user, setUser] = useState(null);

  const signin = (username, password, callback) => {
    return Matrix.login(username, password).then((profile) => {
      setUser(profile);
      callback();
    });
  };

  const signout = cb => {
    // @TODO Implement
    // return fakeAuth.signout(() => {
    //   setUser(null);
    //   cb();
    // });
  };

  useEffect(() => {
    if (localStorage.getItem("mx_user_id")) {
      Matrix.getMatrixClient().getProfileInfo(localStorage.getItem("mx_user_id")).then((profile) => {
        if (profile) {
          setUser(profile);
        } else {
          setUser(null);
        }
      }).catch((error) => {
        // @TODO Possibly outdated token? ... Logout
        console.log(error);
      });
    }
  }, []);

  return {
    user,
    signin,
    signout
  };
}

export {
  AuthProvider,
  useAuth,
};