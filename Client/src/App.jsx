import { ContextProvider } from "./context/ContextProvider";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from 'react-toastify';
function App() {
  return (
    <>
      <ContextProvider>
        <ToastContainer/>
        <AppRoutes />
      </ContextProvider>
    </>
  );
}

export default App;
