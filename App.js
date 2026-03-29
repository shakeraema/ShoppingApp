import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./redux/store";
import { AppNav } from "./navigation/index";


export default function App() {
  return (
    <Provider store={store}>
      <PersistGate //persistGate is used to delay the rendering of the app's UI until the persisted state has been retrieved and saved to redux. This ensures that the app has access to the most up-to-date state when it starts.
        loading={
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="rgba(248, 55, 88, 1)" />
          </View>
        }
        persistor={persistor}
      >
        <NavigationContainer>
          <AppNav />
          <StatusBar style="auto" />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
