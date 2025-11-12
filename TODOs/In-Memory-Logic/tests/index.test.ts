// tests/index.test.ts
import { TodoManager } from "../src/todoManager";

describe("Index file basic tests", () => {
  test("can create TodoManager instance", () => {
    const manager = new TodoManager();
    expect(manager.listTasks.length).toBe(0);
  });
});
