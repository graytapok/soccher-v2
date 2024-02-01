import { useEffect, useState } from "react";

export default function useRequest(url, method = "GET", body) {
  const [data, setData] = useState();
  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((res) => (res.success ? setData(res.data) : setData(res.message)))
      .catch((e) => console.log(e));
  });
  return data;
}
