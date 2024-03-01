import { useState, useEffect } from 'react'
import blogService from '../services/blogs'
import React from 'react'

const Blog = ({ blog, user, setBlogs }) => {
  const [infoVisible, setInfoVisible] = useState(false)
  const showWhenVisible = { display: infoVisible ? '' : 'none' }
  const [likesCount, setLikesCount] = useState(blog.likes)

  useEffect(() => {
    setLikesCount(blog.likes)
  }, [blog])

  const handleLike = async (id) => {
    try {
      const updatedBlog = {
        user: user.id,
        likes: blog.likes + 1,
        author: blog.author,
        title: blog.title,
        url: blog.url
      }

      const returnedBlog = await blogService.update(id, updatedBlog)
      setLikesCount(returnedBlog.likes)
    } catch (exception) {
      console.error('Error liking the blog', exception)
    }
  }

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${blog.title}" by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id)
        setBlogs((prevBlogs) => prevBlogs.filter((b) => b.id !== blog.id))
      } catch (exception) {
        console.error('Error deleting the blog', exception)
      }
    }
  }


  return (
    <div className="single-blog" data-likes={blog.likes}>
      <p>
        <b className="blog-title">title</b> {blog.title}
        <button onClick={() => setInfoVisible(!infoVisible)}>
          {infoVisible ? 'hide' : 'show more'}
        </button>
      </p>
      <div style={showWhenVisible} className="blog-details">
        <div>
          <b className="blog-author">author</b> {blog.author}
        </div>
        <div className="blog-url">
          <b>url</b> {blog.url}
        </div>
        <div className="blog-likes">
          <span id="likesCount">likes {likesCount}</span>
          <button id="likeButton" onClick={() => handleLike(blog.id)}>like</button>
        </div>
        {blog?.user?.id === user?.id && (
  <button id="removeButton" onClick={handleDelete}>remove</button>
)} 
      </div>
    </div>
  )
}

export default Blog
