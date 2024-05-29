const THEME_KEY_NAME = "grocery-theme-toggle";

export function useThemeToggle() {
  const themeCookie = useCookie(THEME_KEY_NAME);
  const { $pwa } = useNuxtApp();

  onMounted(() => {
    // ios pwas don't load the theme correctly on load
    // but a double toggle fixes it?
    // i dont really feel like figuring out why to find a better fix
    if (process.client && $pwa?.isPWAInstalled) {
      setTimeout(toggleTheme, 500);
      setTimeout(toggleTheme, 500);
    }
  });

  const theme = computed({
    get() {
      return themeCookie.value ?? "light";
    },
    set(val) {
      themeCookie.value = val;
    },
  });

  function toggleTheme() {
    if (theme.value !== "light") {
      theme.value = "light";
    } else {
      theme.value = "dark";
    }
  }

  return {
    theme,
    toggleTheme,
  };
}
