import { DatePipe } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Component, computed, inject } from '@angular/core';

import { toSignal } from '@angular/core/rxjs-interop';

import { ProjectsApiService } from '../data-access/projects-api.service';
import { ProjectStatus } from '../models/project.model';

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

  private readonly routeParams = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap,
  });
  readonly project = computed(() => {
    const id = this.routeParams().get('id');
    return this.projectsService.projects().find((project) => project.id === id);
  });

  readonly tasks = [
    {
      id: 'task-1',
      title: 'Design the page layout',
      status: 'Completed',
      priority: 'High',
      assignee: 'MG',
    },
    {
      id: 'task-2',
      title:'Build reusable UI components',
      status: 'In Progress',
      priority: 'High',
      assignee: 'JD',
    },
    {
      id: 'task-3',
      title:'Connect the API',
      status: 'In Progress',
      priority: 'Medium',
      assignee: 'SL',
    },
    {
      id: 'task-4',
      title:'Write component tests',
      status: 'Planned',
      priority: 'Low',
      assignee: 'MK',
    },
  ];
  updateProjectStatus(status: ProjectStatus):void{
    const project = this.project();
    if(project){
      this.projectsService.updateStatus(project.id, status);
    }
  }
}
