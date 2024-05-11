const THEME_KEY_NAME = "grocery-theme-toggle";

export function useThemeToggle() {
  const themeCookie = useCookie(THEME_KEY_NAME);

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
