const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if(!user) {
    return response.status(400).json({ error: 'User not found' })
  }

  request.user = user;

  return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  const existUser = users.some((user) => user.username === username);

  if(existUser) {
    return response.status(400).json({ error: 'username alredy registered' })
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  users.push(user); 

  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
 
  return response.status(200).json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { user } = request;

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  };

  const todoUser = user.todos;

  todoUser.push(todo);

  return response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { title, deadline } = request.body;
  const { user } = request;

  let { todos } = user;
  
  const index = todos.findIndex((todo) => todo.id === id);

  if(index < 0) {
    return response.status(404).json({ error: 'Todo not found' });
  }

  const todoUpdate = todos[index];

  const updatedTodo = Object.assign(todoUpdate, {
    title, 
    deadline
  });

  return response.status(200).json(updatedTodo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { user } = request;

  let { todos } = user;
  
  const index = todos.findIndex((todo) => todo.id === id);

  if(index < 0) {
    return response.status(404).json({ error: 'Todo not found' });
  }

  let todo = todos[index];

  todo.done = true;

  return response.status(200).json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { user } = request;

  let { todos } = user;
  
  const index = todos.findIndex((todo) => todo.id === id);

  if(index < 0) {
    return response.status(404).json({ error: 'Todo not found' });
  }

  todos.splice(todos[index], 1);

  return response.status(204).send();
});

module.exports = app;