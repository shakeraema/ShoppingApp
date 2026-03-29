const AUTH_BASE_URL = "https://dummyjson.com/auth"; // The base URL for authentication-related API endpoints, used for login, fetching current user and refreshing sessions.
const USERS_BASE_URL = "https://dummyjson.com/users";

const toAuthUser = (data) => ({ // Converts raw user data from the API into a standardized format for authentication purposes, extracting relevant fields and providing defaults where necessary.
  id: data?.id, // The unique identifier for the user, extracted from the API response.
  username: data?.username, // The username of the user, extracted from the API response.
  name:
    [data?.firstName, data?.lastName].filter(Boolean).join(" ") || // Combines the first and last name into a full name, or falls back to the username if both are missing.
    data?.username ||
    "User",
  firstName: data?.firstName || "",
  lastName: data?.lastName || "",
  email: data?.email || "",
  gender: data?.gender || "",
  image: data?.image || "",
});

const resolveUsername = async (emailOrUsername) => { // Resolves a username from an email or username input by checking if the input contains an "@" symbol (indicating it's likely an email) and fetching the corresponding user data from the API to extract the username. If the input is already a username, it returns it directly.
  const value = String(emailOrUsername || "").trim(); // Converts the input to a string and trims whitespace to ensure it's in a consistent format for processing.
  if (!value) return ""; // If the input is empty after trimming, return an empty string immediately to avoid unnecessary API calls.

  if (!value.includes("@")) { // If the input does not contain an "@" symbol, we assume it's already a username and return it directly without making an API call.
    return value;
  }

  const response = await fetch( // Makes a GET request to the API to filter users by email, encoding the email value to ensure it's safely included in the URL. The API is expected to return a list of users matching the email, from which we will extract the username.
    `${USERS_BASE_URL}/filter?key=email&value=${encodeURIComponent(value)}` // The endpoint for filtering users based on a specific key-value pair, in this case, filtering by email. The email value is URL-encoded to handle special characters properly.
  );

  if (!response.ok) { // API response zodi ok na hoy, mane 200-299 status code na hoy, to error throw korbe with a message indicating that the username resolution failed. This helps in debugging and provides feedback on what went wrong during the API call.
    throw new Error("Failed to resolve username");
  }

  const data = await response.json(); //json theke js object e convert kre userdata extract kra
  const users = Array.isArray(data?.users) ? data.users : []; // check kortesi je API response e users array ache kina, jodi thake tobe seta use korbe, na thakle empty array use korbe to avoid errors
  return users[0]?.username || "";
};

export const loginAuth = async ({ email, username, password, expiresInMins = 30 }) => { // login handle korar func, expiresInMins means how long the session should last before it expires, defaulting to 30 minutes if not provided. This value is sent to the API to determine the expiration time of the access token.
  const usernameValue = await resolveUsername(username || email); // resolveUsername function ke call kore username resolve korchi, jodi username na thake tobe email diye resolve korbe. Ete kore user easily login korte parbe using either their email or username without worrying about which one to use.

  if (!usernameValue) {
    throw new Error("User not found for provided credentials");
  }

  const response = await fetch(`${AUTH_BASE_URL}/login`, { 
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: usernameValue,
      password,
      expiresInMins,
    }),
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Login failed");
  }

  return {
    user: toAuthUser(data),
    accessToken: data?.accessToken,
    refreshToken: data?.refreshToken,
  };
};

export const getCurrentAuthUser = async (accessToken) => {
  const response = await fetch(`${AUTH_BASE_URL}/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Failed to get current user");
  }

  return toAuthUser(data);
};

export const refreshAuthSession = async ({ refreshToken, expiresInMins = 30 }) => {
  const response = await fetch(`${AUTH_BASE_URL}/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      refreshToken,
      expiresInMins,
    }),
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Failed to refresh session");
  }

  return {
    accessToken: data?.accessToken,
    refreshToken: data?.refreshToken,
  };
};

export const getDummyUserProfile = async (userId) => {
  const response = await fetch(`${USERS_BASE_URL}/${userId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Failed to fetch user profile");
  }

  return data;
};
