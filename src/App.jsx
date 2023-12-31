import {
  About,
  Cart,
  Checkout,
  Error,
  HomeLayout,
  Landing,
  Login,
  Orders,
  Products,
  Register,
  SingleProduct,
} from "./pages";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ErrorElement } from "./components";
import { store } from "./store";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";

// loaders
import { loader as landingLoader } from "./pages/Landing";
import { loader as singleProductLoader } from "./pages/SingleProduct";
import { loader as productsLoader } from "./pages/Products";
import { loader as checkoutLoader } from "./pages/Checkout";
import { loader as ordersLoader } from "./pages/Orders";

// actions
import { action as loginAction } from "./pages/Login";
import { action as registerAction } from "./pages/Register";
import { action as checkoutAction } from "./components/ShippingInfo";

// import { action as productsAction } from "./pages/Products";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Landing />,
        errorElement: <ErrorElement />,
        loader: landingLoader(queryClient),
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "products",
        element: <Products />,
        loader: productsLoader(queryClient),
        // action: productsAction,
        errorElement: <ErrorElement />
      },
      {
        path: "products/:id",
        element: <SingleProduct />,
        errorElement: <ErrorElement />,
        loader: singleProductLoader(queryClient),
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "orders",
        element: <Orders />,
        errorElement: <ErrorElement/>,
        loader: ordersLoader(store, queryClient)
      },
      {
        path: "checkout",
        element: <Checkout />,
        errorElement: <ErrorElement/>,
        loader: checkoutLoader(store),
        action: checkoutAction(store, queryClient)
      },
    ],
  },
  {
    path: "/login",
    action: loginAction(store),
    element: <Login />,
    errorElement: <Error />,
  },
  {
    path: "/register",
    action: registerAction,
    element: <Register />,
    errorElement: <Error />,
  },
]);

const App = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools />
        <ToastContainer position="top-center"/>
      </QueryClientProvider>
    </Provider>
  );
};
export default App;
