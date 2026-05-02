const admin = require('firebase-admin');

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function checkAppointments() {
  const now = new Date();
  const in30 = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes from now
  const in31 = new Date(now.getTime() + 31 * 60 * 1000); // 31 minutes window

  const snapshot = await db.collection('appointments')
    .where('reminderSent', '==', false)
    .get();

  for (const doc of snapshot.docs) {
    const appt = doc.data();
    const apptTime = new Date(appt.datetime);

    // Check if appointment is in the 30-31 minute window
    if (apptTime >= in30 && apptTime <= in31) {
      try {
        // Send FCM push notification
        await admin.messaging().send({
          token: appt.fcmToken,
          notification: {
            title: 'Appointment Reminder',
            body: `Hi ${appt.name}, your appointment is in 30 minutes!`
          }
        });

        // Mark reminder as sent so we don't send it again
        await doc.ref.update({ reminderSent: true });
        console.log(`Reminder sent for: ${appt.name}`);
      } catch (err) {
        console.error(`Failed to send reminder for ${appt.name}:`, err.message);
      }
    }
  }
}

checkAppointments()
  .then(() => {
    console.log('Scheduler check complete');
    process.exit(0);
  })
  .catch(err => {
    console.error('Scheduler error:', err);
    process.exit(1);
  });
