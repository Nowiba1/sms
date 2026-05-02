const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔑 FIREBASE ADMIN (upload JSON from Firebase)
admin.initializeApp({
  credential: admin.credential.cert(require("./serviceAccountKey.json"))
});

const db = admin.firestore();

// 📅 Save appointment
app.post("/book", async (req, res) => {
  const { time, token } = req.body;

  await db.collection("appointments").add({
    time: new Date(time),
    token: token
  });

  res.send("OK");
});

// ⏱️ Check every minute
setInterval(async () => {
  const now = new Date();

  const snapshot = await db.collection("appointments").get();

  snapshot.forEach(async doc => {
    const data = doc.data();
    const diff = new Date(data.time) - now;

    // 30 minutes
    if (diff > 0 && diff <= 1800000) {
      await admin.messaging().send({
        token: data.token,
        notification: {
          title: "Rappel",
          body: "Votre rendez-vous est dans 30 minutes"
        }
      });

      await doc.ref.delete();
    }
  });
}, 60000);

// 🚀 start server
app.listen(3000, () => console.log("Server running"));
