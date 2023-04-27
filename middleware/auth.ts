export default defineNuxtRouteMiddleware((from) => {
  const user = useSupabaseUser();

  const accessTokenInUrl = from.fullPath?.includes("access_token") ?? false;

  if (!user.value || !accessTokenInUrl) {
    console.log(user.value, from.fullPath);
    return navigateTo("/login");
  }
});
