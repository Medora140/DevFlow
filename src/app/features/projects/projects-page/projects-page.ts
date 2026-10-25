import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ProjectsApiService } from '../data-access/projects-api.service';

import { Project, ProjectStatus } from '../models/project.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [FormsModule, DatePipe, RouterLink],
  templateUrl: './projects-page.html',
  styleUrl: './projects-page.scss',
})
export class ProjectsPage {
  private readonly projectsService = inject(ProjectsApiService);
  readonly projects = this.projectsService.projects;
  readonly searchTerm = signal('');
  readonly selectedStatus = signal('All');
  readonly showCreateModal = signal(false);
  readonly filters = ['All', 'In Progress', 'Planned', 'Completed'];

  readonly filteredProjects = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();

    const status = this.selectedStatus();

    return this.projects().filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query);

      const matchesStatus = status === 'All' || project.status === status;
      return matchesSearch && matchesStatus;
    });
  });
  readonly totalProjects = computed(() => this.projects().length);

  readonly activeProjects = computed(
    () => this.projects().filter((p) => p.status === 'In Progress').length,
  );

  readonly completedProjects = computed(
    () => this.projects().filter((p) => p.status === 'Completed').length,
  );

  projectName = '';
  projectDescription = '';
  projectStatus: ProjectStatus = 'Planned';
  projectDueDate = '';
  formError = '';

  openCreateModal(): void {
    this.resetForm();
    this.showCreateModal.set(true);
  }

  cloaseCreateModal():void{
    this.showCreateModal.set(false);
  }

  createProject():void{
    const name = this.projectName.trim();
    if(!name){
      this.formError = 'Please enter a project name.';
      return;
    }
    if(
      this.projectDueDate && this.projectDueDate < new Date().toISOString().slice(0,10)
    ){
      this.formError = 'The due date cannot be in the past.';
      return;
    }

    this.projectsService.createProject({
      name,
      description: this.projectDescription.trim(),
      status: this.projectStatus,
      progress: this.projectStatus === 'Completed' ? 100:0,
      dueDate: this.projectDueDate,
      members: ['MG'],
      color: '#ede9fe',
    });
    this.cloaseCreateModal();
  }
  updateStatus(project: Project, status: ProjectStatus): void{
    this.projectsService.updateStatus(project.id, status);
  }
  private resetForm(): void{
    this.projectName= '';
    this.projectDescription = '';
    this.projectStatus = 'Planned';
    this.projectDueDate = '';
    this.formError = '';
  }
}
