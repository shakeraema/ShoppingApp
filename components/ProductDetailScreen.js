import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import { addToCart } from "../redux/cartSlice";

const { width } = Dimensions.get("window");

const ProductDetailScreen = ({ navigation, route }) => {
  const { product } = route.params;
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [isAdding, setIsAdding] = useState(false);

  const sizes = ["S", "M", "L", "XL"];

  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await dispatch(
        addToCart({ product, quantity, size: selectedSize })
      ).unwrap();
      setIsAdding(false);
      Alert.alert(
        "Success",
        "Item added to cart!",
        [
          {
            text: "Continue Shopping",
            onPress: () => navigation.goBack(),
            style: "default",
          },
          {
            text: "Go to Cart",
            onPress: () => navigation.navigate("Cart"),
            style: "default",
          },
        ]
      );
    } catch (error) {
      setIsAdding(false);
      Alert.alert("Error", error || "Failed to add item to cart");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={34} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <TouchableOpacity>
          <MaterialIcons name="favorite-border" size={30} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={product.image} style={styles.productImage} />
          {product.discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{product.discount}</Text>
            </View>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.productName}>{product.name}</Text>

          <View style={styles.priceContainer}>
            <Text style={styles.currentPrice}>{product.price}</Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>{product.originalPrice}</Text>
            )}
          </View>

          {/* Rating */}
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={20} color="#FFD700" />
            <Text style={styles.ratingText}>4.5</Text>
            <Text style={styles.reviewText}>(320 reviews)</Text>
          </View>

          {/* Size Selection */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Select Size</Text>
            <View style={styles.sizeContainer}>
              {sizes.map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.sizeButton,
                    selectedSize === size && styles.sizeButtonActive,
                  ]}
                  onPress={() => setSelectedSize(size)}
                >
                  <Text
                    style={[
                      styles.sizeText,
                      selectedSize === size && styles.sizeTextActive,
                    ]}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Quantity Selector */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={decrementQuantity}
              >
                <MaterialIcons name="remove" size={20} color="#000" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={incrementQuantity}
              >
                <MaterialIcons name="add" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Description */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>
              {product.description ||
                "This is a high-quality product designed to meet your needs. Made with premium materials and attention to detail, it offers excellent value for money. Perfect for everyday use and special occasions alike."}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Price</Text>
          <Text style={styles.totalPrice}>
            ₦{" "}
            {(
              parseInt(product.price.replace(/[₦,]/g, "")) * quantity
            ).toLocaleString()}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.addToCartButton, isAdding && styles.addToCartButtonDisabled]}
          onPress={handleAddToCart}
          disabled={isAdding}
        >
          {isAdding ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <MaterialIcons name="shopping-cart" size={20} color="#fff" />
              <Text style={styles.addToCartText}>Add to Cart</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductDetailScreen;

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
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  imageContainer: {
    width: "100%",
    height: 300,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  productImage: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
  },
  discountBadge: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
  },
  discountText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  infoContainer: {
    padding: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  currentPrice: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
    marginRight: 10,
  },
  originalPrice: {
    fontSize: 18,
    color: "#999",
    textDecorationLine: "line-through",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 5,
    color: "#000",
  },
  reviewText: {
    fontSize: 14,
    color: "#999",
    marginLeft: 5,
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
  },
  sizeContainer: {
    flexDirection: "row",
    gap: 12,
  },
  sizeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  sizeButtonActive: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  sizeText: {
    fontSize: 16,
    color: "#000",
  },
  sizeTextActive: {
    color: "#fff",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#d6cece",
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    minWidth: 30,
    textAlign: "center",
  },
  descriptionText: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingVertical: 15,
    backgroundColor: "#d7cfcf",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    // marginBottom: 20,
  },
  totalContainer: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 12,
    color: "#343333",
    marginBottom: 10,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    marginBottom: 30,
  },
  addToCartButton: {
    flexDirection: "row",
    backgroundColor: "#000",
    paddingVertical: 15,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: "center",
    gap: 12,
    marginBottom: 30,
  },
  addToCartButtonActive: {
    backgroundColor: "#000",
  },
  addToCartText: {
  },
  addToCartButtonDisabled: {
    opacity: 0.6,
    backgroundColor: "#666",
  },
  addToCartText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
