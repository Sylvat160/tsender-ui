import { darkTheme, lightTheme, type Theme } from "@rainbow-me/rainbowkit";

export function getRainbowTheme(mode: "light" | "dark"): Theme {
  const base =
    mode === "dark"
      ? darkTheme({
          borderRadius: "medium",
          fontStack: "system",
          overlayBlur: "small", // ← blurred backdrop on modal
        })
      : lightTheme({
          borderRadius: "medium",
          fontStack: "system",
          overlayBlur: "small",
        });

  if (mode === "dark") {
    return {
      ...base,
      colors: {
        ...base.colors,
        accentColor: "#c49a12",
        accentColorForeground: "#fff",
        modalBackground: "#1a1a2e", // matches --card dark
        modalBorder: "rgba(255,255,255,0.1)", // matches --border dark
        modalText: "#fafafa", // matches --foreground dark
        modalTextDim: "#a1a1aa", // matches --muted-foreground dark
        modalTextSecondary: "#a1a1aa",
        modalBackdrop: "rgba(0,0,0,0.6)",
        connectButtonBackground: "#1a1a2e",
        connectButtonText: "#fafafa",
        connectButtonInnerBackground: "#262640",
        closeButton: "#a1a1aa",
        closeButtonBackground: "#262640",
        actionButtonBorder: "rgba(255,255,255,0.1)",
        actionButtonSecondaryBackground: "#262640",
        generalBorder: "rgba(255,255,255,0.1)",
        generalBorderDim: "rgba(255,255,255,0.05)",
        menuItemBackground: "#262640",
        profileAction: "#262640",
        profileActionHover: "#2a2a4a",
        profileForeground: "#1a1a2e",
        selectedOptionBorder: "#c49a12",
        error: "#ef4444",
      },
      shadows: {
        ...base.shadows,
        connectButton: "none",
        dialog: "0 8px 32px rgba(0,0,0,0.32)",
      },
    };
  }

  return {
    ...base,
    colors: {
      ...base.colors,
      accentColor: "#d4a017",
      accentColorForeground: "#fff",
      modalBackground: "#ffffff",
      modalBorder: "#e4e4e7",
      modalText: "#09090b",
      modalTextDim: "#71717a",
      modalTextSecondary: "#71717a",
      modalBackdrop: "rgba(0,0,0,0.4)",
      connectButtonBackground: "#ffffff",
      connectButtonText: "#09090b",
      connectButtonInnerBackground: "#f4f4f5",
      closeButton: "#71717a",
      closeButtonBackground: "#f4f4f5",
      actionButtonBorder: "#e4e4e7",
      actionButtonSecondaryBackground: "#f4f4f5",
      generalBorder: "#e4e4e7",
      generalBorderDim: "#f4f4f5",
      menuItemBackground: "#f4f4f5",
      profileAction: "#f4f4f5",
      profileActionHover: "#e4e4e7",
      profileForeground: "#ffffff",
      selectedOptionBorder: "#d4a017",
      error: "#ef4444",
    },
    shadows: {
      ...base.shadows,
      connectButton: "0 1px 2px rgba(0,0,0,0.05)",
      dialog: "0 8px 32px rgba(0,0,0,0.12)",
    },
  };
}
