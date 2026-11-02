import { Injectable, signal, computed, Signal } from '@angular/core';

import { Task, TaskStatus } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TasksApiService {
  private readonly tasksState = signal<Task[]>([
    {
      id: 'task-1',
      projectId: 'project-1',
      title: 'Design homepage',
      description: 'Create the homepage layout and UI design.',
      status: 'Completed',
      priority: 'High',
      assignee: 'John Doe',
      dueDate: '2026-11-05',
      createdAt: '2026-10-25T09:00:00.000Z',
      updatedAt: '2026-10-30T14:30:00.000Z',
    },
    {
      id: 'task-2',
      projectId: 'project-1',
      title: 'Build reusable UI components',
      description: 'Develop reusable buttons, cards and form elements.',
      status: 'In Progress',
      priority: 'High',
      assignee: 'JD',
      dueDate: '2026-11-08',
      createdAt: '2026-10-26T10:15:00.000Z',
      updatedAt: '2026-10-31T11:45:00.000Z',
    },
    {
      id: 'task-3',
      projectId: 'project-1',
      title: 'Connect the API',
      description: 'Integrate the frontend with the backend endpoints',
      status: 'Todo',
      priority: 'Medium',
      assignee: 'SL',
      dueDate: '2026-11-10',
      createdAt: '2026-10-27T11:30:00.000Z',
      updatedAt: '2026-11-01T13:00:00.000Z',
    },
    {
      id: 'task-4',
      projectId: 'project-1',
      title: 'Write component tests',
      description: 'Add unit tests for the reusable UI components',
      status: 'Todo',
      priority: 'Low',
      assignee: 'MK',
      dueDate: '2026-11-12',
      createdAt: '2026-10-28T12:45:00.000Z',
      updatedAt: '2026-11-02T14:15:00.000Z',
    },
    {
      id: 'task-5',
      projectId: 'project-2',
      title: 'Gather requirements',
      description: 'Document the initial project requirements',
      status: 'Completed',
      priority: 'Medium',
      assignee: 'MG',
      dueDate: '2026-11-06',
      createdAt: '2026-10-25T09:00:00.000Z',
      updatedAt: '2026-10-30T14:30:00.000Z',
    },
  ]);
  // readonly access
  readonly tasks = this.tasksState.asReadonly();
  // get tasks belonging to a particular project
  getTasksByProject(projectId: string): Signal<Task[]> {
    return computed(() => this.tasksState().filter((task) => task.projectId === projectId));
  }

  // create a new task
  createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): void {
    const now = new Date().toISOString();

    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    this.tasksState.update((tasks) => [...tasks, newTask]);
  }

  // update an existing task
  updateTask(id: string, changes: Partial<Omit<Task, 'id' | 'projectId' | 'createdAt'>>): void {
    this.tasksState.update((tasks) =>
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              ...changes,
              updatedAt: new Date().toISOString(),
            }
          : task,
      ),
    );
  }

  //   update task status
  updateTaskStatus(id: string, status: TaskStatus): void {
    this.updateTask(id, { status });
  }
  //   delete a task
  deleteTask(id: string): void {
    this.tasksState.update((tasks) => tasks.filter((task) => task.id !== id));
  }
}
