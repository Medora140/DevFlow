import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard-page/dashboard-page').then((m) => m.DashboardPage),
        // lazy loading
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./features/projects/projects-page/projects-page').then((m) => m.ProjectsPage),
      },
      {
        path: 'projects/:id',
        loadComponent: () =>
          import('./features/projects/project-details/project-details').then(
            (m) => m.ProjectDetails,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
