class PushNotification {
  public denied: boolean = false;
  public subscription: PushSubscription;
  constructor() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/service-worker.js");
    }
  }

  public init() {
    navigator.serviceWorker.ready
      .then((registration) => {
        return registration.pushManager
          .getSubscription()
          .then(async (subscription) => {
            if (subscription) {
              return subscription;
            }

            const response = await fetch(
              "http://localhost:8000/vapidPublicKey"
            );
            const vapidPublicKey = await response.text();
            const convertedVapidKey =
              this.urlBase64ToUint8Array(vapidPublicKey);

            return registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: convertedVapidKey,
            });
          });
      })
      .then((subscription) => {
        this.subscription = subscription;
        fetch("http://localhost:8000/register", {
          method: "post",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            subscription: subscription,
          }),
        });
      })
      .catch((e) => {
        console.error(e);
      });
  }

  public send(payload: { body: string; ttl?: number; delay?: number }) {
    fetch("http://localhost:8000/send", {
      method: "post",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        subscription: this.subscription,
        body: payload.body,
        ttl: payload.ttl ?? 0,
        delay: payload.delay ?? 2,
      }),
    });
  }

  public getSubscription() {
    return this.subscription;
  }

  public getPermissionStatus() {
    if (!("Notification" in window)) {
      return "denied";
    } else {
      return Notification.permission;
    }
  }

  public setPermission() {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        this.denied = false;
      } else if (permission === "denied") {
        this.denied = true;
      }
    });
  }

  private urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}

export default new PushNotification();
