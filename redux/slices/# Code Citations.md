# Code Citations

## License: MIT
https://github.com/FennecFromSahara/Group-7-IDATA2301-IDATA2306/blob/c7ecee028f12c6c9b1ba8518122beaaceef3d841/coffeeshop-frontend/src/pages/Profile/UserProfilePage.jsx

```
I'll create an Edit Profile screen with name editing, picture upload/replace/remove, and password change functionality.

````javascript
// filepath: /home/sbh/Documents/Intern-Shakera/React-Native/Linear Gradient Prac/Figma-Design/components/EditProfileScreen.js
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { updateUserProfile } from "../redux/authSlice";
import { useState } from "react";

const EditProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);

  const [name, setName] = useState(userData?.name || "");
  const [profileImage, setProfileImage] = useState(userData?.profileImage || null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShow
```


## License: MIT
https://github.com/FennecFromSahara/Group-7-IDATA2301-IDATA2306/blob/c7ecee028f12c6c9b1ba8518122beaaceef3d841/coffeeshop-frontend/src/pages/Profile/UserProfilePage.jsx

```
I'll create an Edit Profile screen with name editing, picture upload/replace/remove, and password change functionality.

````javascript
// filepath: /home/sbh/Documents/Intern-Shakera/React-Native/Linear Gradient Prac/Figma-Design/components/EditProfileScreen.js
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { updateUserProfile } from "../redux/authSlice";
import { useState } from "react";

const EditProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);

  const [name, setName] = useState(userData?.name || "");
  const [profileImage, setProfileImage] = useState(userData?.profileImage || null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShow
```


## License: MIT
https://github.com/FennecFromSahara/Group-7-IDATA2301-IDATA2306/blob/c7ecee028f12c6c9b1ba8518122beaaceef3d841/coffeeshop-frontend/src/pages/Profile/UserProfilePage.jsx

```
I'll create an Edit Profile screen with name editing, picture upload/replace/remove, and password change functionality.

````javascript
// filepath: /home/sbh/Documents/Intern-Shakera/React-Native/Linear Gradient Prac/Figma-Design/components/EditProfileScreen.js
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { updateUserProfile } from "../redux/authSlice";
import { useState } from "react";

const EditProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);

  const [name, setName] = useState(userData?.name || "");
  const [profileImage, setProfileImage] = useState(userData?.profileImage || null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShow
```


## License: MIT
https://github.com/FennecFromSahara/Group-7-IDATA2301-IDATA2306/blob/c7ecee028f12c6c9b1ba8518122beaaceef3d841/coffeeshop-frontend/src/pages/Profile/UserProfilePage.jsx

```
I'll create an Edit Profile screen with name editing, picture upload/replace/remove, and password change functionality.

````javascript
// filepath: /home/sbh/Documents/Intern-Shakera/React-Native/Linear Gradient Prac/Figma-Design/components/EditProfileScreen.js
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { updateUserProfile } from "../redux/authSlice";
import { useState } from "react";

const EditProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);

  const [name, setName] = useState(userData?.name || "");
  const [profileImage, setProfileImage] = useState(userData?.profileImage || null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShow
```


## License: MIT
https://github.com/FennecFromSahara/Group-7-IDATA2301-IDATA2306/blob/c7ecee028f12c6c9b1ba8518122beaaceef3d841/coffeeshop-frontend/src/pages/Profile/UserProfilePage.jsx

```
I'll create an Edit Profile screen with name editing, picture upload/replace/remove, and password change functionality.

````javascript
// filepath: /home/sbh/Documents/Intern-Shakera/React-Native/Linear Gradient Prac/Figma-Design/components/EditProfileScreen.js
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { updateUserProfile } from "../redux/authSlice";
import { useState } from "react";

const EditProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);

  const [name, setName] = useState(userData?.name || "");
  const [profileImage, setProfileImage] = useState(userData?.profileImage || null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShow
```


## License: MIT
https://github.com/FennecFromSahara/Group-7-IDATA2301-IDATA2306/blob/c7ecee028f12c6c9b1ba8518122beaaceef3d841/coffeeshop-frontend/src/pages/Profile/UserProfilePage.jsx

```
I'll create an Edit Profile screen with name editing, picture upload/replace/remove, and password change functionality.

````javascript
// filepath: /home/sbh/Documents/Intern-Shakera/React-Native/Linear Gradient Prac/Figma-Design/components/EditProfileScreen.js
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { updateUserProfile } from "../redux/authSlice";
import { useState } from "react";

const EditProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);

  const [name, setName] = useState(userData?.name || "");
  const [profileImage, setProfileImage] = useState(userData?.profileImage || null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShow
```


## License: MIT
https://github.com/FennecFromSahara/Group-7-IDATA2301-IDATA2306/blob/c7ecee028f12c6c9b1ba8518122beaaceef3d841/coffeeshop-frontend/src/pages/Profile/UserProfilePage.jsx

```
I'll create an Edit Profile screen with name editing, picture upload/replace/remove, and password change functionality.

````javascript
// filepath: /home/sbh/Documents/Intern-Shakera/React-Native/Linear Gradient Prac/Figma-Design/components/EditProfileScreen.js
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { updateUserProfile } from "../redux/authSlice";
import { useState } from "react";

const EditProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);

  const [name, setName] = useState(userData?.name || "");
  const [profileImage, setProfileImage] = useState(userData?.profileImage || null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShow
```


## License: MIT
https://github.com/FennecFromSahara/Group-7-IDATA2301-IDATA2306/blob/c7ecee028f12c6c9b1ba8518122beaaceef3d841/coffeeshop-frontend/src/pages/Profile/UserProfilePage.jsx

```
I'll create an Edit Profile screen with name editing, picture upload/replace/remove, and password change functionality.

````javascript
// filepath: /home/sbh/Documents/Intern-Shakera/React-Native/Linear Gradient Prac/Figma-Design/components/EditProfileScreen.js
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { updateUserProfile } from "../redux/authSlice";
import { useState } from "react";

const EditProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);

  const [name, setName] = useState(userData?.name || "");
  const [profileImage, setProfileImage] = useState(userData?.profileImage || null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShow
```


## License: MIT
https://github.com/FennecFromSahara/Group-7-IDATA2301-IDATA2306/blob/c7ecee028f12c6c9b1ba8518122beaaceef3d841/coffeeshop-frontend/src/pages/Profile/UserProfilePage.jsx

```
I'll create an Edit Profile screen with name editing, picture upload/replace/remove, and password change functionality.

````javascript
// filepath: /home/sbh/Documents/Intern-Shakera/React-Native/Linear Gradient Prac/Figma-Design/components/EditProfileScreen.js
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { updateUserProfile } from "../redux/authSlice";
import { useState } from "react";

const EditProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);

  const [name, setName] = useState(userData?.name || "");
  const [profileImage, setProfileImage] = useState(userData?.profileImage || null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading
```


## License: MIT
https://github.com/FennecFromSahara/Group-7-IDATA2301-IDATA2306/blob/c7ecee028f12c6c9b1ba8518122beaaceef3d841/coffeeshop-frontend/src/pages/Profile/UserProfilePage.jsx

```
I'll create an Edit Profile screen with name editing, picture upload/replace/remove, and password change functionality.

````javascript
// filepath: /home/sbh/Documents/Intern-Shakera/React-Native/Linear Gradient Prac/Figma-Design/components/EditProfileScreen.js
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { updateUserProfile } from "../redux/authSlice";
import { useState } from "react";

const EditProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);

  const [name, setName] = useState(userData?.name || "");
  const [profileImage, setProfileImage] = useState(userData?.profileImage || null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(
```


## License: MIT
https://github.com/FennecFromSahara/Group-7-IDATA2301-IDATA2306/blob/c7ecee028f12c6c9b1ba8518122beaaceef3d841/coffeeshop-frontend/src/pages/Profile/UserProfilePage.jsx

```
I'll create an Edit Profile screen with name editing, picture upload/replace/remove, and password change functionality.

````javascript
// filepath: /home/sbh/Documents/Intern-Shakera/React-Native/Linear Gradient Prac/Figma-Design/components/EditProfileScreen.js
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { updateUserProfile } from "../redux/authSlice";
import { useState } from "react";

const EditProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);

  const [name, setName] = useState(userData?.name || "");
  const [profileImage, setProfileImage] = useState(userData?.profileImage || null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(
```


## License: MIT
https://github.com/FennecFromSahara/Group-7-IDATA2301-IDATA2306/blob/c7ecee028f12c6c9b1ba8518122beaaceef3d841/coffeeshop-frontend/src/pages/Profile/UserProfilePage.jsx

```
I'll create an Edit Profile screen with name editing, picture upload/replace/remove, and password change functionality.

````javascript
// filepath: /home/sbh/Documents/Intern-Shakera/React-Native/Linear Gradient Prac/Figma-Design/components/EditProfileScreen.js
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { updateUserProfile } from "../redux/authSlice";
import { useState } from "react";

const EditProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);

  const [name, setName] = useState(userData?.name || "");
  const [profileImage, setProfileImage] = useState(userData?.profileImage || null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(
```

