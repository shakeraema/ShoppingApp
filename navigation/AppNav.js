import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import AppStack from "./AppStack";
import AuthStack from "./AuthStack";
import { useDispatch, useSelector } from "react-redux";
import { restoreToken } from "../redux/thunks/index.js";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function AppNav() {
  const dispatch = useDispatch();
  const { userToken, loading } = useSelector((state) => state.auth);
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  useEffect(() => {
    // Restore token from AsyncStorage on app load
    const bootstrapAsync = async () => {
      try {
        await dispatch(restoreToken()).unwrap();
      } catch (err) {
        // Token restoration failed, user stays on Auth stack
      } finally {
        setIsCheckingToken(false);
      }
    };

    bootstrapAsync();
  }, [dispatch]);

  // Show loading screen while checking token
  if (isCheckingToken) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" color="rgba(248, 55, 88, 1)" />
      </View>
    );
  }

  return userToken ? <AppStack /> : <AuthStack />;
}