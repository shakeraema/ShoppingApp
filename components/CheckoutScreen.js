import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  // SafeAreaView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import { clearCart } from "../redux/cartSlice";
import { createOrder } from "../redux/ordersSlice";
import {
  saveBillingAddress,
  saveCardDetails,
  savePaymentMethod,
  saveShippingAddress,
} from "../redux/checkoutSlice";

const CheckoutScreen = ({ navigation }) => {
  const { cartsByUser } = useSelector((state) => state.cart);
  const userId = useSelector((state) => state.auth.userData?.id);
  const user = useSelector((state) => state.auth.userData);
  const savedCheckout = useSelector(
    (state) => state.checkout.savedByUser[userId] || null
  );
  const cart = (userId && cartsByUser[userId]) || [];
  const dispatch = useDispatch();
  const getTotalPrice = () =>
    cart.reduce((total, item) => total + item.productPrice * item.quantity, 0);

  // Loading State
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Shipping Address State
  const emptyShippingAddress = {
    firstName: "",
    lastName: "",
    streetAddress: "",
    aptNumber: "",
    state: "",
    zip: "",
  };
  const emptyBillingAddress = {
    streetAddress: "",
    aptNumber: "",
    state: "",
    zip: "",
  };

  const [shippingAddress, setShippingAddress] = useState(
    savedCheckout?.savedShippingAddress || emptyShippingAddress
  );

  // Billing Address State
  const [billingAddress, setBillingAddress] = useState(
    savedCheckout?.savedBillingAddress || emptyBillingAddress
  );

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState(
    savedCheckout?.savedPaymentMethod || "card"
  ); // 'card', 'bkash', 'cod'
  const [cardDetails, setCardDetails] = useState({
    number: savedCheckout?.savedCardDetails?.number || "",
    expiry: savedCheckout?.savedCardDetails?.expiry || "",
    cvv: savedCheckout?.savedCardDetails?.cvv || "",
  });

  // Toggles
  const [saveAddress, setSaveAddress] = useState(false);
  const [saveCard, setSaveCard] = useState(false);
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Calculate Order Summary
  const subtotal = getTotalPrice();
  const shipping = 5.50;
  const beforeTax = subtotal + shipping;
  const tax = beforeTax * 0.132; // ~13.2% tax
  const orderTotal = beforeTax + tax;
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (!savedCheckout) {
      setShippingAddress(emptyShippingAddress);
      setBillingAddress(emptyBillingAddress);
      setPaymentMethod("card");
      setCardDetails({ number: "", expiry: "", cvv: "" });
      return;
    }

    setShippingAddress(savedCheckout.savedShippingAddress);
    setBillingAddress(savedCheckout.savedBillingAddress);
    setPaymentMethod(savedCheckout.savedPaymentMethod);
    setCardDetails(savedCheckout.savedCardDetails);
  }, [savedCheckout]);

  const handlePlaceOrder = async () => {
    if (!userId || !user) {
      Alert.alert("Error", "Please login to place an order");
      return;
    }
    // Validate shipping address
    if (
      !shippingAddress.firstName ||
      !shippingAddress.lastName ||
      !shippingAddress.streetAddress ||
      !shippingAddress.state ||
      !shippingAddress.zip
    ) {
      Alert.alert("Error", "Please fill in all required shipping address fields");
      return;
    }

    // Validate payment method
    if (paymentMethod === "card") {
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv) {
        Alert.alert("Error", "Please fill in all card details");
        return;
      }
    }

    // Check terms agreement
    if (!agreeToTerms) {
      Alert.alert("Error", "Please agree to the Privacy Policy and Terms of Use");
      return;
    }

    // Check if cart is empty
    if (cart.length === 0) {
      Alert.alert("Error", "Your cart is empty");
      return;
    }

    setIsPlacingOrder(true);

    try {
      // Prepare order data
      const orderData = {
        shippingAddress,
        billingAddress: sameAsBilling ? shippingAddress : billingAddress,
        paymentMethod,
        items: cart,
        subtotal,
        shipping,
        tax,
        total: orderTotal,
      };

      const response = await dispatch(createOrder(orderData)).unwrap();

      if (saveAddress) {
        dispatch(saveShippingAddress({ userId, address: shippingAddress }));
        dispatch(
          saveBillingAddress({
            userId,
            address: sameAsBilling ? shippingAddress : billingAddress,
          })
        );
      }

      if (saveCard && paymentMethod === "card") {
        dispatch(saveCardDetails({ userId, card: cardDetails }));
      }

      dispatch(savePaymentMethod({ userId, method: paymentMethod }));

      // Clear cart from Redux after successful order
      dispatch(clearCart());

      // Show success message with order ID
      Alert.alert(
        "Order Placed Successfully!",
        `Your order #${response.order.id} has been placed.\nTotal: ₦${orderTotal.toFixed(2)}`,
        [
          {
            text: "View Orders",
            onPress: () => navigation.navigate("Orders"),
          },
          {
            text: "Go to Home",
            onPress: () => navigation.navigate("Home"),
          },
        ]
      );
    } catch (error) {
      console.error("Order placement error:", error);
      Alert.alert("Order Failed", error || "Failed to place order. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const renderShippingAddress = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Shipping Address</Text>

      <View style={styles.row}>
        <View style={[styles.inputContainer, styles.halfWidth]}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            value={shippingAddress.firstName}
            onChangeText={(text) =>
              setShippingAddress({ ...shippingAddress, firstName: text })
            }
            placeholder="Enter first name"
          />
        </View>

        <View style={[styles.inputContainer, styles.halfWidth]}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={shippingAddress.lastName}
            onChangeText={(text) =>
              setShippingAddress({ ...shippingAddress, lastName: text })
            }
            placeholder="Enter last name"
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Street Address</Text>
        <TextInput
          style={styles.input}
          value={shippingAddress.streetAddress}
          onChangeText={(text) =>
            setShippingAddress({ ...shippingAddress, streetAddress: text })
          }
          placeholder="Enter street address"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Apt Number</Text>
        <TextInput
          style={styles.input}
          value={shippingAddress.aptNumber}
          onChangeText={(text) =>
            setShippingAddress({ ...shippingAddress, aptNumber: text })
          }
          placeholder="Enter apartment number (optional)"
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputContainer, styles.halfWidth]}>
          <Text style={styles.label}>State</Text>
          <TextInput
            style={styles.input}
            value={shippingAddress.state}
            onChangeText={(text) =>
              setShippingAddress({ ...shippingAddress, state: text })
            }
            placeholder="State"
          />
        </View>

        <View style={[styles.inputContainer, styles.halfWidth]}>
          <Text style={styles.label}>Zip</Text>
          <TextInput
            style={styles.input}
            value={shippingAddress.zip}
            onChangeText={(text) =>
              setShippingAddress({ ...shippingAddress, zip: text })
            }
            placeholder="Zip code"
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Save this Address</Text>
        <Switch
          value={saveAddress}
          onValueChange={setSaveAddress}
          trackColor={{ false: "#ddd", true: "rgba(248, 55, 88, 0.5)" }}
          thumbColor={saveAddress ? "rgba(248, 55, 88, 1)" : "#f4f3f4"}
        />
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Add New Address</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderOrderSummary = () => (
    
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Order Summary</Text>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Items ({itemCount})</Text>
        <Text style={styles.summaryValue}>{subtotal.toFixed(2)}</Text>
      </View>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Shipping and handling:</Text>
        <Text style={styles.summaryValue}>{shipping.toFixed(2)}</Text>
      </View>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Before tax:</Text>
        <Text style={styles.summaryValue}>{beforeTax.toFixed(2)}</Text>
      </View>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Tax Collected:</Text>
        <Text style={styles.summaryValue}>{tax.toFixed(2)}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.summaryRow}>
        <Text style={styles.totalLabel}>Order Total:</Text>
        <Text style={styles.totalValue}>{orderTotal.toFixed(2)}</Text>
      </View>
    </View>
  );

  const renderPaymentMethod = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Payment Method</Text>

      {/* Payment Method Selection */}
      <View style={styles.paymentOptions}>
        <TouchableOpacity
          style={[
            styles.paymentOption,
            paymentMethod === "card" && styles.paymentOptionActive,
          ]}
          onPress={() => setPaymentMethod("card")}
        >
          <MaterialIcons
            name="credit-card"
            size={24}
            color={paymentMethod === "card" ? "rgba(248, 55, 88, 1)" : "#666"}
          />
          <Text
            style={[
              styles.paymentOptionText,
              paymentMethod === "card" && styles.paymentOptionTextActive,
            ]}
          >
            Credit or Debit Card
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.paymentOption,
            paymentMethod === "bkash" && styles.paymentOptionActive,
          ]}
          onPress={() => setPaymentMethod("bkash")}
        >
          <MaterialIcons
            name="phone-android"
            size={24}
            color={paymentMethod === "bkash" ? "rgba(248, 55, 88, 1)" : "#666"}
          />
          <Text
            style={[
              styles.paymentOptionText,
              paymentMethod === "bkash" && styles.paymentOptionTextActive,
            ]}
          >
            bKash
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.paymentOption,
            paymentMethod === "cod" && styles.paymentOptionActive,
          ]}
          onPress={() => setPaymentMethod("cod")}
        >
          <MaterialIcons
            name="local-shipping"
            size={24}
            color={paymentMethod === "cod" ? "rgba(248, 55, 88, 1)" : "#666"}
          />
          <Text
            style={[
              styles.paymentOptionText,
              paymentMethod === "cod" && styles.paymentOptionTextActive,
            ]}
          >
            Cash on Delivery
          </Text>
        </TouchableOpacity>
      </View>

      {/* Card Details Form */}
      {paymentMethod === "card" && (
        <>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Card Number</Text>
            <TextInput
              style={styles.input}
              value={cardDetails.number}
              onChangeText={(text) =>
                setCardDetails({ ...cardDetails, number: text })
              }
              placeholder="3458 XXXX XXXX XXXX"
              keyboardType="numeric"
              maxLength={16}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>Expiry Date</Text>
              <TextInput
                style={styles.input}
                value={cardDetails.expiry}
                onChangeText={(text) =>
                  setCardDetails({ ...cardDetails, expiry: text })
                }
                placeholder="mm / yy"
                keyboardType="numbers-and-punctuation"
                maxLength={7}
              />
            </View>

            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>CVV</Text>
              <TextInput
                style={styles.input}
                value={cardDetails.cvv}
                onChangeText={(text) =>
                  setCardDetails({ ...cardDetails, cvv: text })
                }
                placeholder="582"
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
              />
            </View>
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Save this credit card for later use</Text>
            <Switch
              value={saveCard}
              onValueChange={setSaveCard}
              trackColor={{ false: "#ddd", true: "rgba(248, 55, 88, 0.5)" }}
              thumbColor={saveCard ? "rgba(248, 55, 88, 1)" : "#f4f3f4"}
            />
          </View>

          {/* Billing Address */}
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Billing address same as shipping address</Text>
            <Switch
              value={sameAsBilling}
              onValueChange={setSameAsBilling}
              trackColor={{ false: "#ddd", true: "rgba(248, 55, 88, 0.5)" }}
              thumbColor={sameAsBilling ? "rgba(248, 55, 88, 1)" : "#f4f3f4"}
            />
          </View>

          {!sameAsBilling && (
            <>
              <Text style={styles.subSectionTitle}>Billing Address</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Street Address</Text>
                <TextInput
                  style={styles.input}
                  value={billingAddress.streetAddress}
                  onChangeText={(text) =>
                    setBillingAddress({ ...billingAddress, streetAddress: text })
                  }
                  placeholder="Enter street address"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Apt Number</Text>
                <TextInput
                  style={styles.input}
                  value={billingAddress.aptNumber}
                  onChangeText={(text) =>
                    setBillingAddress({ ...billingAddress, aptNumber: text })
                  }
                  placeholder="Enter apartment number (optional)"
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text style={styles.label}>State</Text>
                  <TextInput
                    style={styles.input}
                    value={billingAddress.state}
                    onChangeText={(text) =>
                      setBillingAddress({ ...billingAddress, state: text })
                    }
                    placeholder="State"
                  />
                </View>

                <View style={[styles.inputContainer, styles.halfWidth]}>
                  <Text style={styles.label}>Zip</Text>
                  <TextInput
                    style={styles.input}
                    value={billingAddress.zip}
                    onChangeText={(text) =>
                      setBillingAddress({ ...billingAddress, zip: text })
                    }
                    placeholder="Zip code"
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </>
          )}
        </>
      )}

      {/* bKash Payment Info */}
      {paymentMethod === "bkash" && (
        <View style={styles.infoBox}>
          <MaterialIcons name="info-outline" size={20} color="rgba(248, 55, 88, 1)" />
          <Text style={styles.infoText}>
            You will be redirected to bKash payment gateway to complete your payment.
          </Text>
        </View>
      )}

      {/* Cash on Delivery Info */}
      {paymentMethod === "cod" && (
        <View style={styles.infoBox}>
          <MaterialIcons name="info-outline" size={20} color="rgba(248, 55, 88, 1)" />
          <Text style={styles.infoText}>
            Please keep exact change ready. Payment will be collected upon delivery.
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {renderShippingAddress()}
          {renderOrderSummary()}
          {renderPaymentMethod()}

          {/* Terms Agreement */}
          <View style={styles.termsContainer}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setAgreeToTerms(!agreeToTerms)}
            >
              <MaterialIcons
                name={agreeToTerms ? "check-box" : "check-box-outline-blank"}
                size={24}
                color={agreeToTerms ? "rgba(248, 55, 88, 1)" : "#ccc"}
              />
            </TouchableOpacity>
            <Text style={styles.termsText}>
              By placing your order, you agree to our company{" "}
              <Text style={styles.termsLink}>Privacy policy</Text> and{" "}
              <Text style={styles.termsLink}>Conditions of use</Text>.
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.placeOrderButton,
                isPlacingOrder && styles.placeOrderButtonDisabled,
              ]}
              onPress={handlePlaceOrder}
              disabled={isPlacingOrder}
            >
              {isPlacingOrder ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.placeOrderButtonText}>Place Order</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 15,
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
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 15,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginTop: 15,
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 14,
    color: "#000",
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  switchLabel: {
    fontSize: 14,
    color: "#333",
    flex: 1,
    marginRight: 10,
  },
  buttonRow: {
    marginTop: 10,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "rgba(248, 55, 88, 1)",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "rgba(248, 55, 88, 1)",
    fontSize: 14,
    fontWeight: "600",
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
  paymentOptions: {
    marginBottom: 20,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 12,
  },
  paymentOptionActive: {
    borderColor: "rgba(248, 55, 88, 1)",
    backgroundColor: "rgba(248, 55, 88, 0.05)",
  },
  paymentOptionText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 12,
    fontWeight: "500",
  },
  paymentOptionTextActive: {
    color: "rgba(248, 55, 88, 1)",
    fontWeight: "600",
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "rgba(248, 55, 88, 0.1)",
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
  },
  infoText: {
    fontSize: 13,
    color: "#333",
    marginLeft: 10,
    flex: 1,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 20,
    paddingHorizontal: 5,
  },
  checkbox: {
    marginRight: 10,
    marginTop: 2,
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    color: "#666",
    lineHeight: 20,
  },
  termsLink: {
    color: "rgba(248, 55, 88, 1)",
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 25,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  placeOrderButton: {
    flex: 2,
    backgroundColor: "rgba(248, 55, 88, 1)",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
  },
  placeOrderButtonDisabled: {
    backgroundColor: "rgba(248, 55, 88, 0.5)",
  },
  placeOrderButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
