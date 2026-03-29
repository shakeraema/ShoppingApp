import { useState } from "react";
import { validateEmail } from "../formated/emailValidation";
import { validatePassword } from "../formated/passwordValidation";

export const useSignupForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isEmailValid = validateEmail(email);
  const isPasswordValid = validatePassword(password);
  const isConfirmPasswordValid =
    confirmPassword.trim().length > 0 &&
    password === confirmPassword;

  const isFormValid =
    name.trim() &&
    email.trim() &&
    password.trim() &&
    confirmPassword.trim() &&
    isEmailValid &&
    isPasswordValid &&
    isConfirmPasswordValid;

  return {
    name,
    email,
    password,
    confirmPassword,
    setName,
    setEmail,
    setPassword,
    setConfirmPassword,
    isEmailValid,
    isPasswordValid,
    isConfirmPasswordValid,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    isFormValid,
  };
};