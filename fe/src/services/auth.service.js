import axios from "axios";

const API_URL = "http://localhost:8080/auth/";

class AuthService {
  async login(email, password) {
    return axios.post(API_URL + "login", {
      email,
      password,
    });
  }
  async forgotPassword(email, host) {
    return axios.post(API_URL + "forgot-password", {
      email,
      host,
    });
  }
  async resetPassword(passwordResetToken, passwordResetExpires, password) {
    return axios.post(API_URL + "reset-password", {
      passwordResetToken,
      passwordResetExpires,
      password,
    });
  }

  logout() {
    localStorage.removeItem("resetToken");
    localStorage.removeItem("token");
    localStorage.removeItem("passwordResetExpires");
    localStorage.removeItem("user");
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
}

export default new AuthService();
