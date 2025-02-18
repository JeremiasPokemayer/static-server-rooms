import { firestore, rtdb } from "./db";
import * as express from "express";
import { nanoid } from "nanoid";
import * as cors from "cors";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

const usersCollection = firestore.collection("users");
const roomCollection = firestore.collection("rooms");

app.post("/signup", (req, res) => {
  const email = req.body.email;
  const nombre = req.body.nombre;
  usersCollection
    .where("email", "==", email)
    .get()
    .then((searchResponse) => {
      if (searchResponse.empty) {
        usersCollection
          .add({
            email,
            nombre,
          })
          .then((newUserRef) => {
            res.json({
              id: newUserRef.id,
              new: true,
            });
          });
      } else {
        res.status(400).json({
          message: "user already exists",
        });
      }
    });
});

app.post("/auth", (req, res) => {
  const { email } = req.body;
  usersCollection
    .where("email", "==", email)
    .get()
    .then((searchResponse) => {
      if (searchResponse.empty) {
        res.status(404).json({
          message: "not found",
        });
      } else {
        res.json({
          id: searchResponse.docs[0].id,
        });
      }
    });
});

app.post("/rooms", (req, res) => {
  const { userId } = req.body;
  usersCollection
    .doc(userId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        const roomRef = rtdb.ref("/rooms/" + nanoid());
        roomRef
          .set({
            message: [""],
            owner: userId,
          })
          .then((rtdbRes: any) => {
            const roomLongId = roomRef.key;
            const roomId = 1000 + Math.floor(Math.random() * 999);
            roomCollection
              .doc(roomId.toString())
              .set({
                rtdbRoomId: roomLongId,
              })
              .then(() => {
                res.json({
                  id: roomId.toString(),
                });
              });
          });
      } else {
        res.status(401).json({
          message: "no existe",
        });
      }
    });
});

app.get("/rooms/:roomId", (req, res) => {
  const { userId } = req.query;
  const { roomId } = req.params;
  usersCollection
    .doc(userId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        roomCollection
          .doc(roomId)
          .get()
          .then((snap) => {
            const data = snap.data();
            res.json(data);
          });
      } else {
        res.status(401).json({
          message: "no existe",
        });
      }
    });
});

app.post("/rooms/:roomId/message", (req, res) => {
  const { roomId } = req.params;
  const { fullName, message } = req.body;

  if (!fullName || !message) {
    return res
      .status(400)
      .json({ message: "fullName and message are required" });
  }

  // Referencia a la sala en RTDB
  const roomRef = rtdb.ref("/rooms/" + roomId);

  // Agrega el mensaje a la sala
  roomRef
    .child("messages")
    .push({
      from: fullName,
      message: message,
    })
    .then(() => {
      res.status(201).json({ message: "Message sent successfully" });
    })
    .catch((error) => {
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Error sending message" });
    });
});

app.listen(port, () => {
  console.log(`iniciado en http://localhost:${port}`);
});
