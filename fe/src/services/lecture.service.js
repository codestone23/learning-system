import axios from "axios";
export async function getYourSchedule(start, end) {
  const accessToken = JSON.parse(localStorage.getItem("accessToken"));
  const headers = {
    x_authorization: `${accessToken}`,
  };
  return await axios.post(
    "http://localhost:8080/admin/schedule",
    {
      start,
      end,
    },
    { headers }
  );
}
