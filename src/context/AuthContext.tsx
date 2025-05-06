import {createContext,useContext,useState,ReactNode} from 'react';



interface AuthContextType{
  user:string|null;
  login:(username:string)=>void;
  logout:()=>void;
}

const AuthContext=createContext<AuthContextType|undefined>(undefined)

export const AuthProvider=({children}:{children:ReactNode})=>{
  const [user, setuser] = useState<string|null>(null);
  const login=(username:string)=>setuser(username);
  const logout=()=>setuser(null);

return(
  <AuthContext.Provider value={{user,login,logout}}>
    {children}
  </AuthContext.Provider>
)


}


export const useAuth=()=>{
  const context=useContext(AuthContext);
  if(!context) throw new Error("useAuth must be used within Auth provider")
    return context;
}