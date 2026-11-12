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
      assignee: 'JD',
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
    {
      id: 'task-6',
      projectId: 'project-2',
      title: 'Create wireframes',
      description: 'Design wireframes for the main pages of the application.',
      status: 'In Progress',
      priority: 'High',
      assignee: 'JD',
      dueDate: '2026-11-09',
      createdAt: '2026-10-26T10:15:00.000Z',
      updatedAt: '2026-10-31T11:45:00.000Z',
    },
    {
      id: 'task-7',
      projectId: 'project-3',
      title: 'Set up project repository',
      description: 'Initialize the project repository and set up version control.',
      status: 'Todo',
      priority: 'Medium',
      assignee: 'SL',
      dueDate: '2026-11-11',
      createdAt: '2026-10-27T11:30:00.000Z',
      updatedAt: '2026-11-01T13:00:00.000Z',
    },
    {
      id: 'task-8',
      projectId: 'project-3',
      title: 'Implement authentication',
      description: 'Add user authentication and authorization features.',
      status: 'Todo',
      priority: 'High',
      assignee: 'MK',
      dueDate: '2026-11-13',
      createdAt: '2026-10-28T12:45:00.000Z',
      updatedAt: '2026-11-02T14:15:00.000Z',
    },
    {
      id: 'task-9',
      projectId: 'project-3',
      title: 'Write API documentation',
      description: 'Create comprehensive documentation for the REST API endpoints.',
      status: 'Todo',
      priority: 'Medium',
      assignee: 'SL',
      dueDate: '2026-11-15',
      createdAt: '2026-10-29T13:00:00.000Z',
      updatedAt: '2026-11-03T15:30:00.000Z',
    },
    {
      id: 'task-10',
      projectId: 'project-4',
      title: 'Conduct code review',
      description: 'Review the implementation of the new features.',
      status: 'Todo',
      priority: 'Low',
      assignee: 'JD',
      dueDate: '2026-11-17',
      createdAt: '2026-10-30T14:00:00.000Z',
      updatedAt: '2026-11-04T16:45:00.000Z',
    },
    {
      id: 'task-11',
      projectId: 'project-4',
      title: 'Optimize database queries',
      description: 'Improve the performance of database queries for better response times.',
      status: 'In Progress',
      priority: 'High',
      assignee: 'MG',
      dueDate: '2026-11-19',
      createdAt: '2026-10-31T15:15:00.000Z',
      updatedAt: '2026-11-05T17:30:00.000Z',
    },
    {
      id: 'task-12',
      projectId: 'project-5',
      title: 'Implement caching mechanism',
      description: 'Add a caching mechanism to improve application performance.',
      status: 'Todo',
      priority: 'Medium',
      assignee: 'SL',
      dueDate: '2026-11-21',
      createdAt: '2026-11-01T16:00:00.000Z',
      updatedAt: '2026-11-06T18:30:00.000Z',
    },
    {
      id: 'task-13',
      projectId: 'project-5',
      title: 'Set up continuous integration',
      description: 'Configure continuous integration for automated testing and deployment.',
      status: 'In Progress',
      priority: 'High',
      assignee: 'JD',
      dueDate: '2026-11-23',
      createdAt: '2026-11-02T17:15:00.000Z',
      updatedAt: '2026-11-07T19:30:00.000Z',
    },
    {
      id: 'task-14',
      projectId: 'project-6',
      title: 'Conduct user testing',
      description: 'Perform user testing to gather feedback on the application.',
      status: 'Todo',
      priority: 'Medium',
      assignee: 'MG',
      dueDate: '2026-11-25',
      createdAt: '2026-11-03T18:00:00.000Z',
      updatedAt: '2026-11-08T20:30:00.000Z',
    },
    {
      id: 'task-15',
      projectId: 'project-6',
      title: 'Fix reported bugs',
      description: 'Address and fix the bugs reported during user testing.',
      status: 'In Progress',
      priority: 'High',
      assignee: 'SL',
      dueDate: '2026-11-27',
      createdAt: '2026-11-04T19:15:00.000Z',
      updatedAt: '2026-11-09T21:30:00.000Z',
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
