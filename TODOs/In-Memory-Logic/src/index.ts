// src/index.ts
import readline from "node:readline";  // Node ES Module style
import { TodoManager } from "./todoManager.js";  // ES6 import (with .js when using NodeNext)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const manager = new TodoManager();

function showMenu() {
  console.log(`
--------------------------
🧭  TO-DO LIST APP
--------------------------
1. Add Task
2. View Tasks
3. Mark Task Completed
4. Delete Task
5. Exit
`);
}

function handleUserChoice() {
  rl.question("Choose an option (1-5): ", (choice) => {
    switch (choice) {
      case "1":
        rl.question("Enter task title: ", (title) => {
          rl.question("Enter description (optional): ", (desc) => {
            manager.addTask(title, desc);
            showMenu();
            handleUserChoice();
          });
        });
        break;

      case "2":
        manager.listTasks();
        showMenu();
        handleUserChoice();
        break;

      case "3":
        rl.question("Enter task ID to mark as completed: ", (id) => {
          manager.markCompleted(Number(id));
          showMenu();
          handleUserChoice();
        });
        break;

      case "4":
        rl.question("Enter task ID to delete: ", (id) => {
          manager.deleteTask(Number(id));
          showMenu();
          handleUserChoice();
        });
        break;

      case "5":
        console.log("👋 Goodbye!");
        rl.close();
        break;

      default:
        console.log("❌ Invalid option, try again.");
        showMenu();
        handleUserChoice();
    }
  });
}

// start the app
showMenu();
handleUserChoice();
