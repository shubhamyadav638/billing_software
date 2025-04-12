import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import store from "./components/redux/store/store.js";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <Toaster position="top-center" reverseOrder={true} />
    <App />
  </Provider>
);
