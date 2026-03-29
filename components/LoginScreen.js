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
import {
  MaterialIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import GoogleSVGComponent from "../assets/Google";
import { validatePassword } from "../formated/passwordValidation.js";
import { useAuth } from "../hooks/useAuth.js";
import { useLoginForm } from "../hooks/useLoginForm.js";

const isPasswordValid = (password) => validatePassword(password);


  const LoginScreen = ({ navigation }) => {
  const { loginUser, loading } = useAuth();
  const {
    email,
    password,
    setEmail,
    setPassword,
    isFormValid,
    showPassword,
    setShowPassword,
  } = useLoginForm();

  const handleLogin = async () => {
    try {
      await loginUser({ email, password });
    } catch (error) {
      Alert.alert("Login Failed", error);
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
              name="person"
              size={20}
              color="#999"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Username or Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </View>

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
            style={[styles.loginButton, !isFormValid && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={!isFormValid || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={[styles.loginButtonText, !isFormValid && styles.loginButtonTextDisabled]}>
                Login
              </Text>
            )}
          </TouchableOpacity>
          {password && !isPasswordValid(password) && (
            <Text style={styles.errorText}>Password must be at least 6 characters</Text>
          )}

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
