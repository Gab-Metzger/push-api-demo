<script setup lang="ts">
const { login } = useAuth();

useHead({
  title: "Sign In - Push API Demo",
});
</script>

<template>
  <ion-page>
    <ion-content color="primary">
      <ion-grid>
        <ion-row>
          <ion-col>
            <img
              class="logo"
              src="~/assets/images/logo.png"
              alt="strasbourg.js"
            />
            <div class="title">
              <h2>Welcome</h2>
              <p>Web Push API demo</p>
            </div>
            <div class="button-container">
              <ion-button
                expand="block"
                fill="outline"
                color="secondary"
                @click="login"
              >
                <ion-icon slot="start" :icon="ioniconsLogoGithub"></ion-icon>
                Join with Github
              </ion-button>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<style scoped>
.logo {
  padding: 0 10% 0 10%;
  margin: 20% 0 20% 0;
}

.title {
  text-align: center;
}

.button-container {
  margin-top: 20%;
}
</style>
