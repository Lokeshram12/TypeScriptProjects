// src/todoManager.ts
import type { Task } from "./task.js";

export class TodoManager {
  private tasks: Task[] = [];
  private nextId = 1;

  addTask(title: string, description?: string) {
    const newTask: Task = {
      id: this.nextId++,
      title,
      description,
      completed: false,
    };
    this.tasks.push(newTask);
    console.log(`✅ Task added: "${title}"`);
    return { ...newTask };
  }

  listTasks() {
    if (this.tasks.length === 0) {
      console.log("No tasks yet!");
      return [];
    }

    console.log("\n📝 Your Tasks:");
    this.tasks.forEach((task) => {
      console.log(
        `${task.id}. [${task.completed ? "✔" : " "}] ${task.title}${
          task.description ? " - " + task.description : ""
        }`
      );
    });
    return this.tasks.map((t) => ({ ...t }));
  }

  markCompleted(id: number) {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) {
      console.log("❌ Task not found!");
       return false;
    }
    task.completed = true;
    console.log(`✅ Task "${task.title}" marked as completed.`);
    return true;
  }

  deleteTask(id: number) {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) {
      console.log("❌ Task not found!");
      return false;
    }
    const [removed] = this.tasks.splice(index, 1);
    console.log(`🗑️ Task "${removed.title}" deleted.`);
    return true;
  }
}
