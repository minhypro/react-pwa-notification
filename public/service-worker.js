self.addEventListener('push', function(event) {
    const data = event.data.json();
    const apiKey = data.apiKey
    const sessionId = data.sessionId
    const token = data.token

    const options = {
        body: data.message,
        icon: 'icons/icon-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            url: `https://vonage-video-client.vercel.app/?apiKey=${apiKey}&sessionId=${sessionId}&token=${token}`, // Pass custom URL or params here
        },
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close(); // Close the notification

    const urlToOpen = event.notification.data.url; // Retrieve the URL from the notification data

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
            for (let i = 0; i < clientList.length; i++) {
                let client = clientList[i];
                // Check if the window is already open with the desired URL
                if (client.url === urlToOpen && 'focus' in client) {
                    return client.focus();
                }
            }
            // If the window isn't already open, open a new one
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});
