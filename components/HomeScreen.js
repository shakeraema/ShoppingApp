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
  ActivityIndicator,
} from "react-native";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCategories, getProductsPage } from "../services/productsApi";
import { fetchCart } from "../redux/thunks/index.js";

const { width } = Dimensions.get("window");
const HOME_SORT_ORDER_KEY = "homeSortOrder";
const INITIAL_PRODUCTS_LIMIT = 10;
const LOAD_MORE_PRODUCTS_LIMIT = 5;

// const shuffleProducts = (items = []) => {
//   const cloned = [...items];
//   for (let index = cloned.length - 1; index > 0; index -= 1) { 
    // Implementing the Fisher-Yates shuffle algorithm to randomize the order of products in the list. This ensures that the products are displayed in a different order each time, providing a fresh experience for users when they visit the home screen.

    // const randomIndex = Math.floor(Math.random() * (index + 1)); 
    // Generate a random index from 0 to the current index (inclusive) to select a random product from the remaining unshuffled portion of the array.

    // [cloned[index], cloned[randomIndex]] = [cloned[randomIndex], cloned[index]]; // Swap the current product at index with the randomly selected product at randomIndex. This effectively moves the randomly selected product to its new position in the shuffled array.
//   }
//   return cloned;
// };

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingMoreProducts, setLoadingMoreProducts] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const userData = useSelector((state) => state.auth.userData);
  const profileImageSource = userData?.profileImage || userData?.image || null;
  const userId = userData?.id;
  const userCart = useSelector((state) => // Get the cart for the current user from the cart state, if the user is not logged in, return an empty array
    userId ? state.cart.cartsByUser[userId] || [] : []
  );
  const cartQuantity = userCart.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  const promoProducts = useMemo(() => products.slice(0, 2), [products]);
  const parsePrice = (priceValue) => {
    if (typeof priceValue === "number") return priceValue;
    if (typeof priceValue === "string") {
      const numericValue = Number(priceValue.replace(/[^\d.]/g, ""));
      return Number.isFinite(numericValue) ? numericValue : 0;
    }
    return 0;
  };

  const sortProductsByPrice = (items = [], order = "asc") =>
    [...items].sort((firstProduct, secondProduct) => {
      const firstPrice = parsePrice(firstProduct?.price);
      const secondPrice = parsePrice(secondProduct?.price);
      return order === "asc" ? firstPrice - secondPrice : secondPrice - firstPrice;
    });

  const handleToggleSort = () => {
    const nextOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(nextOrder);
    setProducts((previousProducts) => sortProductsByPrice(previousProducts, nextOrder));
  };

  const topCategories = useMemo(() => {
    if (!Array.isArray(categories) || categories.length === 0) return []; 
    // Check if categories is a valid array and has items, if not return an empty array to avoid errors when trying to shuffle or slice it. This ensures that the function can handle cases where the categories data might not be available or is not in the expected format without crashing the app.

    const shuffled = [...categories].sort(() => Math.random() - 0.5); 
    // Shuffle the categories array to randomize the order of categories displayed in the "Top Categories" section. This provides a dynamic experience for users each time they visit the home screen, as different categories may be highlighted as top categories on each visit.

    return shuffled.slice(0, 7); 
    // Return the first 7 categories from the shuffled array to be displayed as top categories on the home screen.
  }, [categories]);

  const hasMoreProducts = products.length < totalProducts;

  useEffect(() => {
    AsyncStorage.setItem(HOME_SORT_ORDER_KEY, sortOrder).catch(() => {});
  }, [sortOrder]);

  useEffect(() => {
    if (!userId) return;
    dispatch(fetchCart(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    let isMounted = true;

    const fetchInitialProducts = async () => {
      setLoadingProducts(true);
      try {
        if (isMounted) {
          const savedSortOrder = await AsyncStorage.getItem(HOME_SORT_ORDER_KEY);
          const initialSortOrder =
            savedSortOrder === "asc" || savedSortOrder === "desc"
              ? savedSortOrder
              : "asc";

          const productsData = await getProductsPage({
            limit: INITIAL_PRODUCTS_LIMIT,
            skip: 0,
          });
          setSortOrder(initialSortOrder);
          setProducts(sortProductsByPrice(productsData.products, initialSortOrder));
          setTotalProducts(productsData.total);
        }
      } catch (error) {
        if (isMounted) {
          Alert.alert("Error", "Failed to fetch products");
        }
      } finally {
        if (isMounted) {
          setLoadingProducts(false);
        }
      }
    };

    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        if (isMounted) {
          const categoriesData = await getCategories();
          setCategories(categoriesData);
        }
      } catch (error) {
        if (isMounted) {
          Alert.alert("Error", "Failed to fetch categories");
        }
      } finally {
        if (isMounted) {
          setLoadingCategories(false);
        }
      }
    };

    fetchInitialProducts();
    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const loadMoreProducts = async () => {
    if (loadingProducts || loadingMoreProducts || !hasMoreProducts) {
      return;
    }

    setLoadingMoreProducts(true);
    try {
      const nextPage = await getProductsPage({
        limit: LOAD_MORE_PRODUCTS_LIMIT,
        skip: products.length,
      });

      setProducts((previousProducts) => [...previousProducts, ...nextPage.products]);
      setTotalProducts(nextPage.total);
    } catch (error) {
      Alert.alert("Error", "Failed to load more products");
    } finally {
      setLoadingMoreProducts(false);
    }
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
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() =>
        navigation.navigate("Search", {
          categorySlug: item.slug, // slug means the unique identifier for the category, which will be used in the Search screen to filter products based on the selected category. By passing the category slug as a parameter, we can ensure that the Search screen displays only products that belong to the chosen category, providing a more relevant and streamlined shopping experience for users. Additionally, we also pass the category name for display purposes in the Search screen header or other UI elements.
          categoryName: item.name,
        })
      }
    >
      <View style={[styles.categoryIcon, { backgroundColor: item.color }]}>
        <MaterialIcons
          name={item.icon}
          size={24}
          color={item.color === "#FF6B35" ? "#fff" : "#ffffff"}
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
            {profileImageSource ? (
              <Image source={{ uri: profileImageSource }} style={styles.avatarImage} />
            ) : (
              <MaterialIcons name="person" size={30} color="#ffffff" />
            )}
          </View>
        </TouchableOpacity>
        <View style={styles.headerRightActions}>
          <TouchableOpacity
            onPress={() => navigation.navigate("DeveloperApiTest")}
            style={styles.iconButton}
          >
            <MaterialIcons name="code" size={28} color="#000" />
          </TouchableOpacity>
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

      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productsList}
        onEndReached={loadMoreProducts}
        onEndReachedThreshold={0.3}
        ListHeaderComponent={(
          <>
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
                <Text style={styles.promoTitle}>10% OFF DURING THE</Text>
                <Text style={styles.promoTitle}>WEEKEND</Text>
                <TouchableOpacity
                  style={styles.promoButton}
                  onPress={() =>
                    promoProducts[0] &&
                    navigation.navigate("ProductDetail", { product: promoProducts[0] })
                  }
                  disabled={!promoProducts[0]}
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
                    promoProducts[1] &&
                    navigation.navigate("ProductDetail", { product: promoProducts[1] })
                  }
                  disabled={!promoProducts[1]}
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

            {loadingCategories ? (
              <ActivityIndicator style={styles.sectionLoader} color="#FF6B35" />
            ) : (
              <FlatList
                data={topCategories}
                renderItem={renderCategoryItem}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesList}
              />
            )}

            {/* Products Section */}
            <View style={styles.productsSection}>
              <View style={styles.productsHeader}>
                <Text style={styles.sectionTitle}>Products</Text>
                <TouchableOpacity
                  style={styles.sortControl}
                  onPress={handleToggleSort}
                >
                  <MaterialIcons name="sort" size={20} color="#000" />
                  <Text style={styles.sortText}>
                    {sortOrder === "asc" ? "Low to High" : "High to Low"}
                  </Text>
                </TouchableOpacity>
              </View>
              {loadingProducts && (
                <ActivityIndicator style={styles.sectionLoader} color="#FF6B35" />
              )}
            </View>
          </>
        )}
        ListFooterComponent={
          loadingMoreProducts ? (
            <ActivityIndicator style={styles.loadMoreLoader} color="#FF6B35" />
          ) : !loadingProducts && !hasMoreProducts && products.length > 0 ? (
            <Text style={styles.endOfListText}>No more products</Text>
          ) : null
        }
      />
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
  productsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  sortControl: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sortText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#000",
    fontFamily: "Inter",
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
  sectionLoader: {
    marginBottom: 20,
  },
  loadMoreLoader: {
    marginVertical: 16,
  },
  endOfListText: {
    textAlign: "center",
    color: "#666",
    fontSize: 13,
    fontFamily: "Inter",
    marginTop: 6,
    marginBottom: 18,
  },
  avatarContainer: {
    width: 40,
    height: 40,
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
});


