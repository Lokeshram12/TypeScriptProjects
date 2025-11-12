# TODOs — Project Notes

## Overview
- Console-based / in-memory logic focused on getting CRUD right.
- Backend + UI — focus on how data moves: **"I understand how systems talk."**
- Command Line tool (CLI) — focus on how users interact: **"I understand how people use systems."**

## Quick Setup
1. Initialize project
   - npm init -y
2. Install dev dependencies
   - npm install typescript ts-node @types/node --save-dev
3. Create TS config
   - npx tsc --init
4. Run the project
   - npx ts-node index.ts

## Project Structure
- src/
  - index.ts          — Entry point
  - task.ts           — Task interface
  - todoManager.ts    — CRUD logic

## Key Points
- **TypeScript types exist only at compile time.** No types at runtime.
- **ts-node** allows running TypeScript directly without pre-compiling.
  - ts-node compiles .ts → .js in memory using the TypeScript compiler API.
- **package.json** indicates project type (ES module/CommonJS) and defines scripts/dependencies.
- **package-lock.json** locks dependency versions for reproducible installs.
- **tsconfig.json** tells TypeScript how to emit JavaScript.

## Concepts to Remember
- Think of **Node** as the engine that runs JavaScript outside the browser.
- Think of **npm** as the toolkit manager that installs and manages libraries.


npm install --save-dev jest ts-jest @types/jest
