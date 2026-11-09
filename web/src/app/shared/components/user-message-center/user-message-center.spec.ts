import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserMessageService } from '../../../core/services/user-message/user-message.service';
import { UserMessageCenter } from './user-message-center';

describe('UserMessageCenter', () => {
  let fixture: ComponentFixture<UserMessageCenter>;
  let service: UserMessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [UserMessageCenter] }).compileComponents();
    fixture = TestBed.createComponent(UserMessageCenter);
    service = TestBed.inject(UserMessageService);
    service.clear();
    fixture.detectChanges();
  });

  afterEach(() => service.clear());

  it('announces errors assertively and information politely', () => {
    service.error('No se pudo guardar');
    service.info('Cambios disponibles', { duration: null });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="alert"]')?.textContent).toContain('No se pudo guardar');
    expect(fixture.nativeElement.querySelector('[role="status"]')?.textContent).toContain('Cambios disponibles');
  });

  it('lets the user dismiss a persistent message', () => {
    service.error('No se pudo guardar');
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('[aria-label="Cerrar mensaje: Error"]') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeNull();
  });
});
