// signal() holds writable source state that we change directly, while computed() derives read-only state that automatically recalculates whenever the signals inside it change

import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
