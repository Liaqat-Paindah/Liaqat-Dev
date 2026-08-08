"use client";
import { createContext, useContext, useState } from "react";

type UserType = {
  name: string;
  email: string;
};
const userContextAPI = createContext<UserType | undefined>(undefined);
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user] = useState({
    name: "Liaqat Painda",
    email: "liaqat.paindah@gmail.com",
  });
  return (
    <userContextAPI.Provider value={user}>{children}</userContextAPI.Provider>
  );
};

export const useUser = () => {
  const context = useContext(userContextAPI);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
};
