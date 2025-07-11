import { createBrowserRouter, RouterProvider } from "react-router";
import Dashboard from "./pages/Dashboard";
import Invoices from "./pages/Invoices";
import Customers from "./pages/Customers";
import Items from "./pages/Items";
import AppLayout from "./components/Layout/AppLayout";
import SubscriptionPlans from "./pages/SubscriptionPlans.tsx";
import Subscriptions from "./pages/Subscriptions";
import Expenses from "./pages/Expenses";
import Home from "./pages/Home";
import MyProfile from "./pages/MyProfile";
import Users from "./pages/Users";
import UserRoles from "./pages/UserRoles";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import AdminRoute from "./components/AdminRoute.tsx";

const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  {
    path: "/register",
    element: (
      <AdminRoute>
        <Register />
      </AdminRoute>
    ),
  },
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "/user", element: <Users /> },
          { path: "/customer", element: <Customers /> },
          { path: "/item", element: <Items /> },
          { path: "/subscription-plan", element: <SubscriptionPlans /> },
          { path: "/invoice", element: <Invoices /> },
          { path: "/subscription", element: <Subscriptions /> },
          { path: "/expense", element: <Expenses /> },
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/my-profile", element: <MyProfile /> },
          { path: "/user-role", element: <UserRoles /> },
        ],
      },
    ],
  },
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
