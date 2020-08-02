import { createContext, useContext } from "react";
import { User } from "../types";

export const UserContext = createContext<User>(null);
export const useUser = () => useContext(UserContext);
