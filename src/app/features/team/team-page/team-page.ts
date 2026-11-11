import { Component } from '@angular/core';
import { email } from '@angular/forms/signals';

@Component({
  selector: 'app-team-page',
  imports: [],
  templateUrl: './team-page.html',
  styleUrl: './team-page.scss',
})
export class TeamPage {
  readonly members=[
    {
      initials:'MG',
      name: 'Medora Gomes',
      email: 'medora@example.com',
      role: 'Admin'
    },
    {
      initials:'JD',
      name: 'James Davis',
      email: 'james@example.com',
      role: 'Developer'
    },
    {
      initials:'SL',
      name: 'Sarah Lee',
      email: 'sarah@example.com',
      role: 'Designer'
    },
    {
      initials:'MK',
      name: 'Michael Kim',
      email: 'michael@example.com',
      role: 'Developer'
    },
  ]
}
