import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ProjectsApiService } from '../data-access/projects-api.service';

import { Project, ProjectStatus } from '../models/project.model';
import { RouterLink } from '@angular/router';
import { TasksApiService } from '../data-access/tasks-api.service';

@Component({
  selector: 'app-projects-page',
  imports: [FormsModule, DatePipe, RouterLink],
  templateUrl: './projects-page.html',
  styleUrl: './projects-page.scss',
})
export class ProjectsPage {
  private readonly projectsService = inject(ProjectsApiService);
  private readonly tasksService = inject(TasksApiService);
  readonly projects = this.projectsService.projects;
  readonly searchTerm = signal('');
  readonly selectedStatus = signal('All');
  readonly showCreateModal = signal(false);
  readonly filters = ['All', 'In Progress', 'Planned', 'Completed'];

  readonly filteredProjects = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();

    const status = this.selectedStatus();
    const allTasks = this.tasksService.tasks();
    return this.projects()
      .map((project) => {
        const projectTasks = allTasks.filter((task) => task.projectId === project.id);
        const completedTasks = projectTasks.filter((task) => task.status === 'Completed').length;
        const progress =
          projectTasks.length === 0 ? 0 : Math.round((completedTasks / projectTasks.length) * 100);
        return { ...project, progress };
      })
      .filter((project) => {
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

  closeCreateModal(): void {
    this.showCreateModal.set(false);
  }

  createProject(): void {
    const name = this.projectName.trim();
    if (!name) {
      this.formError = 'Please enter a project name.';
      return;
    }
    if (this.projectDueDate && this.projectDueDate < new Date().toISOString().slice(0, 10)) {
      this.formError = 'The due date cannot be in the past.';
      return;
    }

    this.projectsService.createProject({
      name,
      description: this.projectDescription.trim(),
      status: this.projectStatus,
      progress: this.projectStatus === 'Completed' ? 100 : 0,
      dueDate: this.projectDueDate,
      members: ['MG'],
      color: 'var(--color-primary-tint)',
    });
    this.closeCreateModal();
  }
  updateStatus(project: Project, status: ProjectStatus): void {
    this.projectsService.updateStatus(project.id, status);
  }
  private resetForm(): void {
    this.projectName = '';
    this.projectDescription = '';
    this.projectStatus = 'Planned';
    this.projectDueDate = '';
    this.formError = '';
  }
}
