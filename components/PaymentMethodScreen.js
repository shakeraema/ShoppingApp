import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const PaymentMethodsScreen = ({ navigation }) => {
  const paymentMethods = [
    {
      id: "1",
      title: "Card",
      icon: "credit-card",
      description: "Visa, Mastercard, Amex",
      color: "#4c5baf",
    },
    {
      id: "2",
      title: "bKash",
      icon: "account-balance-wallet",
      description: "Mobile money service",
      color: "#ff00b3",
    },
    {
      id: "3",
      title: "Cash on Delivery",
      icon: "local-shipping",
      description: "Pay when you receive",
      color: "#047e16",
    },
  ];

  const handleSelectPayment = (method) => {
    Alert.alert(
      method.title,
      `Use ${method.title} as payment method?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Select", onPress: () => Alert.alert("Success", `${method.title} selected!`) },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={34} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        <Text style={styles.sectionTitle}>Available Payment Methods</Text>

        {/* Payment Methods List */}
        <View style={styles.methodsContainer}>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={styles.methodCard}
              onPress={() => handleSelectPayment(method)}
            >
              <View
                style={[styles.iconContainer, { backgroundColor: method.color }]}
              >
                <MaterialIcons name={method.icon} size={32} color="#fff" />
              </View>

              <View style={styles.methodInfo}>
                <Text style={styles.methodTitle}>{method.title}</Text>
                <Text style={styles.methodDescription}>
                  {method.description}
                </Text>
              </View>

              <MaterialIcons name="chevron-right" size={24} color="#999" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Add New Payment Method
        <TouchableOpacity style={styles.addButton}>
          <MaterialIcons name="add-circle-outline" size={24} color="#FF6B35" />
          <Text style={styles.addButtonText}>Add New Payment Method</Text>
        </TouchableOpacity> */}
      </ScrollView>
    </View>
  );
};

export default PaymentMethodsScreen;

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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginTop: 30,
    marginBottom: 20,
  },
  methodsContainer: {
    gap: 15,
    marginBottom: 30,
  },
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 13,
    color: "#999",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FF6B35",
    borderRadius: 10,
    paddingVertical: 16,
    gap: 10,
    marginBottom: 50,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF6B35",
  },
});