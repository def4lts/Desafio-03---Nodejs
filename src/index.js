const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function checksExistsRepository(request, response, next) {
  const { id } = request.params

  const repository = repositories.find(repository => repository.id === id)

  if (!repository) {
    return response.status(404).json({ error: 'repository not found' })
  }

  request.repository = repository

  return next()
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository)

  return response.status(201).json(repository);
});

app.put("/repositories/:id", checksExistsRepository, (request, response) => {
  const { repository } = request
  const { title, url, techs } = request.body;

  if (title) {
    repository.title = title
  }
  if (url) {
    repository.url = url
  }
  if (techs) {
    repository.techs = techs
  }

  return response.json(repository);
});

app.delete("/repositories/:id", checksExistsRepository, (request, response) => {
  const { repository } = request

  const repositoryIndex = repositories.indexOf(repository);

  if (repositoryIndex === -1) {
    return response.status(404).json({ error: 'Repository not found' });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", checksExistsRepository, (request, response) => {
  const { repository } = request

  repository.likes = repository.likes + 1

  return response.json(repository);
});

module.exports = app;
