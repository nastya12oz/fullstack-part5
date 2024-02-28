import React from 'react';
import { useState } from 'react';


const BlogForm = ({ createBlog }) => {

  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' });

  const addBlog = (event) => {
    event.preventDefault();
    createBlog(newBlog);
    setNewBlog({ title: '', author: '', url: '' });
  };

 
  return(
  <div>
    <form onSubmit={addBlog}>
      <div>
        title
        <input
          type="text"
          value={newBlog.title}
          name="title"
          onChange={({ target }) =>
            setNewBlog({ ...newBlog, title: target.value })
          }
        />
      </div>
      <div>
        author
        <input
          type="text"
          value={newBlog.author}
          name="author"
          onChange={({ target }) =>
            setNewBlog({ ...newBlog, author: target.value })
          }
        />
      </div>
      <div>
        url
        <input
          type="text"
          value={newBlog.url}
          name="url"
          onChange={({ target }) =>
            setNewBlog({ ...newBlog, url: target.value })
          }
        />
      </div>
      <button type="submit">add</button>
    </form>
  </div>
 );
        }

export default BlogForm;
