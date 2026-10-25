import { Injectable, signal } from '@angular/core';
import { Project, ProjectStatus } from '../models/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectsApiService {
  private readonly projectsState = signal<Project[]>([
    {
      id: 'project-1',
      name: 'Website Redesign',
      description: 'Redesign the company website with a modern, responsive interface',
      status: 'In Progress',
      progress: 75,
      dueDate: '2026-11-15',
      members: ['MG', 'JD', 'SL'],
      color: '#ede9fe',
      createdAt: '2026-101-01',
    },
    {
      id: 'project-2',
      name: 'Mobile Application',
      description: 'Build a mobile-friendly application for managing custom accounts.',
      status: 'In Progress',
      progress: 45,
      dueDate: '2026-12-10',
      members: ['MG', 'MK'],
      color: '#dbeafe',
      createdAt: '2026-10-04',
    },
    {
      id: 'project-3',
      name: 'API Integration',
      description: 'Integrate the internal services and improve API reliability.',
      status: 'Completed',
      progress: 100,
      dueDate: '2026-10-20',
      members: ['JD', 'SL', 'MK'],
      color: '#d1fae5',
      createdAt: '2026-09-20',
    },
    {
      id: 'project-4',
      name: 'Analytics Dashboard',
      description: 'Create analytics dashboards to track product performance.',
      status: 'Planned',
      progress: 0,
      dueDate: '2027-01-15',
      members: ['MG', 'SL'],
      color: '#ffedd5',
      createdAt: '2026-10-18',
    },
    {
      id: 'project-5',
      name: 'Authentication System',
      description: 'implement secure login, registration, and session management',
      status: 'In Progress',
      progress: 60,
      dueDate: '2026-11-28',
      members: ['MG', 'Mk', 'JD'],
      color: '#fce7f3',
      createdAt: '2026-10-12',
    },
    {
      id: 'project-6',
      name: 'Documentation Portal',
      description: 'Create a central place for technical guides and API documentation.',
      status: 'Planned',
      progress: 0,
      dueDate: '2027-02-01',
      members: ['SL'],
      color: '#e0e7ff',
      createdAt: '2026-10-20',
    },
  ]);

  readonly projects = this.projectsState.asReadonly();
  createProject(project: Omit<Project, 'id' | 'createdAt'>): void {
    const newProject: Project = {
      ...project,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    this.projectsState.update((projects) => [newProject, ...projects]);
  }

  updateStatus(id: string, status: ProjectStatus): void {
    this.projectsState.update((projects) =>
      projects.map((project) =>
        project.id === id
          ? {
              ...project,
              status,
              progress:
                status === 'Completed'
                  ? 100
                  : status === 'Planned'
                    ? 0
                    : Math.min(project.progress, 99),
            }
          : project,
      ),
    );
  }
}
