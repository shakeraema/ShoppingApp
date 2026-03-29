import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from "react-native";
// import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

// contentfitcover

const WelcomeScreen = ({ navigation }) => {
  const dim = Dimensions.get("screen");
  // console.log(dim);
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../assets/bg.png")}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />

      <LinearGradient
        colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.8)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradientOverlay}
      />
      <View style={styles.contentOverlay}>
        <View style={styles.content}>
          <Text style={styles.mainText}>You want</Text>
          <Text style={styles.mainText}>Authentic, here</Text>
          <Text style={styles.mainText}>you go!</Text>
          <Text style={styles.subText}>Find it here, buy it now!</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Signup")} 
          > 
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.loginLinkText}>Already have an account? <Text style={styles.loginLinkBold}>Login</Text></Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "relative",
    // backgroundColor: "#330202",
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 362,
    width: "100%",
  },
  contentOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 362,
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 60,
    zIndex: 10,
  },
  content: {
    alignItems: "center",
    width: "100%",
  },
  mainText: {
    fontSize: 34,
    fontWeight: 400,
    color: "white",
    textAlign: "center",
    fontFamily: "Montserrat",
    fontStyle: "semi-bold",
  },
  subText: {
    fontSize: 14,
    fontWeight: "300",
    color: "white",
    textAlign: "center",
    marginTop: 14,
    marginBottom: 35,
    fontFamily: "Montserrat",
  },
  button: {
    backgroundColor: "#F83758",
    paddingVertical: 12,
    paddingHorizontal: 70,
    borderRadius: 4,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "600",
    fontFamily: "Montserrat",
  },
  loginLink: {
    marginTop: 20,
  },
  loginLinkText: {
    color: "#ffffff",
    fontSize: 14,
    fontFamily: "Montserrat",
  },
  loginLinkBold: {
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});
