import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../features/theme/themeSlice";

const query = () => window.matchMedia("(prefers-color-scheme: dark)");

// Applies the "dark" class to <html>. Call once at the top of the app.
export function useThemeEffect() {
  const mode = useSelector((s) => s.theme.mode);
  useEffect(() => {
    const mq = query();
    const apply = () => {
      const dark = mode ? mode === "dark" : mq.matches;
      document.documentElement.classList.toggle("dark", dark);
    };
    apply();
    if (!mode) {
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    }
  }, [mode]);
}

// For the toggle button
export function useTheme() {
  const dispatch = useDispatch();
  const mode = useSelector((s) => s.theme.mode);
  const [systemDark, setSystemDark] = useState(() => query().matches);

  useEffect(() => {
    const mq = query();
    const onChange = (e) => setSystemDark(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const isDark = mode ? mode === "dark" : systemDark;
  const toggle = () => dispatch(setTheme(isDark ? "light" : "dark"));
  return { isDark, toggle };
}
