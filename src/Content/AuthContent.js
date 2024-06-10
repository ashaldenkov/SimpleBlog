import { createContext, useState, useEffect } from "react";
/*
import { CookiesProvider, useCookies } from 'react-cookie'

function Cookie({children}) {
  const [cookies, setCookie] = useCookies(['user'])

  function handleLogin(user) {
    setCookie('user', user, { path: '/' })
  }

  return (
    <CookiesProvider>
      {children}
    </CookiesProvider>
  )
}

export default Cookie()
*/
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();

  useEffect(() => {
    window.localStorage.setItem('user', user);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
        {children}
    </AuthContext.Provider>
)
}


/*
{
    "user": {
        "id": 31894,
        "email": "gjasdnk@gmail.com",
        "username": "chingachkook",
        "bio": null,
        "image": "https://api.realworld.io/images/smiley-cyrus.jpeg",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjozMTg5NH0sImlhdCI6MTcxNzg0MTc1MSwiZXhwIjoxNzIzMDI1NzUxfQ.5ZbMkHcW5JHbOpkmNUyUFyvZRbrfy-CXlit0PF5N1A8"
    }
}
    */