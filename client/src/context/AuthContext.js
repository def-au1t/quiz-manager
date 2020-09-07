import { createContext } from 'react';
import AuthService from "../services/auth.service.js"

export const AuthContext = createContext({
  user: null,
  login:() => {},
  logout:() => {},
  register:() => {},
  loading:() => {},
});