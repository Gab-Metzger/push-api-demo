<script setup lang="ts">
import { logOutOutline, sendOutline } from "ionicons/icons";
import historyService from "../services/history";
import pushNotificationService from "../services/notification";

useHead({
  title: "Push API Demo",
});

historyService.init();
pushNotificationService.init();

usePermission();
const { search, filteredUsers } = await useUserList();
const { logout } = useAuth();
const user = useSupabaseUser();

const alertButtons = [
  {
    text: "Cancel",
    role: "cancel",
    handler: () => {
      // nothing to do...
    },
  },
  {
    text: "OK",
    role: "confirm",
    handler: async () => {
      if (!user.value) {
        return;
      }
      const isAuthorizedToSendNotification =
        await historyService.canSendNotificationToUser(user.value.id);
      if (isAuthorizedToSendNotification) {
        pushNotificationService.send({
          body: `Hello from ${user.value.email}`,
        });
        historyService.addUserToHistory(user.value.id);
      } else {
        console.log("flooder");
      }
    },
  },
];
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>People</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-buttons slot="primary">
            <ion-button @click="logout">
              <ion-icon slot="icon-only" :icon="logOutOutline"></ion-icon>
            </ion-button>
          </ion-buttons>
          <ion-title size="large">People</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-searchbar
        v-model="search"
        :animated="true"
        placeholder="Search user"
      ></ion-searchbar>
      <ion-list>
        <ion-item v-for="user in filteredUsers" lines="full">
          <ion-avatar slot="start">
            <img :alt="user.fullname" :src="user.avatar" />
          </ion-avatar>
          <ion-label>
            <h3>{{ user.fullname }}</h3>
            <p>@{{ user.username }}</p>
          </ion-label>
          <ion-button :id="`alert-user${user.id}`" slot="end" fill="clear">
            <ion-icon slot="icon-only" :icon="sendOutline"></ion-icon>
          </ion-button>
          <ion-alert
            :trigger="`alert-user${user.id}`"
            header="Confirmation"
            :message="`You are about to send a push
            notification to ${user.fullname}. Do you want to proceed?`"
            :buttons="alertButtons"
          ></ion-alert>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>
