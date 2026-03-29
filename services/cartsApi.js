const CARTS_BASE_URL = "https://dummyjson.com/carts";
const CARTS_REQUEST_TIMEOUT_MS = 12000;

const fetchJsonWithTimeout = async (url, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CARTS_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    const data = await response.json().catch(() => ({}));
    return { response, data };
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error("Cart request timed out. Please try again.");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

const parseNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const mapServerProductToCartItem = (product, sourceCartId = null) => ({
  id: sourceCartId ? `${sourceCartId}-${String(product?.id)}` : String(product?.id),
  productId: String(product?.id),
  productName: product?.title || "Product",
  productPrice: parseNumber(product?.price),
  productImage: product?.thumbnail || "",
  quantity: parseNumber(product?.quantity, 1),
  size: "Standard",
  sourceCartId,
});

const toApiProducts = (cart = []) => {
  const groupedByProductId = cart.reduce((accumulator, item) => {
    const key = String(item?.productId || item?.id || "");
    if (!key) return accumulator;

    const existing = accumulator[key] || 0;
    accumulator[key] = existing + parseNumber(item?.quantity, 1);
    return accumulator;
  }, {});

  return Object.entries(groupedByProductId).map(([id, quantity]) => ({
    id: parseNumber(id),
    quantity: parseNumber(quantity, 1),
  }));
};

export const getAllCarts = async () => {
  const { response, data } = await fetchJsonWithTimeout(CARTS_BASE_URL);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to fetch carts");
  }

  return data;
};

export const getSingleCart = async (cartId) => {
  const { response, data } = await fetchJsonWithTimeout(`${CARTS_BASE_URL}/${cartId}`);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to fetch cart");
  }

  return data;
};

export const getCartsByUser = async (userId) => {
  const { response, data } = await fetchJsonWithTimeout(`${CARTS_BASE_URL}/user/${userId}`);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to fetch user carts");
  }

  return data;
};

export const addNewCart = async ({ userId, products }) => {
  const { response, data } = await fetchJsonWithTimeout(`${CARTS_BASE_URL}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, products }),
  });

  if (!response.ok) {
    throw new Error(data?.message || "Failed to add cart");
  }

  return data;
};

export const updateCartById = async (cartId, { products, merge = true, method = "PUT" }) => {
  const { response, data } = await fetchJsonWithTimeout(`${CARTS_BASE_URL}/${cartId}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ merge, products }),
  });

  if (!response.ok) {
    throw new Error(data?.message || "Failed to update cart");
  }

  return data;
};

export const deleteCartById = async (cartId) => {
  const { response, data } = await fetchJsonWithTimeout(`${CARTS_BASE_URL}/${cartId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(data?.message || "Failed to delete cart");
  }

  return data;
};

export const buildApiProductsPayload = (cart = []) => toApiProducts(cart);