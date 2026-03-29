import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
// import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import GoogleSVGComponent from "../assets/Google";
import { signup } from "../redux/thunks/signup.js";
import { validateEmail } from "../formated/emailValidation.js";
import { validatePassword } from "../formated/passwordValidation.js";



const SignupScreen = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);

  //email and password validation
const isEmailValid = (email) => validateEmail(email);
const isPasswordValid = (password) => validatePassword(password);

  const showEmailError = email.trim() !== '' && !isEmailValid(email);
  
  const isConfirmPasswordValid = confirmPassword.trim().length > 0 && password === confirmPassword;
  const isFormValid =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    password.trim().length > 0 &&
    confirmPassword.trim().length > 0 &&
    isEmailValid(email) &&
    isPasswordValid(password) &&
    isConfirmPasswordValid;
  const isSignupDisabled = loading || !isFormValid;

  const showPasswordError = password.trim().length > 0 && !isPasswordValid(password);
  const showConfirmPasswordError = confirmPassword.trim().length > 0 && !isConfirmPasswordValid;

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!isEmailValid(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    if (!isPasswordValid(password)) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    if (!isConfirmPasswordValid) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      await dispatch(signup({ name: name.trim(), email: email.trim().toLowerCase(), password })).unwrap();
      Alert.alert("Info", "Signup is disabled in strict DummyJSON auth mode.");
    } catch (error) {
      Alert.alert("Signup Unavailable", error || "Use existing DummyJSON credentials to login.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <Text style={styles.title}>Create</Text>
          <Text style={styles.title}>Account!</Text>
        </View>

        <View style={styles.formSection}>
          <View style={styles.inputContainer}>
            <MaterialIcons
              name="person"
              size={20}
              color="#999"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons
              name="email"
              size={20}
              color="#999"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          {showEmailError && (
            <Text style={styles.errorText}>Please enter a valid email address</Text>
          )}

          <View style={styles.inputContainer}>
            <MaterialIcons
              name="lock"
              size={20}
              color="#999"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <MaterialIcons
                name={showPassword ? "visibility" : "visibility-off"}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          </View>

          {showPasswordError && (
            <Text style={styles.errorText}>Password must be at least 6 characters</Text>
          )}

          <View style={styles.inputContainer}>
             <MaterialIcons
              name="lock"
              size={20}
              color="#999"
              style={styles.icon}
            />
            <TextInput
            style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#999"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
             <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <MaterialIcons
                name={showConfirmPassword ? "visibility" : "visibility-off"}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          </View>
            {showConfirmPasswordError && (
              <Text style={styles.errorText}>Passwords do not match</Text>
            )}

          <TouchableOpacity
            style={[styles.signupButton, isSignupDisabled && styles.signupButtonDisabled]}
            onPress={handleSignup}
            disabled={isSignupDisabled}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={[styles.signupButtonText, isSignupDisabled && styles.signupButtonTextDisabled]}>
                Sign Up
              </Text>
            )}
          </TouchableOpacity>

          <Text style={styles.orText}>- OR Continue with -</Text>

          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <GoogleSVGComponent />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <FontAwesome5 name="apple" size={24} color="#000000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <FontAwesome5 name="facebook-f" size={24} color="#1877F2" />
            </TouchableOpacity>
          </View>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already Have An Account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerSection: {
    width: 185,
    height: 83,
    marginTop: 63,
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    color: "#000",
    fontFamily: "Montserrat",
    lineHeight: 43,
  },
  formSection: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 50,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#000",
    fontFamily: "Montserrat",
  },
  signupButton: {
    backgroundColor: "rgba(248, 55, 88, 1)",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  signupButtonDisabled: {
    opacity: 0.5,
    backgroundColor: "rgba(248, 55, 88, 0.5)",
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Montserrat",
  },
  signupButtonTextDisabled: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  orText: {
    textAlign: "center",
    color: "#999",
    fontSize: 12,
    marginBottom: 20,
    fontFamily: "Montserrat",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 30,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "rgba(248, 55, 88, 1)",
    justifyContent: "center",
    alignItems: "center",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    color: "#666",
    fontSize: 14,
    fontFamily: "Montserrat",
  },
  loginLink: {
    color: "rgba(248, 55, 88, 1)",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Montserrat",
  },
  errorText: {
    color: "rgba(248, 55, 88, 1)",
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 5,
    fontFamily: "Montserrat",
  },
});
