import { useDispatch, useSelector } from "react-redux";
import {
  login,
  signup,
  logout,
  getCurrentUser,
  refreshSession,
} from "../redux/thunks/index.js";



export const useAuth = () => {
  const dispatch = useDispatch();
  const { loading, error, userData } = useSelector(
    (state) => state.auth
  );

  const loginUser = async (credentials) => {
    return await dispatch(login(credentials)).unwrap(); 
    // The unwrap() method is used to extract the fulfilled value from the dispatched thunk action. It allows us to handle the result of the asynchronous operation directly in the component, enabling us to manage success and error states more effectively. By using unwrap(), we can easily access the response data or catch any errors that occur during the login process, providing a smoother user experience and better error handling in our authentication flow.
  };

  const signupUser = async (data) => {
    return await dispatch(signup(data)).unwrap();
  };

  const logoutUser = async () => {
    return await dispatch(logout()).unwrap();
  };

  const fetchCurrentUser = async () => {
    return await dispatch(getCurrentUser()).unwrap();
  };

  const refreshUserSession = async () => {
    return await dispatch(refreshSession()).unwrap();
  };

  return {
    loginUser,
    signupUser,
    logoutUser,
    fetchCurrentUser,
    refreshUserSession,
    loading,
    error,
    userData,
  };
};