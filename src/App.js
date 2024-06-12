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
import SignIn from './Components/Authorization/SignIn'
import SignUp from './Components/Authorization/SignUp'
import Profile from './Components/Authorization/Profile'
import NewArticle from './Components/NewArticle/NewArticle'
import ArticleEdit from './Components/ArticleEdit/ArticleEdit'

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
      <Route path="articles/:slug/edit"
        element={<ArticleEdit/>}
        loader={ArticleDetailsLoader}
        errorElement={<ErrorPage/>}
        /> 
      <Route path="sign-in" element={<SignIn/>}/>
      <Route path="sign-up" element={<SignUp/>} errorElement={<ErrorPage/>}/>
      <Route path="profile" element={<Profile/>}/>
      <Route path="new-article" element={<NewArticle/>}/>
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
