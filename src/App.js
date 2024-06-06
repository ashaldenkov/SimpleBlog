import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

//components
import BlogMain from './Components/BlogList'
import NotFound from './Components/NotFound'
import ArticleDetails, { ArticleDetailsLoader } from './Components/ArticleDetails/ArticleDetails'
import ErrorPage from "./Components/Error";

//layouts
import HeaderLayout from './Layouts/Header'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<HeaderLayout/>}>
      <Route path="articles" element={<BlogMain/>} errorElement={<ErrorPage/>}/>
      <Route path="articles/:slug"
        element={<ArticleDetails/>}
        loader={ArticleDetailsLoader}
        errorElement={<ErrorPage/>}
        /> 
      <Route path="*" element={<NotFound/>}/>
    </Route>

  )
);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
