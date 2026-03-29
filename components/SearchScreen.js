import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import {
  getAllProducts,
  getProductsByCategory,
  searchProducts,
} from "../services/productsApi";

const SearchScreen = ({ navigation, route }) => {
  const categorySlug = route?.params?.categorySlug || null;
  const categoryName = route?.params?.categoryName || "";

  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadCategoryProducts = async () => {
    setLoading(true);
    try {
      const result = categorySlug
        ? await getProductsByCategory(categorySlug)
        : await getAllProducts();
      setProducts(result);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (text) => {
    setSearchQuery(text);

    if (!text.trim()) {
      loadCategoryProducts();
      return;
    }

    setLoading(true);
    try {
      const result = await searchProducts(text);
      setProducts(result);
    } catch (error) {
      Alert.alert("Error", "Failed to search products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategoryProducts();
  }, [categorySlug]);

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate("ProductDetail", { product: item })}
    >
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.productImage} />
        {item.discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{item.discount}</Text>
          </View>
        )}
        <TouchableOpacity style={styles.favoriteButton}>
          <MaterialIcons name="favorite-border" size={20} color="#666" />
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={34} color="#000" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder={
              categoryName
                ? `Search in ${categoryName}...`
                : "Search products..."
            }
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus={true}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch("")}>
              <MaterialIcons name="close" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="rgba(248, 55, 88, 1)" />
        ) : products.length > 0 ? (
          <>
            <Text style={styles.resultText}>{products.length} products found</Text>
            <FlatList
              data={products}
              renderItem={renderProductItem}
              keyExtractor={(item) => item.id}
              numColumns={2}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="search-off" size={80} color="#ddd" />
            <Text style={styles.emptyText}>No products found</Text>
            <Text style={styles.emptySubText}>
              Try searching with different keywords
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    gap: 15,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 45,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
  },
  resultText: {
    fontSize: 14,
    color: "#666",
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  listContainer: {
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
  imageContainer: {
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
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  discountText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 20,
  },
  emptySubText: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
  },
});
