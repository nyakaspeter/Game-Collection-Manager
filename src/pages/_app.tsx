import { AppShell, MantineProvider } from "@mantine/core";
import { QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import AppNavbar from "../components/AppNavbar";
import { queryClient } from "../utils/query";

const App = ({ children }: PropsWithChildren) => {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <QueryClientProvider client={queryClient}>
        <AppShell
          navbar={
            <nav>
              <AppNavbar />
            </nav>
          }
        >
          <main>{children}</main>
        </AppShell>
      </QueryClientProvider>
    </MantineProvider>
  );
};

export default App;
