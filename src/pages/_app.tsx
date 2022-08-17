import { AppShell, MantineProvider } from "@mantine/core";
import { ReactNode } from "react";
import AppNavbar from "../components/AppNavbar";

const App = ({ children }: { children: ReactNode }) => {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <AppShell
        navbar={
          <nav>
            <AppNavbar />
          </nav>
        }
      >
        <main>{children}</main>
      </AppShell>
    </MantineProvider>
  );
};

export default App;
