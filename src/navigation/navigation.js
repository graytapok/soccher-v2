import IndexPage from "../pages/IndexPage";
import LoginPage from "../pages/LoginPage";

export const nav = [
  {
    path: "/",
    name: "Home",
    element: <IndexPage />,
    isMenu: true,
    isPrivate: false,
  },
  {
    path: "/login",
    name: "Login",
    element: <LoginPage />,
    isMenu: false,
    isPrivate: false,
  },
  {
    path: "/my_profile",
    name: "My Profile",
    element: <IndexPage />,
    isMenu: true,
    isPrivate: true,
  },
];
