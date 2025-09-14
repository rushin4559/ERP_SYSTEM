import axios from "./axios";

export const updateUsernameApi = async (username) => {
  const res = await axios.put("/user/profile", { username });
  return res.data;
};

export const changePasswordApi = async (currentPassword, newPassword) => {
  const res = await axios.put("/user/change-password", { currentPassword, newPassword });
  return res.data;
};
