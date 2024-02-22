import axios from "axios";

const API_URL = "http://localhost:8080/users/";

class UserService {
  async getUser() {
    const accessToken = JSON.parse(localStorage.getItem("accessToken"));
    const headers = {
      x_authorization: `${accessToken}`
    };
    return await axios.post(API_URL + "profile", {}, { headers });
  }
}

export default new UserService();
