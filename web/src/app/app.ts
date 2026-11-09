import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserMessageCenter } from './shared/components/user-message-center/user-message-center';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UserMessageCenter],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
