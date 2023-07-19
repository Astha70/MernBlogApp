import { Routes, Route , Navigate} from "react-router-dom";
import Blogs from "./pages/Blogs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserBlogs from "./pages/UserBlogs";
import CreateBlog from "./pages/CreateBlog";
import BlogDetails from "./pages/BlogDetails";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" 
        Component={() => {
          const token = localStorage.getItem("token");
          return token ? <Blogs /> : Navigate({ to: "/login" });
        }}/>
        <Route path="/blogs"Component={() => {
            const token = localStorage.getItem("token");
            return token ? <Blogs /> : Navigate({ to: "/login" });
          }} />
        <Route path="/my-blogs"
        Component={() => {
          const token = localStorage.getItem("token");
          return token ? <UserBlogs /> : Navigate({ to: "/login" });
        }} />
        <Route path="/blog-details/:id" Component={() => {
            const token = localStorage.getItem("token");
            return token ? <BlogDetails /> : Navigate({ to: "/login" });
          }} />
        <Route path="/create-blog" Component={() => {
            const token = localStorage.getItem("token");
            return token ? <CreateBlog /> : Navigate({ to: "/login" });
          }} />
        <Route path="/login" Component={Login} />
        <Route path="/register" Component={ Register}/>
        <Route
          path="*"
          Component={() => {
            Navigate({ to: "/login" });
          }}
        />
      </Routes>
    </>
  );
}

export default App;