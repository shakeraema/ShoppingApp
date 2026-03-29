import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import {
  addNewCart,
  deleteCartById,
  getAllCarts,
  getCartsByUser,
  getSingleCart,
  updateCartById,
} from "../services/cartsApi.js";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getCategories,
  getProductsByCategory,
  getSingleProduct,
  searchProducts,
  updateProduct,
} from "../services/productsApi.js";

const formatOutput = (value) => {
  if (Array.isArray(value) && value.length > 12) {
    return JSON.stringify(
      {
        count: value.length,
        preview: value.slice(0, 5),
      },
      null,
      2
    );
  }

  return JSON.stringify(value, null, 2);
};

const DeveloperApiTestScreen = ({ navigation }) => {
  const authUserId = useSelector((state) => state.auth.userData?.id);
  const [userId, setUserId] = useState(String(authUserId || 1));
  const [cartId, setCartId] = useState("1");
  const [productId, setProductId] = useState("1");
  const [searchQuery, setSearchQuery] = useState("phone");
  const [categorySlug, setCategorySlug] = useState("smartphones");
  const [loadingKey, setLoadingKey] = useState("");
  const [output, setOutput] = useState("Run an action to inspect API response.");

  const numericUserId = useMemo(() => Number(userId) || 1, [userId]);
  const numericCartId = useMemo(() => Number(cartId) || 1, [cartId]);
  const numericProductId = useMemo(() => Number(productId) || 1, [productId]);

  const runAction = async (key, action) => {
    setLoadingKey(key);
    try {
      const result = await action();
      setOutput(formatOutput(result));
    } catch (error) {
      setOutput(`Error: ${error?.message || "Request failed"}`);
    } finally {
      setLoadingKey("");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Developer API Test</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Inputs</Text>
        <TextInput
          style={styles.input}
          placeholder="User ID"
          keyboardType="number-pad"
          value={userId}
          onChangeText={setUserId}
        />
        <TextInput
          style={styles.input}
          placeholder="Cart ID"
          keyboardType="number-pad"
          value={cartId}
          onChangeText={setCartId}
        />
        <TextInput
          style={styles.input}
          placeholder="Product ID"
          keyboardType="number-pad"
          value={productId}
          onChangeText={setProductId}
        />
        <TextInput
          style={styles.input}
          placeholder="Search query"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TextInput
          style={styles.input}
          placeholder="Category slug"
          value={categorySlug}
          onChangeText={setCategorySlug}
        />

        <Text style={styles.sectionTitle}>Carts</Text>
        <View style={styles.actionsGrid}>
          <ActionButton
            label="Get All Carts"
            loading={loadingKey === "carts-all"}
            onPress={() => runAction("carts-all", () => getAllCarts())}
          />
          <ActionButton
            label="Get Single Cart"
            loading={loadingKey === "carts-single"}
            onPress={() => runAction("carts-single", () => getSingleCart(numericCartId))}
          />
          <ActionButton
            label="Get Carts by User"
            loading={loadingKey === "carts-user"}
            onPress={() => runAction("carts-user", () => getCartsByUser(numericUserId))}
          />
          <ActionButton
            label="Add Cart"
            loading={loadingKey === "carts-add"}
            onPress={() =>
              runAction("carts-add", () =>
                addNewCart({
                  userId: numericUserId,
                  products: [{ id: numericProductId, quantity: 1 }],
                })
              )
            }
          />
          <ActionButton
            label="Update Cart"
            loading={loadingKey === "carts-update"}
            onPress={() =>
              runAction("carts-update", () =>
                updateCartById(numericCartId, {
                  merge: true,
                  products: [{ id: numericProductId, quantity: 2 }],
                })
              )
            }
          />
          <ActionButton
            label="Delete Cart"
            loading={loadingKey === "carts-delete"}
            onPress={() => runAction("carts-delete", () => deleteCartById(numericCartId))}
          />
        </View>

        <Text style={styles.sectionTitle}>Products</Text>
        <View style={styles.actionsGrid}>
          <ActionButton
            label="Get All Products"
            loading={loadingKey === "products-all"}
            onPress={() => runAction("products-all", () => getAllProducts())}
          />
          <ActionButton
            label="Get Single Product"
            loading={loadingKey === "products-single"}
            onPress={() =>
              runAction("products-single", () => getSingleProduct(numericProductId))
            }
          />
          <ActionButton
            label="Get Categories"
            loading={loadingKey === "products-categories"}
            onPress={() => runAction("products-categories", () => getCategories())}
          />
          <ActionButton
            label="Search Products"
            loading={loadingKey === "products-search"}
            onPress={() => runAction("products-search", () => searchProducts(searchQuery))}
          />
          <ActionButton
            label="Products by Category"
            loading={loadingKey === "products-by-category"}
            onPress={() =>
              runAction("products-by-category", () =>
                getProductsByCategory(categorySlug)
              )
            }
          />
          <ActionButton
            label="Add Product"
            loading={loadingKey === "products-add"}
            onPress={() =>
              runAction("products-add", () =>
                addProduct({
                  title: "Dev Test Product",
                  description: "Created from Developer API Test screen",
                  price: 99,
                })
              )
            }
          />
          <ActionButton
            label="Update Product"
            loading={loadingKey === "products-update"}
            onPress={() =>
              runAction("products-update", () =>
                updateProduct(numericProductId, {
                  title: "Updated by Developer API Test",
                })
              )
            }
          />
          <ActionButton
            label="Delete Product"
            loading={loadingKey === "products-delete"}
            onPress={() =>
              runAction("products-delete", () => deleteProduct(numericProductId))
            }
          />
        </View>

        <Text style={styles.sectionTitle}>Response</Text>
        <View style={styles.outputBox}>
          <Text style={styles.outputText}>{output}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const ActionButton = ({ label, onPress, loading }) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress} disabled={loading}>
    {loading ? (
      <ActivityIndicator color="#fff" size="small" />
    ) : (
      <Text style={styles.actionLabel}>{label}</Text>
    )}
  </TouchableOpacity>
);

export default DeveloperApiTestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  headerSpacer: {
    width: 30,
  },
  content: {
    padding: 16,
    paddingBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginTop: 10,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    color: "#000",
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  actionButton: {
    backgroundColor: "rgba(248, 55, 88, 1)",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    minWidth: "47%",
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
  outputBox: {
    backgroundColor: "#111",
    borderRadius: 8,
    padding: 12,
    minHeight: 180,
  },
  outputText: {
    color: "#f7f7f7",
    fontSize: 12,
    lineHeight: 18,
  },
});