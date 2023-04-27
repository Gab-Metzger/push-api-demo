self.addEventListener("push", function(event) {
  const body = event.data?.text() ?? "Default text";

  event.waitUntil(
    self.registration.showNotification("Web Push API Demo", {
      body,
    })
  );
});
