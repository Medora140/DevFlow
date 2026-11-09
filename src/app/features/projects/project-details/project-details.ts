import { DatePipe } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Component, computed, inject } from '@angular/core';

import { toSignal } from '@angular/core/rxjs-interop';

import { ProjectsApiService } from '../data-access/projects-api.service';
import { ProjectStatus } from '../models/project.model';
import { TasksApiService } from '../data-access/tasks-api.service';
import { TaskStatus } from '../models/task.model';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { signal } from '@angular/core';
import { TaskPriority } from '../models/task.model';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [DatePipe, RouterLink, ReactiveFormsModule],
  templateUrl: './project-details.html',
  styleUrl: './project-details.scss',
})
export class ProjectDetails {
  private readonly fb=inject(FormBuilder);
  readonly showCreateTaskForm= signal(false);
  readonly taskForm=this.fb.nonNullable.group({
    title: ['',[Validators.required, Validators.minLength(3)]],
    description: [''],
    priority: ['Medium' as TaskPriority],
    assignee: [''],
    dueDate: [''],
  })
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
  updateProjectStatus(status: ProjectStatus): void {
    const project = this.project();
    if (project) {
      this.projectsService.updateStatus(project.id, status);
    }
  }
  updateTaskStatus(taskId: string, status: TaskStatus): void {
    this.tasksService.updateTaskStatus(taskId, status);
  }

  openCreateTaskForm():void{
    this.showCreateTaskForm.set(true);
  }
  cancelCreateTask():void{
    this.showCreateTaskForm.set(false);
    this.taskForm.reset({
      title: '',
      description:'',
      priority:'Medium',
      assignee:'',
      dueDate:'',
    })
  }
  createTask():void{
    if(this.taskForm.invalid){
      this.taskForm.markAllAsTouched();
      return;
    }
    const project=this.project();

    if(!project){
      return;
    }
    const formValue=this.taskForm.getRawValue();
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
}
