import { RouterProvider, createBrowserRouter } from "react-router-dom";
import NavbarCustom from "./components/navbar";
import { useLocalStorage } from "./libs/useLocalStorage";
import Home from "./pages/home";
import Id from "./pages/id";

export type Data = {
  event_name: string;
  id: string;
  edited_at: string;
  persons: string[];
  data: { bailer: string; value: number }[];
};

export type Sbiller = {
  dark: boolean;
  data: Data[];
};

const fallback = { dark: false, data: [] } as Sbiller;

function App() {
  const [data, setData] = useLocalStorage<Sbiller>("sbiller_data", fallback);

  console.log(data);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home data={data.data} setData={setData} />,
      errorElement: <p className="text-default-foreground">Route Not Found!</p>,
    },
    {
      path: "/:id",
      element: <Id data={data.data} setData={setData} />,
    },
  ]);

  return (
    <main id="main" className={`font-inter ${data.dark ? "dark" : ""}`}>
      <div className="bg-white dark:bg-zinc-950 min-h-screen">
        <NavbarCustom dark={data.dark} setDark={setData} />
        <RouterProvider router={router} />
      </div>
    </main>
  );
}

export default App;
