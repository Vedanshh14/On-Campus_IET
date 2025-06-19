import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Blog from './pages/SingleBlog';
// import PostBlog from './pages/PostBlog';
// import Profile from './pages/Profile';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog/:id" element={<Blog/>}/>
        {/* <Route path="/post" element={<PostBlog />} /> */}
        {/* <Route path="/profile" element={<Profile />} /> */}
      </Routes>
    </>
  );
}

export default App;