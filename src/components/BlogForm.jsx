import React from 'react'
import { useState } from 'react'


const BlogForm = ({ createBlog }) => {

  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  const addBlog = (event) => {
    event.preventDefault()
    createBlog(newBlog)
    setNewBlog({ title: '', author: '', url: '' })
  }


  return(
    <div>
      <form onSubmit={addBlog}>
        <div>
        title
          <input
            id="title"
            type="text"
            value={newBlog.title}
            name="title"
            placeholder="Title"
            onChange={({ target }) =>
              setNewBlog({ ...newBlog, title: target.value })
            }
          />
        </div>
        <div>
        author
          <input
            id="author"
            type="text"
            value={newBlog.author}
            name="author"
            placeholder="Author"
            onChange={({ target }) =>
              setNewBlog({ ...newBlog, author: target.value })
            }
          />
        </div>
        <div>
        url
          <input
            id="url"
            type="text"
            value={newBlog.url}
            name="url"
            placeholder="URL"
            onChange={({ target }) =>
              setNewBlog({ ...newBlog, url: target.value })
            }
          />
        </div>
        <button type="submit">add</button>
      </form>
    </div>
  )
}

export default BlogForm
