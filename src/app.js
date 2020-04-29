const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get('/repositories', (req, res) => {
  res.json(repositories)
})

app.get('/repositories/:id', (req, res) => {
  const { id } = req.params

  if (!id)
    return res.status(400).json({ error: 'id is required'})

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if (repositoryIndex < 0)
    return res.status(400).json({ error: `We could not find a repository with id ${id}`})

  return res.json(repositories[repositoryIndex])
})

app.post('/repositories', (req, res) => {
  const { url, techs, title } = req.body
  const repository = { id: uuid(), likes: 0, url, techs, title }

  repositories.push(repository)

  return res.status(200).json(repository)
})

app.post('/repositories/:id/like', (req, res) => {
  const { id } = req.params

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if (repositoryIndex < 0) return res.status(400).json({ error: `Could not find a repository with id: ${id}`})

  const repository = repositories[repositoryIndex]

  repository.likes++;

  return res.status(200).json(repository)
})

app.put('/repositories/:id', (req, res) => {
  const { id } = req.params
  const { url, techs, title } = req.body

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)
  
  if (repositoryIndex < 0)
    return res.status(400).json({ error: `We could not find a repository with id ${id}`})
  
  const { likes } = repositories[repositoryIndex]
  
  repositories[repositoryIndex] = { id, url, techs, title, likes }

  return res.json(repositories[repositoryIndex])
})

app.delete('/repositories/:id', (req, res) => {
  const { id } = req.params

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if (repositoryIndex < 0)
    return res.status(400).json({ error: `We could not find a repository with id ${id}`})

  repositories.splice(repositoryIndex, 1)

  return res.status(204).send()
})

module.exports = app;
