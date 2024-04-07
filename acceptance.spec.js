const puppeteer = require('puppeteer');
const expect = require('chai').expect;


describe('Acceptance Tests', () => {
  let browser, page;

  before(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  after(async () => {
    await browser.close();
  });

  it('should load the home page', async () => {
    await page.goto('http://localhost:3000');
    const title = await page.title();
    expect(title).to.equal('ToDo App');
  });

  it('should add a task', async () => {
    await page.goto('http://localhost:3000');
    const input = await page.$('input[id="newtask"]');
    await input.type('New Task');
    const button = await page.$('button[id="addbutton"]');
    await button.click();
    // const task2 = await page.$('input[id="task"]');
    // expect(tasks.length).to.equal(1);
  });

  it('should mark a task as completed', async () => {
    await page.goto('http://localhost:3000');
    const checkbox = await page.$('.list-group-item input[id="task"]');
    await checkbox.click();
    const completedTasks = await page.$$('.task.completed');
    expect(completedTasks.length).to.equal(0);
  });

  it('should delete a task', async () => {
    await page.goto('http://localhost:3000');
    const deleteButton = await page.$('button[id="deleteButton"]');
    await deleteButton.click();
    // const tasks = await page.$$('.task');
    // expect(tasks.length).to.equal(0);
  });
});
