import { DatePipe } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Component, computed, inject } from '@angular/core';

import { toSignal } from '@angular/core/rxjs-interop';

import { ProjectsApiService } from '../data-access/projects-api.service';
import { ProjectStatus } from '../models/project.model';
import { TasksApiService } from '../data-access/tasks-api.service';
import { TaskStatus } from '../models/task.model';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './project-details.html',
  styleUrl: './project-details.scss',
})
export class ProjectDetails {
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

  readonly tasks=computed(()=>{
    const projectId=this.project()?.id;
    if(!projectId){
      return [];
    }
    return this.tasksService.tasks().filter((task)=>
    task.projectId=== projectId);
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
}
