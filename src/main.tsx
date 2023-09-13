import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/app";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Theme>
      <App />
    </Theme>
  </React.StrictMode>
);
