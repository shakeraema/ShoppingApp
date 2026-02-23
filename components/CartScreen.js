import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import { removeFromCart, updateQuantity } from "../redux/cartSlice";

const CartScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { cartsByUser, loading } = useSelector((state) => state.cart);
  const userId = useSelector((state) => state.auth.userData?.id);
  const cart = (userId && cartsByUser[userId]) || [];
  const getTotalPrice = () =>
    cart.reduce((total, item) => total + item.productPrice * item.quantity, 0);

  const handleRemoveItem = (itemId) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from cart?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          onPress: async () => {
            try {
              await dispatch(removeFromCart(itemId)).unwrap();
              Alert.alert("Success", "Item removed from cart");
            } catch (error) {
              Alert.alert("Error", error || "Failed to remove item");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleIncreaseQuantity = async (itemId, currentQuantity) => { //itemId mane kon item er quantity update korte hobe, currentQuantity mane oi item er current quantity
    try {
      await dispatch(
        updateQuantity({ itemId, quantity: currentQuantity + 1 })
      ).unwrap(); //dispatch er maddhome updateQuantity action call kora, jekhane itemId and new quantity pass kora hoyeche, unwrap mane promise ke resolve kora, jodi update successful hoye tobe success message deya hobe, otherwise error message deya hobe
    } catch (error) {
      Alert.alert("Error", "Failed to update quantity");
    }
  };

  const handleDecreaseQuantity = async (itemId, currentQuantity) => {
    if (currentQuantity > 1) {
      try {
        await dispatch(
          updateQuantity({ itemId, quantity: currentQuantity - 1 })
        ).unwrap();
      } catch (error) {
        Alert.alert("Error", "Failed to update quantity");
      }
    }
  };

  const handleNavigateToProduct = (item) => {
    // Transform cart item to product format expected by ProductDetailScreen
    const product = {
      id: item.productId || item.id,
      name: item.productName,
      price: `₦ ${item.productPrice.toLocaleString()}`,
      image: typeof item.productImage === "string" ? { uri: item.productImage } : item.productImage,
      description: item.productDescription || null,
    };
    navigation.navigate("ProductDetail", { product });
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <TouchableOpacity 
        style={styles.productTouchable}
        onPress={() => handleNavigateToProduct(item)}
        activeOpacity={0.7}
      >
        <Image
          source={typeof item.productImage === "string" ? { uri: item.productImage } : item.productImage}
          style={styles.productImage}
        />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.productName}</Text>
          <Text style={styles.itemSize}>Size: {item.size}</Text>
          <Text style={styles.itemPrice}>₦ {item.productPrice.toLocaleString()}</Text>

          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleDecreaseQuantity(item.id, item.quantity)}
            >
              <MaterialIcons name="remove" size={18} color="#000" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleIncreaseQuantity(item.id, item.quantity)}
            >
              <MaterialIcons name="add" size={18} color="#000" />
            </TouchableOpacity>
          </View>

          <Text style={styles.itemTotal}>
            ₦ {(item.productPrice * item.quantity).toLocaleString()}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleRemoveItem(item.id)}
      >
        <MaterialIcons name="delete-outline" size={22} color="#FF6B6B" />
      </TouchableOpacity>
    </View>
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="shopping-cart" size={80} color="#ccc" />
      <Text style={styles.emptyTitle}>Your cart is empty</Text>
      <Text style={styles.emptySubtitle}>
        Add some products to get started
      </Text>
      <TouchableOpacity
        style={styles.continueShoppingButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.continueShoppingText}>Continue Shopping</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && cart.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="rgba(248, 55, 88, 1)" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={34} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Cart Items List */}
      {cart.length > 0 ? (
        <>
          <FlatList
            data={cart}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={true}
            contentContainerStyle={styles.listContent}
          />

          {/* Bottom Checkout Section */}
          <View style={styles.checkoutSection}>
            <View style={styles.summaryContainer}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>
                  ₦ {getTotalPrice().toLocaleString()}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping</Text>
                <Text style={styles.summaryValue}>₦ 2,500</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>
                  ₦ {(getTotalPrice() + 2500).toLocaleString()}
                </Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.checkoutButton}
              onPress={() => navigation.navigate("Checkout")}
            >
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        renderEmptyCart()
      )}
    </View>
  );
};

export default CartScreen;

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
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  productTouchable: {
    flexDirection: "row",
    flex: 1,
  },
  productImage: {
    width: 80,
    height: 100,
    borderRadius: 8,
    resizeMode: "contain",
    backgroundColor: "#fff",
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  itemSize: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(248, 55, 88, 1)",
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  quantityButton: {
    width: 45,
    height: 45,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 12,
    fontWeight: "600",
    minWidth: 20,
    textAlign: "center",
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000",
  },
  deleteButton: {
    padding: 8,
  },
  checkoutSection: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#fff",
  },
  summaryContainer: {
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "rgba(248, 55, 88, 1)",
  },
  checkoutButton: {
    backgroundColor: "rgba(248, 55, 88, 1)",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 30,
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    bottom: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
  continueShoppingButton: {
    backgroundColor: "rgba(248, 55, 88, 1)",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 30,
  },
  continueShoppingText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
