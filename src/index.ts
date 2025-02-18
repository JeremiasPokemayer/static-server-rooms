import firebase from "firebase";
import "./pages/index.ts";
import "./pages/chat.ts";
import "./router.ts";
import { state } from "./state.ts";
import { init as initHeader } from "./components/header.ts";
import { Router } from "@vaadin/router";

(function () {
  // state.init();
  // const cs = state.getState();
  // if (cs.rtdbRoomId && cs.userId) {
  //   Router.push("/chat");
  // }
  initHeader();
})();
