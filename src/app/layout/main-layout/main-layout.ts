import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { Navbar } from '../navbar/navbar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Sidebar, Navbar],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown)': 'handleDocumentKeydown($event)',
  },
})
export class MainLayout {
  readonly isNavigationOpen = signal(false);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.closeNavigation());
  }

  toggleNavigation(): void {
    this.isNavigationOpen.update((isOpen) => !isOpen);
  }

  closeNavigation(): void {
    this.isNavigationOpen.set(false);
  }

  handleDocumentKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeNavigation();
    }
  }
}
