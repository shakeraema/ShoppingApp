import { Alert } from "react-native";
import { useDispatch } from "react-redux";
import { logout } from "../redux/thunks/logout.js";

const dispatch = useDispatch();


export const handleLogout = () => {
      Alert.alert(
        "Logout",
        "Are you sure you want to logout?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Logout",
            onPress: async () => {
              await dispatch(logout()).unwrap();
            },
            style: "destructive"
          }
        ]
      );
    };