import { DatePipe } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Component, computed, inject } from '@angular/core';

import { toSignal } from '@angular/core/rxjs-interop';

import { ProjectsApiService } from '../data-access/projects-api.service';
import { ProjectStatus } from '../models/project.model';
import { TasksApiService } from '../data-access/tasks-api.service';
import { TaskStatus, Task, TaskPriority } from '../models/task.model';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { signal } from '@angular/core';

@Component({
  selector: 'app-project-details',
  imports: [DatePipe, RouterLink, ReactiveFormsModule],
  templateUrl: './project-details.html',
  styleUrl: './project-details.scss',
})
export class ProjectDetails {
  readonly deletingTaskId = signal<string | null>(null);
  private readonly fb = inject(FormBuilder);
  readonly showCreateTaskForm = signal(false);
  readonly editingTaskId = signal<string | null>(null);
  readonly taskForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    priority: ['Medium' as TaskPriority],
    assignee: [''],
    dueDate: [''],
  });
  private readonly route = inject(ActivatedRoute);
  private readonly projectsService = inject(ProjectsApiService);
  private readonly tasksService = inject(TasksApiService);

  private readonly routeParams = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });

  readonly project = computed(() => {
    const id = this.routeParams().get('id');
    return this.projectsService.projects().find((project) => project.id === id);
  });

  readonly tasks = computed(() => {
    const projectId = this.project()?.id;
    if (!projectId) {
      return [];
    }
    return this.tasksService.tasks().filter((task) => task.projectId === projectId);
  });

  readonly projectProgress = computed(() => {
    const currentTasks = this.tasks();
    if (currentTasks.length === 0) {
      return 0;
    }
    const completedTasks = currentTasks.filter((task) => task.status === 'Completed').length;
    return Math.round((completedTasks / currentTasks.length) * 100);
  });

  updateProjectStatus(status: ProjectStatus): void {
    const project = this.project();
    if (project) {
      this.projectsService.updateStatus(project.id, status);
    }
  }

  toggleTaskCompletion(taskId: string, currentStatus: TaskStatus): void {
    const newStatus: TaskStatus = currentStatus === 'Completed' ? 'Todo' : 'Completed';
    this.tasksService.updateTaskStatus(taskId, newStatus);
  }
  updateTaskStatus(taskId: string, status: TaskStatus): void {
    this.tasksService.updateTaskStatus(taskId, status);
  }

  openCreateTaskForm(): void {
    this.editingTaskId.set(null);

    this.taskForm.reset({
      title: '',
      description: '',
      priority: 'Medium',
      assignee: '',
      dueDate: '',
    });
    this.showCreateTaskForm.set(true);
  }

  openEditTaskForm(task: Task): void {
    this.editingTaskId.set(task.id);
    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      priority: task.priority,
      assignee: task.assignee,
      dueDate: task.dueDate,
    });
    this.showCreateTaskForm.set(true);
  }
  cancelCreateTask(): void {
    this.showCreateTaskForm.set(false);
    this.editingTaskId.set(null);
    this.taskForm.reset({
      title: '',
      description: '',
      priority: 'Medium',
      assignee: '',
      dueDate: '',
    });
  }

  saveTask(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }
    const project = this.project();
    if (!project) {
      return;
    }
    const formValue = this.taskForm.getRawValue();

    const taskData = {
      title: formValue.title.trim(),
      description: formValue.description.trim(),
      priority: formValue.priority,
      assignee: formValue.assignee.trim(),
      dueDate: formValue.dueDate,
    };
    const taskId = this.editingTaskId();
    if (taskId) {
      this.tasksService.updateTask(taskId, taskData);
    } else {
      this.tasksService.createTask({
        ...taskData,
        projectId: project.id,
        status: 'Todo',
      });
    }
    this.cancelCreateTask();
  }
  createTask(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }
    const project = this.project();

    if (!project) {
      return;
    }
    const formValue = this.taskForm.getRawValue();
    this.tasksService.createTask({
      projectId: project.id,
      title: formValue.title.trim(),
      description: formValue.description.trim(),
      status: 'Todo',
      priority: formValue.priority,
      assignee: formValue.assignee.trim(),
      dueDate: formValue.dueDate,
    });
    this.cancelCreateTask();
  }

  requestDeleteTask(taskId: string): void {
    this.deletingTaskId.set(taskId);
  }
  cancelDeleteTask(): void {
    this.deletingTaskId.set(null);
  }
  confirmDeleteTask(): void {
    const taskId = this.deletingTaskId();
    if (!taskId) {
      return;
    }
    this.tasksService.deleteTask(taskId);
    this.deletingTaskId.set(null);
  }
}
