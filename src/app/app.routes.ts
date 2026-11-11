import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { authGuard } from './core/auth.guard';
import { model } from '@angular/core';

export const routes: Routes = [
  {
    path:'login',
    loadComponent: ()=>import('./features/auth/auth-page/auth-page').then((m)=> m.AuthPage),
    data: {mode: 'login'}, //• Lazy-loads the standalone AuthPage component. Instead of bundling the authentication code into your app's initial download, Angular fetches this file only when a user actually navigates to /login, making initial page loads faster.
  },
  {
    path: 'register',
    loadComponent: ()=>import('./features/auth/auth-page/auth-page').then((m)=>
    m.AuthPage),
    data: {mode: 'register'},
  },
  {
    path: '',
    component: MainLayout,
    canActivateChild: [authGuard],
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
      {
        path:'tasks',
        loadComponent:()=>
          import('./features/tasks/tasks-page/tasks-page').then(m=> m.TasksPage),
      },
      {
        path:'team',
        loadComponent:()=>
          import('./features/team/team-page/team-page').then(m=> m.TeamPage),
      },
      {
        path:'settings',
        loadComponent:()=>
          import('./features/settings/settings-page/settings-page').then(m=> m.SettingsPage),
      },
    ],
  },
  {
    path: '**',
    loadComponent: ()=>import('./features/not-found/not-found-page/not-found-page').then(m=> m.NotFoundPage),
  },
];
