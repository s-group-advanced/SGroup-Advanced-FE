import { BrowserRouter } from "react-router-dom"
import { AppRoutes } from "./router/index";
import { BoardProvider } from "../features/providers";
import { UserProvider } from "@/features/providers/UserProvider";

function App() {
    return (
      <BrowserRouter basename="/react-app/">
          <UserProvider>
        <BoardProvider>
          <AppRoutes />
        </BoardProvider>
          </UserProvider>
      </BrowserRouter>
  )
}

export default App;