import { BrowserRouter } from "react-router-dom"
import { AppRoutes } from "./router/index";
import { BoardProvider } from "./providers";

function App() {
    return (
      <BrowserRouter basename="/react-app/">
        <BoardProvider>
          <AppRoutes />
        </BoardProvider>
      </BrowserRouter>
  )
}

export default App;