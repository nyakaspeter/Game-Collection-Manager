import { AppShell, Button, Header, MantineProvider } from "@mantine/core";
import { useState } from "react";
import AppNavbar from "./components/AppNavbar";

function App() {
  const [count, setCount] = useState(0);

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <AppShell navbar={<AppNavbar />}>
        <h1>Vite + React</h1>
        <div>
          <Button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </Button>
        </div>
      </AppShell>
    </MantineProvider>
  );
}

export default App;
