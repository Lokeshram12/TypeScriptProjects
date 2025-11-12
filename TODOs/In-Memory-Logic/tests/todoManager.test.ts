// tests/todoManager.test.ts
import { TodoManager } from "../src/todoManager";

describe("TodoManager", () => {
  let manager: TodoManager;

  beforeEach(() => {
    manager = new TodoManager();
  });

  test("addTask adds a task", () => {
    manager.addTask("Buy milk", "2 liters");
    const tasks = manager.listTasks();
    expect(tasks.length).toBe(1);
    expect(tasks[0].title).toBe("Buy milk");
  });

  test("markCompleted sets task completed", () => {
    manager.addTask("Clean room");
    const result = manager.markCompleted(1);
    const task = manager.listTasks()[0];
    expect(result).toBe(true);
    expect(task.completed).toBe(true);
  });

  test("deleteTask removes a task", () => {
    manager.addTask("Do laundry");
    const result = manager.deleteTask(1);
    const tasks = manager.listTasks();
    expect(result).toBe(true);
    expect(tasks.length).toBe(0);
  });

  test("listTasks returns all tasks", () => {
    manager.addTask("Task 1");
    manager.addTask("Task 2");
    const tasks = manager.listTasks();
    expect(tasks.length).toBe(2);
  });
});
