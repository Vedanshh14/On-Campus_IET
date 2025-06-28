import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import RequireAuth from "./components/RequireAuth";
import Home from "./pages/Home";
import SingleBlog from "./pages/SingleBlog";
import PostBlog from "./pages/PostBlog";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/forgotPassword";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog/:id" element={<SingleBlog />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />


        {/* Protected Routes */}
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />

        <Route
          path="/post"
          element={
            <RequireAuth>
              <PostBlog />
            </RequireAuth>
          }
        />
      </Routes>
    </>
  );
}

export default App;
