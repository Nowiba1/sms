// This file must be at the root of your site
self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};

  const title = data.title || 'Reminder';
  const options = {
    body: data.body || 'You have an upcoming appointment',
    icon: '/icon.png',
    badge: '/icon.png'
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
