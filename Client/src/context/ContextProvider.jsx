import { createContext} from "react";

export const AuthContext = createContext();

export const ContextProvider = ({ children }) => {
   
    return (
      <AuthContext.Provider value={{ }}>
        {children}
      </AuthContext.Provider>
    );
  };
  