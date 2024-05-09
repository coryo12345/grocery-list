export async function useAuthGuard() {
  const router = useRouter();
  const { data } = await useFetch("/api/auth");
  if (!data.value) {
    router.replace("/auth");
  }
}
