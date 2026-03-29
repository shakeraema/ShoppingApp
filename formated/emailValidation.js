  // email Validation
import { useState } from "react";

//   const [email, setEmail] = useState(""); //email input er value store korar jonne state variable


  export const validateEmail = (email) => { 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

