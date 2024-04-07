const request = require('supertest');
const app = require('express');
const fs = require('fs');

const fileName = "toDoList.json";

beforeEach(() => {
  // Reset the data file before each test
  fs.writeFileSync(fileName, '[]');
});

describe('GET /', () => {
  it('responds with 200 status code', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });

  it('renders the index template', async () => {
    const response = await request(app).get('/');
    expect(response.text).toContain('To-Do List');
  });

  it('displays the tasks in the data file', async () => {
    const tasks = [{ ID: 1, Task: 'Buy milk', Completed: false }];
    fs.writeFileSync(fileName, JSON.stringify(tasks));
    const response = await request(app).get('/');
    expect(response.text).toContain('Buy milk');
  });
});

describe('POST /addtask', () => {
  it('adds a task to the data file', async () => {
    const response = await request(app)
      .post('/addtask')
      .send({ newtask: 'Buy milk' });
    const data = JSON.parse(fs.readFileSync(fileName));
    expect(data).toEqual([{ ID: expect.any(Number), Task: 'Buy milk', Completed: false }]);
  });

  it('redirects to the root URL', async () => {
    const response = await request(app)
      .post('/addtask')
      .send({ newtask: 'Buy milk' });
    expect(response.status).toBe(302);
    expect(response.header.location).toBe('/');
  });
});

describe('POST /markcompleted', () => {
  it('marks the selected tasks as completed', async () => {
    const tasks = [
      { ID: 1, Task: 'Buy milk', Completed: false },
      { ID: 2, Task: 'Walk the dog', Completed: false }
    ];
    fs.writeFileSync(fileName, JSON.stringify(tasks));
    const response = await request(app)
      .post('/markcompleted')
      .send({ completedtasks: [1] });
    const data = JSON.parse(fs.readFileSync(fileName));
    expect(data).toEqual([
      { ID: 1, Task: 'Buy milk', Completed: true },
      { ID: 2, Task: 'Walk the dog', Completed: false }
    ]);
  });

  it('redirects to the root URL', async () => {
    const response = await request(app)
      .post('/markcompleted')
      .send({ completedtasks: [1] });
    expect(response.status).toBe(302);
    expect(response.header.location).toBe('/');
  });
});

describe('POST /deletetask', () => {
  it('deletes the specified task from the data file', async () => {
    const tasks = [{ ID: 1, Task: 'Buy milk', Completed: false }];
    fs.writeFileSync(fileName, JSON.stringify(tasks));
    const response = await request(app)
      .post('/deletetask')
      .send({ taskID: 1 });
    const data = JSON.parse(fs.readFileSync(fileName));
    expect(data).toEqual([]);
  });

  it('redirects to the root URL', async () => {
    const response = await request(app)
      .post('/deletetask')
      .send({ taskID: 1 });
    expect(response.status).toBe(302);
    expect(response.header.location).toBe('/');
  });
});
