import { BrowserRouter } from "react-router-dom"
import { AppRoutes } from "./router/index";
import { BoardProvider } from "../features/providers";
import { UserProvider } from "@/features/providers/UserProvider";
import { WorkspaceProvider } from "@/features/providers/WorkspaceProvider";
function App() {
    return (
      <BrowserRouter basename="/react-app/">
          <UserProvider>
          <WorkspaceProvider>
        <BoardProvider>
            <AppRoutes />
        </BoardProvider>
          </WorkspaceProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;