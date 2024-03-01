import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}


const getAll = async () => {
  if (!token) {
    return []
  }

  const config = {
    headers: { Authorization: token },
  }

  try {
    const response = await axios.get(baseUrl, config)
    return response.data
  } catch (error) {
    console.error(error)
    return []
  }
}


const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  console.log('newObject', newObject)


  const response = await axios.post(baseUrl, newObject, config)
  console.log('response', response)
  return response.data
}


const update = async (id, updatedBlog) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.put(`${baseUrl}/${id}`, updatedBlog, config)
  return response.data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}


export default { getAll, create, update, setToken, remove }