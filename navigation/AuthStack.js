import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EntryStackScreen from "./EntryStack";
import WelcomeScreen from "../components/WelcomeScreen";
import LoginScreen from "../components/LoginScreen";
import SignupScreen from "../components/SignupScreen";

const Stack = createNativeStackNavigator();


// Auth Stack - for unauthenticated users

export default function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
        cardStyle: { backgroundColor: "#fff" },
      }}
    >
      <Stack.Screen name="Entry" component={EntryStackScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}