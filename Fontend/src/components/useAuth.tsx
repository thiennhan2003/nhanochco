// // File: src/components/useAuth.tsx
// import { useEffect, useState } from "react";
// import axios from "axios";

// export const useAuth = () => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     axios
//       .get("http://localhost:8080/api/v1/users/67d16d07fa72b74e7f894d72")
//       .then((res) => setUser(res.data))
//       .catch(() => setUser(null));
//   }, []);

//   return { user };
// };
