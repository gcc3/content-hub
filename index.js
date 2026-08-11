import React from "react";
import ReactDOM from "react-dom/client";
import App from "./src/App"
import { getPage } from "./src/pages";

// A landing page path such as /liveboard renders that page, everything else the content app.
const Page = getPage(window.location.pathname);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {Page ? <Page /> : <App />}
  </React.StrictMode>
);
