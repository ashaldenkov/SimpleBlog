import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

//components
import BlogMain from './Components/BlogList'
//layouts
import HeaderLayout from './Layouts/Header'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<HeaderLayout/>}>
      <Route index path="articles" element={<BlogMain/>}>

      </Route>
    </Route>
  )
);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
