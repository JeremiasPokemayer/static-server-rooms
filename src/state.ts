import { rtdb } from "./rtdb";
import map from "lodash/map";

const API_BASE_URL = "http://localhost:3000";

type Message = {
  from: string;
  message: string;
};

const state = {
  data: {
    email: "",
    fullName: "",
    userId: "",
    roomId: "",
    rtdbRoomId: "",
    messages: [],
  },
  listeners: [],
  init() {
    const lastStorageState = localStorage.getItem("state");
  },
  listenRoom(rtdbRoomId) {
    const cs = this.getState();
    const chatRoomsRef = rtdb.ref("/rooms/" + cs.rtdbRoomId);
    chatRoomsRef.on("value", (snapshot) => {
      const cs = this.getState();
      const messagesFromServer = snapshot.val();
      console.log(messagesFromServer);
      const messagesList = map(messagesFromServer.messages);
      cs.messages = messagesList;
      this.setState(cs);
    });
  },
  getState() {
    return this.data;
  },
  pushMessage(message: string) {
    const nombreDelState = this.data.fullName;
    const rtdbId = this.data.rtdbRoomId;
    fetch(API_BASE_URL + "/rooms/" + rtdbId + "/message", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        fullName: nombreDelState,
        message: message,
      }),
    });
  },
  setEmailAndFullname(email: string, fullName: string) {
    const cs = this.getState();
    cs.fullName = fullName;
    cs.email = email;
    this.setState(cs);
  },
  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }
    localStorage.setItem("state", JSON.stringify(newState));
    console.log("El state ha cambiado", this.data);
  },
  singIn(callback) {
    const cs = this.getState();
    if (cs.email) {
      fetch(API_BASE_URL + "/auth", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ email: cs.email }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          cs.userId = data.id;
          this.setState(cs);
          callback();
        });
    } else {
      console.error("No hay un email en el state");
    }
  },
  askNewRoom(callback?) {
    const cs = this.getState();
    if (cs.userId) {
      fetch(API_BASE_URL + "/rooms", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ userId: cs.userId }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          cs.roomId = data.id;
          this.setState(cs);
          if (callback) {
            callback();
          }
        });
    } else {
      console.error("No hay userId");
    }
  },

  accessToRoom(callback?) {
    const cs = this.getState();
    const roomId = cs.roomId;
    fetch(API_BASE_URL + "/rooms/" + roomId + "?userId=" + cs.userId)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        cs.rtdbRoomId = data.rtdbRoomId;
        this.setState(cs);
        this.listenRoom();
        if (callback) callback();
      });
  },
  suscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },
};

export { state };
