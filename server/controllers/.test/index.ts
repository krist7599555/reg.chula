import axios from "axios";
export function run() {
  return axios
    .get("http://127.0.0.1:3124/api/scape/course?q=1")
    .then(res => console.log(res.data))
    .catch(err => console.log(err.response.data));
}
