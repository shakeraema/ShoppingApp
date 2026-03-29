const BASE_URL = "https://dummyjson.com/products";
const PRODUCTS_LIMIT = 30;

const CATEGORY_ICON_MAP = { 
  // A mapping of product category slugs to corresponding icon names, which can be used to display relevant icons for each category in the UI. If a category slug does not have a specific icon mapping, a default "category" icon will be used.
  smartphones: "phone-android", 
  "mobile-accessories": "devices",
  laptops: "laptop",
  tablets: "tablet-mac",
  beauty: "spa",
  fragrances: "local-florist",
  skin: "face",
  groceries: "shopping-basket",
  furniture: "weekend",
  "home-decoration": "home",
  "kitchen-accessories": "kitchen",
  tops: "checkroom",
  "womens-dresses": "checkroom",
  "womens-shoes": "directions-run",
  "mens-shirts": "checkroom",
  "mens-shoes": "directions-run",
  "mens-watches": "watch",
  "womens-watches": "watch",
  "womens-bags": "shopping-bag",
  "womens-jewellery": "diamond",
  sunglasses: "visibility",
  automotive: "directions-car",
  motorcycle: "two-wheeler",
  lighting: "lightbulb",
  sports: "sports-soccer",
};

const CATEGORY_COLORS = [
  "#FF6B35",
  "#4ECDC4",
  "#18413a",
  "#5d2222",
  "#231545",
  "#ff88b6",
  "#d0d058",
  "#63bcdc",
  "#f89898",
  "#7493a9",
  "#efc10a",
  "#52d764",
];

const formatNaira = (amount) => `₦ ${Number(amount || 0).toLocaleString()}`; // what is naira? Naira is the currency of Nigeria, represented by the symbol "₦". The formatNaira function takes a numeric amount and formats it as a string with the Naira symbol followed by the amount formatted with commas as thousand separators. For example, if you pass 1000000 to formatNaira, it will return "₦ 1,000,000".

const toTitleCase = (value = "") => // Converts a string to Title Case (capitalizing the first letter of each word) by replacing hyphens with spaces, splitting into words, capitalizing each word, and joining them back together.
  value
    .replace(/-/g, " ")
    .split(" ")
    .filter(Boolean) // Remove empty strings resulting from multiple spaces
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word and concatenate it with the rest of the word
    .join(" "); // Join the capitalized words back into a single string with spaces in between

export const mapProduct = (item) => { 
  const price = Number(item?.price || 0); // Convert the price to a number, defaulting to 0 if it's not provided or not a valid number. This ensures that we have a consistent numeric value for price calculations and formatting, even if the API response is missing or malformed.
  const discountPercentage = Number(item?.discountPercentage || 0);
  const basePrice =
    discountPercentage > 0
      ? Math.round(price / (1 - discountPercentage / 100)) 
      : null; // Calculate the original price before discount based on the current price and discount percentage. If there is a valid discount percentage, we can derive the original price using the formula: originalPrice = price / (1 - discountPercentage/100). The result is rounded to the nearest whole number for cleaner display. If there is no discount, we set basePrice to null since it's not applicable.

  return {
    id: String(item?.id), 
    name: item?.title || "Product",
    price: formatNaira(price),
    originalPrice: basePrice ? formatNaira(basePrice) : null,
    discount: discountPercentage ? `${Math.round(discountPercentage)}% OFF` : null,
    image: { uri: item?.thumbnail || item?.images?.[0] || "" },
    description: item?.description || "",
    category: item?.category || "",
    rating: item?.rating ?? null,
  };
};

const mapCategory = (slug, index = 0) => ({
  id: String(index + 1),
  slug,
  name: toTitleCase(slug),
  icon: CATEGORY_ICON_MAP[slug] || "category",
  color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
});

export const getAllProducts = async () => {
  let allProducts = [];
  let skip = 0;
  let total = 0;

  do {
    const response = await fetch(
      `${BASE_URL}?limit=${PRODUCTS_LIMIT}&skip=${skip}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();
    const pageProducts = Array.isArray(data?.products) ? data.products : [];
    allProducts = [...allProducts, ...pageProducts];
    total = Number(data?.total || pageProducts.length || 0);
    skip += PRODUCTS_LIMIT;
  } while (skip < total);

  return allProducts.map(mapProduct);
};

export const getProductsPage = async ({ limit = 10, skip = 0 } = {}) => {
  const safeLimit = Math.max(1, Number(limit) || 10);
  const safeSkip = Math.max(0, Number(skip) || 0);

  const response = await fetch(
    `${BASE_URL}?limit=${safeLimit}&skip=${safeSkip}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await response.json();
  const products = Array.isArray(data?.products) ? data.products.map(mapProduct) : [];

  return {
    products,
    total: Number(data?.total || 0),
    skip: Number(data?.skip || safeSkip),
    limit: Number(data?.limit || safeLimit),
  };
};

export const getSingleProduct = async (productId) => {
  const response = await fetch(`${BASE_URL}/${productId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  const data = await response.json();
  return mapProduct(data);
};

export const getCategories = async () => {
  const response = await fetch(`${BASE_URL}/category-list`);

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  const data = await response.json();
  const categories = Array.isArray(data) ? data : [];
  return categories.map((slug, index) => mapCategory(slug, index));
};

export const searchProducts = async (query) => {
  const trimmedQuery = String(query || "").trim();
  if (!trimmedQuery) return [];

  const response = await fetch(
    `${BASE_URL}/search?q=${encodeURIComponent(trimmedQuery)}`
  );

  if (!response.ok) {
    throw new Error("Failed to search products");
  }

  const data = await response.json();
  const products = Array.isArray(data?.products) ? data.products : [];
  return products.map(mapProduct);
};

export const getProductsByCategory = async (categorySlug) => {
  const response = await fetch(
    `${BASE_URL}/category/${encodeURIComponent(categorySlug)}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch category products");
  }

  const data = await response.json();
  const products = Array.isArray(data?.products) ? data.products : [];
  return products.map(mapProduct);
};

export const addProduct = async (productData) => {
  const response = await fetch(`${BASE_URL}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    throw new Error("Failed to add product");
  }

  return response.json();
};

export const updateProduct = async (productId, updates, method = "PUT") => {
  const response = await fetch(`${BASE_URL}/${productId}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error("Failed to update product");
  }

  return response.json();
};

export const deleteProduct = async (productId) => {
  const response = await fetch(`${BASE_URL}/${productId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete product");
  }

  return response.json();
};
