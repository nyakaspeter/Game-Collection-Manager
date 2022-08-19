import {
  AppShell,
  Box,
  Center,
  Loader,
  MantineProvider,
  ScrollArea,
} from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, Suspense } from "react";
import AppNavbar from "../components/AppNavbar";
import { queryClient } from "../utils/query";

const App = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider
        theme={{
          primaryColor: "dark",
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
    </QueryClientProvider>
  );
};

export default App;
