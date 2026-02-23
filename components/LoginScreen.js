import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MaterialIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import GoogleSVGComponent from "../assets/Google";
import { login } from "../redux/authSlice";

const LoginScreen = ({ navigation }) => { // Add navigation prop to access navigation functions
  const [showPassword, setShowPassword] = useState(false); //password vissibility show korar jonne state variable
  const [email, setEmail] = useState(""); //email input er value store korar jonne state variable
  const [password, setPassword] = useState(""); //password input er value store korar jonne state variable
  const dispatch = useDispatch(); //redux action dispatch korar jonne useDispatch hook
  const loading = useSelector((state) => state.auth.loading); //redux store theke loading state access korar jonne useSelector hook

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
  // \s@+ means one or more characters that are not whitespace or @, followed by an @ symbol, followed by one or more characters that are not whitespace or @, followed by a dot, followed by one or more characters that are not whitespace or @. This is a basic regex for validating email formats.
  const isEmailValid = emailRegex.test(email); 
  //email input er value regex pattern er sathe match kore kina check korar jonne variable
  const showEmailError = email.trim() !== '' && !isEmailValid; 
  //email input er value empty na hole and also (eki sathe) regex pattern er sathe match na korle error message show korar jonne variable

  const isPasswordValid = password.length >= 6;
  //password input er value minimum 6 character kina check korar jonne variable
  const isFormValid = email.trim() && password.trim() && isEmailValid && isPasswordValid; 
  //email and password input er value empty na hole and also email valid hole password valid hole form valid hobe, otherwise form invalid hobe. Login button ke disable korar jonne variable
  const isLoginDisabled = loading || !isFormValid; //Login button ke disable korar jonne variable, loading state true hole or form invalid hole button disable hobe

  const handleLogin = async () => { //Login button click korar jonne function
    if (!email || !password) { //email or password input empty hole error message show korar jonne condition
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    if (!isEmailValid) { //email input er value valid na hole error message show korar jonne condition
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    if (!isPasswordValid) { //password input er value valid na hole error message show korar jonne condition
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    try {
      await dispatch(login({ email: email.trim().toLowerCase(), password })).unwrap();
    } catch (error) {
      Alert.alert("Login Failed", error || "Please check your credentials");
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
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.title}>Back!</Text>
          {/* <Image source={require("../assets/adaptive-icon.png")} style={styles.iconImage} /> */}
        </View>

        <View style={styles.formSection}>

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

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, isLoginDisabled && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoginDisabled}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={[styles.loginButtonText, isLoginDisabled && styles.loginButtonTextDisabled]}>
                Login
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

          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Create An Account </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

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
    // letterSpacing: 0,
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
  forgotPassword: {
    alignItems: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "rgba(248, 55, 88, 1)",
    fontSize: 12,
    fontFamily: "Montserrat",
  },
  loginButton: {
    backgroundColor: "rgba(248, 55, 88, 1)",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 30,
  },
  loginButtonDisabled: {
    opacity: 0.5,
    backgroundColor: "rgba(248, 55, 88, 0.5)",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Montserrat",
  },
  loginButtonTextDisabled: {
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
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signUpText: {
    color: "#666",
    fontSize: 14,
    fontFamily: "Montserrat",
  },
  signUpLink: {
    color: "rgba(248, 55, 88, 1)",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Montserrat",
  },
  iconImage: {
    width: 80,
    height: 80,
    alignSelf: "center",
    marginBottom: 30,
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
