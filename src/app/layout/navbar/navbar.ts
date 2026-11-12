import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { filter, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private readonly router = inject(Router);
  readonly searchTerm = signal('');

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );
  // creates a read-only Angular Signal that automatically tracks and stores the browser's current active URL path whenever navigation finishes

  readonly pageTitle = computed(() => {
    const path = this.currentUrl().split('?')[0];
    if (path.startsWith('/projects/')) return 'Projects / Details';
    if (path.startsWith('/projects')) return 'Projects';
    if (path.startsWith('/tasks')) return 'My Tasks';
    if (path.startsWith('/team')) return 'Team';
    if (path.startsWith('/settings')) return 'Settings';
    return 'Overview';
  });

  searchTasks(event: Event): void {
    event.preventDefault();
    const query = this.searchTerm().trim();
    this.router.navigate(['/tasks'], { queryParams: query ? { q: query } : {} });
  }
}
