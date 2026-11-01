import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage {
  readonly stats = [
    { label: 'Total Projects', value: '12', change: '+2 this month', icon: '▧' },
    { label: 'Tasks Completed', value: '48', chnage: '+12 this week', icon: '✓' },
    { label: 'In Progress', value: '8', change: '3 due this week', icon: '◷' },
    { label: 'Team Members', value: '6', change: 'Across 3 projects', icon: '♧' },
  ];
  readonly projects = [
    {
      name: 'Website Redesign',
      code: 'project-1',
      color: '#ede9fe',
      textColor: '#6d28d9',
      progress: 75,
      tasks: '12/16',
      status: 'On track',
    },
    {
      name: 'Mobile Application',
      code: 'project-2',
      color: '#dbeafe',
      textColor: '#1d4ed8',
      progress: 45,
      tasks: '9/20',
      status: 'In progress',
    },
    {
      name: 'API Integration',
      code: 'project-3',
      color: '#d1fae5',
      textColor: '#047857',
      progress: 90,
      tasks: '18/20',
      status: 'Almost done',
    },
  ];

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
}
