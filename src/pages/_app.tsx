import {
  AppShell,
  Box,
  Center,
  Loader,
  MantineProvider,
  ScrollArea,
} from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { PropsWithChildren, Suspense } from "react";
import AppNavbar from "../components/AppNavbar";
import { useAuthHeaders } from "../hooks/useAuthHeaders";
import { showToast } from "../utils/toast";

import "virtual:fonts.css";

const App = ({ children }: PropsWithChildren) => {
  useAuthHeaders();

  return (
    <MantineProvider
      theme={{
        fontFamily: "Kanit, sans-serif",
        colorScheme: "dark",
        primaryColor: "gray",
        primaryShade: 9,
      }}
      withGlobalStyles
      withNormalizeCSS
    >
      <NotificationsProvider>
        <AppShell
          navbar={<AppNavbar />}
          sx={{
            main: {
              padding: 0,
              paddingLeft: "var(--mantine-navbar-width)",
              height: "100vh",
            },
          }}
        >
          <Suspense
            fallback={
              <Center sx={{ width: "100%", height: "100%" }}>
                <Loader />
              </Center>
            }
          >
            <ScrollArea sx={{ width: "100%", height: "100%" }}>
              <Box sx={{ padding: 16 }}>{children}</Box>
            </ScrollArea>
          </Suspense>
        </AppShell>
      </NotificationsProvider>
    </MantineProvider>
  );
};

export default App;
