import { useState } from "react";
import { validatePassword } from "../formated/passwordValidation";

export const useLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoginDisabled, setIsLoginDisabled] = useState(true);

  const isEmailValid = email.trim().length > 0;
  const isPasswordValid = validatePassword(password);

  const isFormValid =
    email.trim() &&
    password.trim() &&
    isEmailValid &&
    isPasswordValid;

  return {
    email,
    password,
    setEmail,
    setPassword,
    isEmailValid,
    isPasswordValid,
    isFormValid,
    showPassword,
    setShowPassword,
    isLoginDisabled,
    setIsLoginDisabled,
  };
};