import { Component,inject, signal } from '@angular/core';

import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-settings-page',
  imports: [],
  templateUrl: './settings-page.html',
  styleUrl: './settings-page.scss',
})
export class SettingsPage {
  readonly auth=inject(AuthService)
  readonly name=signal('');
  readonly saved=signal(false);
  readonly emailUpdates=signal(true);

  saveName():void{
    this.auth.updateName(this.name());
    this.name.set('');
    this.saved.set(true);
  }
}
