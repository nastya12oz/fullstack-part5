import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/Login-Form'
import BlogForm from './components/BlogForm'
import Togglable from './components/Toggable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
      blogService.getAll().then((blogs) => setBlogs(blogs))
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      const blogs = await blogService.getAll()
      setBlogs(blogs)
      setNotification({ message: 'Logged in successfully', type: 'success' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (exception) {
      setNotification({ message: 'Wrong credentials', type: 'error' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }


  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      const createdBlog = await blogService.create(blogObject)
      console.log('created blog', createdBlog)
      setBlogs(blogs.concat(createdBlog))
      setNotification({ message: `A new blog "${createdBlog.title}" by ${createdBlog.author} added`, type: 'success' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (exception) {
      console.log(exception) // This will log the error object to your console.
      setNotification({ message: 'Failed to add blog', type: 'error' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }


  const logout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
    setBlogs([])
    setNotification({ message: 'Logged out successfully', type: 'success' })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }


  const sortedBlogs = [...blogs].sort((a,b) => b.likes - a.likes)


  return (
    <div>
      <Notification message={notification?.message} type={notification?.type} />
      {user === null ? (
        <Togglable buttonLabel='login'>
          <LoginForm
            handleLogin={handleLogin}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
          />
        </Togglable>
      ) : (
        <>
          <div>
            <p>{user.username} is logged in</p>
            <button onClick={logout}>logout</button>
          </div>

          <Togglable buttonLabel="create new blog" ref={blogFormRef}>
            <BlogForm
              createBlog={addBlog}
              logout={logout}
              setNotification={setNotification}
              blogs={blogs}
              setBlogs={setBlogs}

            />

          </Togglable>
        </>
      )}
      <h2>blogs</h2>
      {sortedBlogs.map((blog) => (
        <Blog key={blog.id} blog={blog} user={user}  setBlogs={setBlogs} />
      ))}
    </div>
  )
}

export default App

