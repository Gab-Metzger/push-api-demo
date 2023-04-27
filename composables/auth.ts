export const useAuth = () => {
  const supabase = useSupabaseAuthClient();
  const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
      return;
    }

    await navigateTo("/login");
  };

  const login = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
    });

    if (error) {
      console.error(error);
    }
  };

  return { login, logout };
};
