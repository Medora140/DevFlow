import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.sidebar-open]': 'isOpen()',
  },
})
export class Sidebar {
  readonly isOpen = input(false);
  readonly closed = output<void>();
  readonly auth = inject(AuthService);
  // it retrieves an instance of a service or  directly inside a component without needing a constructor
  private readonly router = inject(Router);

  signOut(): void {
    this.auth.signOut();
    this.router.navigateByUrl('/login');
  }
}
