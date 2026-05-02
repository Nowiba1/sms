const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

// Initialize Firebase Admin using environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();

app.use(cors());
app.use(express.json());

// Save an appointment
app.post('/book', async (req, res) => {
  try {
    const { name, email, datetime, fcmToken } = req.body;

    await db.collection('appointments').add({
      name,
      email,
      datetime,          // ISO string e.g. "2025-06-15T14:30:00"
      fcmToken,          // push token from the user's browser
      reminderSent: false,
      createdAt: new Date().toISOString()
    });

    res.json({ success: true, message: 'Appointment saved!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Something went wrong' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
