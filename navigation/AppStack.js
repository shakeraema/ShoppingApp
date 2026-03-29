import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import HomeScreen from "../components/HomeScreen";
import ProfileScreen from "../components/ProfileScreen";
import SearchScreen from "../components/SearchScreen";
import CategoriesScreen from "../components/CategoriesScreen";
import ProductDetailScreen from "../components/ProductDetailScreen";
import CartScreen from "../components/CartScreen";
import CheckoutScreen from "../components/CheckoutScreen";
import OrdersScreen from "../components/OrdersScreen";
import OrderDetailScreen from "../components/OrderDetailScreen";
import PaymentMethodsScreen from "../components/PaymentMethodScreen";
import EditProfileScreen from "../components/EditProfileScreen";
import DeveloperApiTestScreen from "../components/DeveloperApiTestScreen";

const Stack = createNativeStackNavigator();

// / App Stack - for authenticated users

export default function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
        cardStyle: { backgroundColor: "#fff" },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Categories" component={CategoriesScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="Orders" component={OrdersScreen} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="DeveloperApiTest" component={DeveloperApiTestScreen} />
    </Stack.Navigator>
  );
}