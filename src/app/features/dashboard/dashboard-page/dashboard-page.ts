import { Component, computed, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/auth.service';

import { ProjectsApiService } from '../../projects/data-access/projects-api.service';
import { TasksApiService } from '../../projects/data-access/tasks-api.service';

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage {
  private readonly router = inject(Router);
  private projectsService = inject(ProjectsApiService);
  private readonly tasksService = inject(TasksApiService);
  private readonly auth = inject(AuthService);

  readonly userName = computed(() => this.auth.currentUser()?.name ?? 'there'); //defines a read-only, reactive userName property that automatically returns the logged-in user's name or falls back to 'there'. Whenever currentUser updates, userName recalculates on its own without manual refresh logic.

  readonly dateLabel = new Date()
    .toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })
    .toUpperCase();

  readonly projects = computed(() => {
    const tasks = this.tasksService.tasks();

    // return: sends back the entire transformed array
    return this.projectsService
      .projects()
      .slice(0, 3)
      .map((project) => {
        const projectTasks = tasks.filter((task) => task.projectId === project.id);

        const completed = projectTasks.filter((task) => task.status === 'Completed').length;

        const progress = projectTasks.length
          ? Math.round((completed / projectTasks.length) * 100)
          : project.progress;

        // inner return sends back each individual project object inside .map()
        return {
          ...project,
          code: project.id,
          progress,
          tasks: `${completed}/${projectTasks.length}`,
          displayStatus: project.status,
        };
      });
  });

  readonly stats = computed(() => {
    const projects = this.projectsService.projects();
    const tasks = this.tasksService.tasks();

    return [
      {
        label: 'Total Projects',
        value: String(projects.length),
        change: 'In this workspace',
        icon: '▧',
      },
      {
        label: 'Tasks Completed',
        value: String(tasks.filter((task) => task.status === 'Completed').length),
        change: `Of ${tasks.length} sample tasks`,
        icon: '✓',
      },
      {
        label: 'In Progress',
        value: String(tasks.filter((task) => task.status === 'In Progress').length),
        change: 'Tasks across projects',
        icon: '◷',
      },
      { label: 'Team Members', value: '4', change: 'Sample workspace members', icon: '♧' },
    ];
  });

  readonly activities = [
    {
      initials: 'JD',
      person: 'James Davis',
      action: 'completed',
      target: 'Login page UI',
      time: '10 min ago',
      color: '#dbeafe',
      textColor: '#1d4ed8',
    },
    {
      initials: 'SL',
      person: 'Sarah Lee',
      action: 'created a task in',
      target: 'Mobile Application ',
      time: '35 min ago',
      color: '#fce7f3',
      textColor: '#be185d',
    },
    {
      initials: 'MK',
      person: 'Michael Kim',
      action: 'updated',
      target: 'API Integration',
      time: '1 hour ago',
      color: '#d1fae5',
      textColor: '#047857',
    },
  ];

  goToProjects(): void {
    this.router.navigateByUrl('/projects');
  }
}
