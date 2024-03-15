import { ContextProvider } from "./context/ContextProvider";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ChatProvider } from "./context/ChatProvider";
function App() {
  return (
    <>
      <ContextProvider>
        <ChatProvider>
          <ToastContainer />
          <AppRoutes />
        </ChatProvider>
      </ContextProvider>
    </>
  );
}

export default App;
