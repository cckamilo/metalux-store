import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleAlert, lucideCircleCheck, lucideInfo, lucideTriangleAlert, lucideX } from '@ng-icons/lucide';
import { UserMessageService, UserMessageType } from '../../../core/services/user-message/user-message.service';

@Component({
  standalone: true,
  selector: 'app-user-message-center',
  imports: [NgIcon],
  providers: [provideIcons({ lucideCircleAlert, lucideCircleCheck, lucideInfo, lucideTriangleAlert, lucideX })],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './user-message-center.html'
})
export class UserMessageCenter {
  readonly service = inject(UserMessageService);

  iconFor(type: UserMessageType): string {
    switch (type) {
      case 'success': return 'lucideCircleCheck';
      case 'error': return 'lucideCircleAlert';
      case 'warning': return 'lucideTriangleAlert';
      case 'info': return 'lucideInfo';
    }
  }
}
