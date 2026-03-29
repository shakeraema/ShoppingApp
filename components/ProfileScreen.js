import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  
} from "react-native";
import { useEffect, useState } from "react";
import {  useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import { logout } from "../redux/thunks/logout.js";
import { useDispatch } from "react-redux";
// import { handleLogout } from "../hooks/logout.js";

const ProfileScreen = ({ navigation }) => {
  const [menuItems, setMenuItems] = useState([]);

  const dispatch = useDispatch();

  const handleLogout = () => {
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

  const userData = useSelector((state) => state.auth.userData);
  const profileImageSource = userData?.profileImage || userData?.image || null;

  useEffect(() => {
    let isMounted = true;

    const fetchMenuItems = async () => {
      try {
        const response = await fetch("https://dummyjson.com/c/b216-eb89-40e5-8f02");
        const data = await response.json();
        const apiMenuItems = Array.isArray(data?.menuItems) ? data.menuItems : [];

        const normalizedItems = apiMenuItems
          .filter((item) => item?.id && item?.title && item?.icon && item?.screen)
          .map((item) => ({
            id: String(item.id),
            title: item.title,
            icon: item.icon,
            screen: item.screen,
          }));

        if (isMounted && normalizedItems.length > 0) {
          setMenuItems(normalizedItems);
        }
      } catch (error) {
        if (isMounted) {
          setMenuItems([]);
        }
      }
    };

    fetchMenuItems();

    return () => {
      isMounted = false;
    };
  }, []);
  
  

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={34} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {profileImageSource ? (
              <Image source={{ uri: profileImageSource }} style={styles.avatarImage} />
            ) : (
              <MaterialIcons name="person" size={50} color="#fff" />
            )}
          </View>
          <Text style={styles.userName}>{userData?.name || "User"}</Text>
          <Text style={styles.userEmail}>{userData?.email || "user@example.com"}</Text>
          <Text style={styles.userGender}>{userData?.gender || "Not specified"}</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View style={styles.menuItemLeft}>
                <MaterialIcons name={item.icon} size={24} color="#666" />
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#666" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <MaterialIcons name="logout" size={20} color="#FF6B6B" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FF6B35",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  userGender: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  editButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#000",
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  menuSection: {
    paddingVertical: 20,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f8f8f8",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  menuItemText: {
    fontSize: 16,
    color: "#333",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginVertical: 30,
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: "#FFF5F5",
    gap: 10,
    marginBottom: 50,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF6B6B",
  },
});
