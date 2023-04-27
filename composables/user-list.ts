import { User } from "../interfaces/user";

export const useUserList = async () => {
  const client = useSupabaseClient();
  const search = ref<string>();
  const { data: users } = await useAsyncData("users", async () => {
    const { data } = await client.from("profiles").select();
    return data;
  });

  const filteredUsers = computed<User[]>(() => {
    return (users?.value ?? []).filter((user: User) =>
      user.fullname
        .toLowerCase()
        .includes(search?.value?.trim().toLowerCase() ?? "")
    );
  });

  return { search, filteredUsers };
};
