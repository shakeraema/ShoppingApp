import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import EntryScreen from "../components/EntryScreen";

export default function EntryStackScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Welcome");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return <EntryScreen />;
}