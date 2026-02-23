import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import { logout } from "../redux/authSlice";

const { width } = Dimensions.get("window");

const products = [
  {
    id: "1",
    name: "Redmi Note 4",
    price: "₦ 45,000",
    originalPrice: "₦ 65,000",
    discount: "50% OFF",
    image: require("../assets/Mi-Smart-Band-4-832x558-1573195785-removebg-preview 1.png"),
  },
  {
    id: "2",
    name: "Apple Watch - series 6",
    price: "₦ 45,000",
    originalPrice: "₦ 65,000",
    discount: "50% OFF",
    image: require("../assets/6_44mm-blu_889c7c8b-e883-41ab-856c-38c9dd970d12_1200x-removebg-preview 2.png"),
  },
  {
    id: "3",
    name: "Smart Watch D002",
    price: "₦ 35,000",
    originalPrice: "₦ 55,000",
    discount: "40% OFF",
    image: require("../assets/D002-removebg-preview 1.png"),
  },
  {
    id: "4",
    name: "Digital Watch",
    price: "₦ 25,000",
    originalPrice: "₦ 45,000",
    discount: "45% OFF",
    image: require("../assets/0x0-removebg-preview 1.png"),
  },
];

const categories = [
  { id: "1", name: "Electronics", icon: "devices", color: "#FF6B35" },
  { id: "2", name: "Fashion", icon: "checkroom", color: "#E8E8E8" },
  { id: "3", name: "Bag", icon: "shopping-bag", color: "#E8E8E8" },
  { id: "4", name: "Footwear", icon: "directions-run", color: "#E8E8E8" },
  { id: "5", name: "Home", icon: "home", color: "#E8E8E8" },
];

const HomeScreen = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const userId = userData?.id;
  const userCart = useSelector((state) => // Get the cart for the current user from the cart state, if the user is not logged in, return an empty array
    userId ? state.cart.cartsByUser[userId] || [] : []
  );
  const cartQuantity = userCart.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

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

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate("ProductDetail", { product: item })}
    >
      <View style={styles.productImageContainer}>
        <Image source={item.image} style={styles.productImage} />
        {item.discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{item.discount}</Text>
          </View>
        )}
        <TouchableOpacity style={styles.favoriteButton}>
          <MaterialIcons name="favorite-border" size={18} color="#666" />
        </TouchableOpacity>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.productPrice}>{item.price}</Text>
        {item.originalPrice && (
          <Text style={styles.originalPrice}>{item.originalPrice}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity style={styles.categoryItem}>
      <View style={[styles.categoryIcon, { backgroundColor: item.color }]}>
        <MaterialIcons
          name={item.icon}
          size={24}
          color={item.color === "#FF6B35" ? "#fff" : "#666"}
        />
      </View>
      <Text style={styles.categoryName} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Profile")}
          style={styles.iconButton}
        >
          <View style={styles.avatarContainer}>
          <MaterialIcons name="person" size={30} color="#ffffff" />
          </View>
        </TouchableOpacity>
        <View style={styles.headerRightActions}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Search")}
            style={styles.iconButton}
          >
            <MaterialIcons name="search" size={34} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Cart")}
            style={styles.cartButton}
          >
            <MaterialIcons name="shopping-cart" size={34} color="#000" />
            {cartQuantity > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {cartQuantity > 99 ? "99+" : cartQuantity}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Greeting Section */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingText}>Hello {userData?.name || "User"} 👋</Text>
          <Text style={styles.subGreetingText}>Let's start shopping!</Text>
        </View>

        {/* Promotional Cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.promoContainer}
          contentContainerStyle={styles.promoContent}
        >
          <View style={[styles.promoCard, { backgroundColor: "#FF7B54" }]}>
            <Text style={styles.promoTitle}>20% OFF DURING THE</Text>
            <Text style={styles.promoTitle}>WEEKEND</Text>
            <TouchableOpacity
              style={styles.promoButton}
              onPress={() =>
                navigation.navigate("ProductDetail", { product: products[0] })
              }
            >
              <Text style={styles.promoButtonText}>Get Now</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.promoCard, { backgroundColor: "#4A90E2" }]}>
            <Text style={styles.promoTitle}>20% OFF DURING THE</Text>
            <Text style={styles.promoTitle}>WEEKEND</Text>
            <TouchableOpacity
              style={[styles.promoButton, { backgroundColor: "#4ECE5D" }]}
              onPress={() =>
                navigation.navigate("ProductDetail", { product: products[1] })
              }
            >
              <Text style={styles.promoButtonTextWhite}>Get Now</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Top Categories Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Categories</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Categories")}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />

        {/* Products Section */}
        <View style={styles.productsSection}>
          <FlatList
            data={products}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.productsList}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

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
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerRightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cartButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    top: -2,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
    fontFamily: "Inter",
  },
  greetingSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
    marginBottom: 5,
    fontFamily: "Inter",
  },
  subGreetingText: {
    fontSize: 16,
    color: "#666",
    fontFamily: "Inter",
  },
  promoContainer: {
    marginBottom: 25,
  },
  promoContent: {
    paddingHorizontal: 20,
    gap: 15,
  },
  promoCard: {
    width: width - 100,
    height: 140,
    borderRadius: 15,
    padding: 20,
    justifyContent: "center",
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    lineHeight: 22,
    fontFamily: "Inter",
  },
  promoButton: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginTop: 15,
  },
  promoButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "rgba(241, 117, 71, 1)",
    fontFamily: "Inter",
  },
  promoButtonTextWhite: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    fontFamily: "Inter",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    fontFamily: "Inter",
  },
  seeAllText: {
    fontSize: 14,
    color: "rgba(241, 117, 71, 1)",
    fontWeight: "600",
    fontFamily: "Inter",
  },
  categoriesList: {
    paddingHorizontal: 20,
    gap: 15,
    marginBottom: 25,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 15,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  productsSection: {
    paddingHorizontal: 12,
  },
  productsList: {
    paddingBottom: 20,
  },
  productCard: {
    flex: 1,
    margin: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  productImageContainer: {
    width: "100%",
    height: 150,
    backgroundColor: "#f8f8f8",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  productImage: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
  },
  discountBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgb(255, 255, 255)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  discountText: {
    color: "#000000",
    fontSize: 10,
    fontWeight: "700",
    fontFamily: "Inter",
  },
  favoriteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginBottom: 2,
  },
  originalPrice: {
    fontSize: 12,
    color: "#999",
    textDecorationLine: "line-through",
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: "#FF6B35",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
});


