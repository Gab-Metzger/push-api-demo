import { onMounted } from "vue";
import { alertController } from "@ionic/vue";
import pushNotificationService from "../services/notification";

export const usePermission = () => {
  onMounted(async () => {
    const status = pushNotificationService.getPermissionStatus();
    if (status === "default" && pushNotificationService.denied === false) {
      const alert = await alertController.create({
        header: "Notification request",
        message: "Do you accept receiving notifications?",
        buttons: [
          {
            text: "No",
            role: "cancel",
            handler: () => {
              pushNotificationService.denied = true;
            },
          },
          {
            text: "Yes",
            role: "confirm",
            handler: () => {
              pushNotificationService.setPermission();
            },
          },
        ],
      });

      await alert.present();
    }
  });
};
