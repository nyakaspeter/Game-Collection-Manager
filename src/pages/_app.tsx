import "virtual:fonts.css";

import {
  AppShell,
  Box,
  Center,
  Loader,
  MantineProvider,
  MantineThemeOverride,
  ScrollArea,
  Sx,
} from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren, Suspense } from "react";
import { AppNavbar } from "../components/AppNavbar";
import { fetchIgdbAuthHeaders, igdbAuthHeadersKey } from "../utils/igdb/auth";
import { toast } from "../utils/toast";

const theme: MantineThemeOverride = {
  fontFamily: "Kanit, sans-serif",
  colorScheme: "dark",
  primaryColor: "gray",
  primaryShade: 9,
};

const appShellStyles: Sx = {
  main: {
    padding: 0,
    paddingLeft: "var(--mantine-navbar-width)",
    height: "100vh",
  },
};

const scrollAreaStyles: Sx = { width: "100%", height: "100%" };

const pageStyles: Sx = { padding: 16 };

const loadingStyles: Sx = { width: "100%", height: "100%" };

const Loading = () => (
  <Center sx={loadingStyles}>
    <Loader />
  </Center>
);

const App = ({ children }: PropsWithChildren) => {
  useQuery(igdbAuthHeadersKey, fetchIgdbAuthHeaders, {
    onError: () => {
      toast.error(
        "Twitch auth failed",
        "Please check your credentials in settings"
      );
    },
    staleTime: Infinity,
    retry: false,
  });

  return (
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      <ModalsProvider>
        <NotificationsProvider>
          <AppShell navbar={<AppNavbar />} sx={appShellStyles}>
            <Suspense fallback={<Loading />}>
              <ScrollArea sx={scrollAreaStyles}>
                <Box sx={pageStyles}>{children}</Box>
              </ScrollArea>
            </Suspense>
          </AppShell>
        </NotificationsProvider>
      </ModalsProvider>
    </MantineProvider>
  );
};

export default App;
