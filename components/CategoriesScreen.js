import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const categories = [
  { id: "1", name: "Electronics", icon: "devices", color: "#FF6B35" },
  { id: "2", name: "Fashion", icon: "shopping-bag", color: "#4ECDC4" },
  { id: "3", name: "Footwear", icon: "directions-run", color: "#18413a" },
  { id: "4", name: "Home & Living", icon: "home", color: "#5d2222" },
  { id: "5", name: "Beauty", icon: "spa", color: "#231545" },
  { id: "6", name: "Toys & Games", icon: "toys", color: "#ff88b6" },
  { id: "7", name: "Sports", icon: "sports-soccer", color: "#d0d058" },
  { id: "8", name: "Books", icon: "menu-book", color: "#63bcdc" },
  { id: "9", name: "Grocery", icon: "shopping-basket", color: "#f89898" },
  { id: "10", name: "Furniture", icon: "weekend", color: "#7493a9" },
  { id: "11", name: "Jewelry", icon: "diamond", color: "#efc10a" },
  {
    id: "12",
    name: "Mobile & Tablets",
    icon: "phone-android",
    color: "#52d764",
  },
];

const CategoriesScreen = ({ navigation }) => {
  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.categoryCard, { backgroundColor: item.color }]}
    >
      <MaterialIcons name={item.icon} size={40} color="#fff" />
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={34} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Categories</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default CategoriesScreen;

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
  listContainer: {
    padding: 15,
  },
  categoryCard: {
    flex: 1,
    margin: 8,
    height: 150,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  categoryName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    textAlign: "center",
  },
});
