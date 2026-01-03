import { BrowserRouter } from "react-router-dom"
import { AppRoutes } from "./router/index";
import { BoardProvider } from "./providers";
import { UserProvider } from "@/app/providers/UserProvider";

function App() {
    return (
      <BrowserRouter basename="/react-app/">
        <BoardProvider>
          <UserProvider>
          <AppRoutes />
          </UserProvider>
        </BoardProvider>
      </BrowserRouter>
  )
}

export default App;