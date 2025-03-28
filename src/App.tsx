import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import EditUser from "./pages/edit-user/EditUser";
import Login from "./pages/login/Login";
import UserList from "./pages/users-list/UserList";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      Component: ProtectedRoute,
      children: [
        {
          path: "",
          Component: Layout,
          children: [
            {
              path: "user/:page",
              Component: UserList,
            },
            {
              path: "edit-user/:id",
              Component: EditUser,
            },
          ],
        },
      ],
    },
    {
      path: "/login",
      Component: Login,
    },
    {
      path: "*",
      element: <Navigate to="/user/1" replace />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
