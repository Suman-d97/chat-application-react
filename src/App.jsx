import { RouterProvider } from "react-router-dom";
// import "./App.css";
import { AppProvider } from "./context/AppContext";
import { ThemeProvider } from "./context/Theme";
import Routes from "../src/routes/Routes"

function App() {
  return (
    <>
      <ThemeProvider>
        <AppProvider>
          <RouterProvider router={Routes}/>
        </AppProvider>
      </ThemeProvider>
    </>
  );
}

export default App;

