// tests/task.test.ts
import type { Task } from "../src/task.js";

describe("Task type", () => {
  test("should allow creating a valid task object", () => {
    const task: Task = {
      id: 1,
      title: "Test Task",
      description: "Description",
      completed: false,
    };

    expect(task.id).toBe(1);
    expect(task.title).toBe("Test Task");
    expect(task.description).toBe("Description");
    expect(task.completed).toBe(false);
  });
});
