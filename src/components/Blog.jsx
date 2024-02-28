import './blog.css';
import { useState, useEffect } from 'react';
import blogService from '../services/blogs';

const Blog = ({ blog, user, setBlogs }) => {
  const [infoVisible, setInfoVisible] = useState(false);
  const showWhenVisible = { display: infoVisible ? '' : 'none' };
  const [likesCount, setLikesCount] = useState(blog.likes);

  useEffect(() => {
    setLikesCount(blog.likes);
  }, [blog]);

  const handleLike = async (id) => {
    try {
      console.log('user', user.id);
      const updatedBlog = {
        user: user.id,
        likes: blog.likes + 1,
        author: blog.author,
        title: blog.title,
        url: blog.url
      };

      console.log(updatedBlog);
      const returnedBlog = await blogService.update(id, updatedBlog);
      setLikesCount(returnedBlog.likes);
    } catch (exception) {
      console.error('Error liking the blog', exception);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${blog.title}" by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id);
        setBlogs((prevBlogs) => prevBlogs.filter((b) => b.id !== blog.id));
      } catch (exception) {
        console.error('Error deleting the blog', exception);
      }
    }
  };

  return (
    <div className="single-blog">
      <p>
        <b>title</b> {blog.title}
        <button onClick={() => setInfoVisible(!infoVisible)}>
          {infoVisible ? 'hide' : 'show more'}
        </button>
      </p>
      <div style={showWhenVisible}>
        <div>
          <b>author</b> {blog.author}
        </div>
        <div>
          <b>url</b> {blog.url}
        </div>
        <div>
          <span>likes {likesCount}</span>
          <button onClick={() => handleLike(blog.id)}>like</button>
        </div>
        <button onClick={handleDelete}>remove</button>
      </div>
    </div>
  );
};

export default Blog;
