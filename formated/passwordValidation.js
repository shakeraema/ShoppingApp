import { useState } from "react";

// constr [password, setPassword] = useState(""); //password input er value store korar jonne state variable

export const validatePassword = (password) => {
  return password.trim().length >= 6;
};