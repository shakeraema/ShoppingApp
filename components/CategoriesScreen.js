import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { getCategories } from "../services/productsApi";

const CategoriesScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      setLoading(true);
      try {
        const categoriesData = await getCategories();
        if (isMounted) { 
          // check to ensure that the component is still mounted before updating state with the fetched categories data. This prevents potential memory leaks or errors if the component has been unmounted while the asynchronous operation was still in progress.
          setCategories(categoriesData);
        }
      } catch (error) {
        if (isMounted) {
          Alert.alert("Error", "Failed to fetch categories");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCategories(); // load kortesi component mount howar por and handle loading state and errors appropriately. 

    return () => {
      isMounted = false; 
      // Set isMounted to false when the component unmounts to prevent state updates on an unmounted component- can lead to memory leaks or errors.
    };
  }, []);

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.categoryCard, { backgroundColor: item.color }]}
      onPress={() =>
        navigation.navigate("Search", {
          categorySlug: item.slug, //slug mane category er unique identifier, ja Search screen e use hobe products filter korar jonno based on the selected category. By passing the category slug as a parameter, we can ensure that the Search screen displays only products that belong to the chosen category, providing a more relevant and streamlined shopping experience for users.
          categoryName: item.name,
        })
      }
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

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="rgba(248, 55, 88, 1)" />
        </View>
      ) : (
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          numColumns={2} //show only 2 column
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default CategoriesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: "#ffffff",
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
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    textAlign: "center",
  },
});
