self.addEventListener('push', function(event) {
    const data = event.data.json();
    const options = {
        body: data.message,
        icon: 'icons/icon-72x72.png',
        vibrate: [100, 50, 100],
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close(); // Close the notification

    // This event waits for the browser to open a new tab/window with the specified URL
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            for (let i = 0; i < clientList.length; i++) {
                let client = clientList[i];
                // Check if the window is already open with the desired URL
                if (client.url === 'https://react-pwa-notification.vercel.app/' && 'focus' in client) {
                    return client.focus();
                }
            }
            // If the window isn't already open, open a new one
            if (clients.openWindow) {
                return clients.openWindow('https://react-pwa-notification.vercel.app/');
            }
        })
    );
});
