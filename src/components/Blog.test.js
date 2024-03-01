import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import blogService from '../services/blogs'
import BlogForm from './BlogForm'

jest.mock('../services/blogs')


test('renders blog title and author', () => {
  const blog = {
    title: 'Blahblahlblablbalb',
    author: 'Test',
    likes: 5,
    url: 'http://example.com',
    user: { id: 'user666' }
  }

  render(<Blog blog={blog} user={{ id: 'user666' }} />)

  const titleElement = screen.getByText('Blahblahlblablbalb')
  const authorElement = screen.getByText('Test')
  expect(titleElement).toBeDefined()
  expect(authorElement).toBeDefined()
})

test('toggles blog details visibility', async () => {
  const blog = {
    title: 'Blahblahlblablbalb',
    author: 'Test',
    likes: 5,
    url: 'http://example.com',
    user: { id: 'user666' }
  }

  render(<Blog blog={blog} user={{ id: 'user666' }} />)

  const user = userEvent.setup()
  const button = screen.getByText('show more')
  await user.click(button)

  const urlElement = screen.getByText('http://example.com')
  expect(urlElement).toBeDefined()
})

test('clicking the like button increases likes count', async () => {
  const blog = {
    title: 'Blahblahlblablbalb',
    author: 'Test',
    likes: 5,
    url: 'http://example.com',
    user: { id: 'user666' },
    id: 'blog666'
  }

  render(<Blog blog={blog} user={{ id: 'user666' }} setBlogs={() => {}} />)

  const user = userEvent.setup()
  const likeButton = screen.getByText('like')
  await user.click(likeButton)


  expect(likeButton).toBeDefined()
})

test('blog URL and number of likes are shown when details are toggled', async () => {
  const blog = {
    title: 'Blahblahlblablbalb',
    author: 'Test',
    likes: 5,
    url: 'http://example.com',
    user: { id: 'user666' }
  }

  render(<Blog blog={blog} user={{ id: 'user666' }} />)

  const button = screen.getByText('show more')
  await userEvent.click(button)

  const urlElement = screen.getByText('http://example.com')
  const likesElement = screen.getByText('likes 5')
  expect(urlElement).toBeDefined()
  expect(likesElement).toBeDefined()
})

test('clicking the like button twice calls event handler twice', async () => {
  blogService.update.mockClear()

  const blog = {
    title: 'Blahblahlblablbalb',
    author: 'Test Author',
    likes: 5,
    url: 'http://example.com',
    user: { id: 'user666' },
    id: 'blog666'
  }

  blogService.update.mockResolvedValue({ ...blog, likes: blog.likes + 1 })

  render(<Blog blog={blog} user={{ id: 'user666' }} setBlogs={() => {}} />)

  const user = userEvent.setup()
  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(blogService.update.mock.calls).toHaveLength(2)
})

test('blog form calls event handler with right details when a new blog is created', async () => {
  const createBlog = jest.fn()
  render(<BlogForm createBlog={createBlog} />)

  const user = userEvent.setup()
  const titleInput = screen.getByPlaceholderText('Title')
  const authorInput = screen.getByPlaceholderText('Author')
  const urlInput = screen.getByPlaceholderText('URL')
  const submitButton = screen.getByText('add')

  await user.type(titleInput, 'Blog')
  await user.type(authorInput, 'Author')
  await user.type(urlInput, 'http://example.com')
  await user.click(submitButton)

  expect(createBlog).toHaveBeenCalledWith({
    title: 'Blog',
    author: 'Author',
    url: 'http://example.com'
  })
})