import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { UserMessageService } from './user-message.service';

describe('UserMessageService', () => {
  let service: UserMessageService;

  beforeEach(() => {
    service = TestBed.inject(UserMessageService);
    service.clear();
  });

  afterEach(() => service.clear());

  it('uses transient defaults for confirmations and persistent errors', () => {
    service.success('Guardado');
    service.error('No se pudo guardar');

    expect(service.messages()).toEqual([
      jasmine.objectContaining({ type: 'success', title: 'Confirmación', duration: 4000 }),
      jasmine.objectContaining({ type: 'error', title: 'Error', duration: null })
    ]);
  });

  it('allows custom titles, durations, and persistent information messages', () => {
    service.warning('Revisa los datos', { title: 'Aviso', duration: 12000, dismissible: false });
    service.info('Importante', { duration: null });

    expect(service.messages()).toEqual([
      jasmine.objectContaining({ title: 'Aviso', duration: 12000, dismissible: false }),
      jasmine.objectContaining({ type: 'info', duration: null })
    ]);
  });

  it('automatically removes transient messages and keeps persistent ones', fakeAsync(() => {
    service.success('Guardado');
    service.error('Error persistente');

    tick(3999);
    expect(service.messages().length).toBe(2);
    tick(1);
    expect(service.messages().map(message => message.type)).toEqual(['error']);
  }));

  it('dismisses messages manually and clears their timers', fakeAsync(() => {
    const id = service.info('Temporal', { duration: 5000 });
    service.dismiss(id);
    tick(5000);

    expect(service.messages()).toEqual([]);
  }));
});
