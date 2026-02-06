import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import "@mantine/core/styles.css";
import { Navbar } from "./components/Navbar";
import { MantineProvider } from "@mantine/core";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { BoardPage } from "./components/BoardPage";
import { BoardView } from "./components/BoardView";

export const App = () => {
  const [count, setCount] = useState(0);

  return (
    <MantineProvider>
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BoardPage />} />
          <Route path="/board" element={<BoardView />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
};
