import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Footer } from './footer';
import { provideRouter } from '@angular/router';
import { CatalogFilterService } from '../../../../core/services/catalog-filter/catalog-filter';
import { UserMessageService } from '../../../../core/services/user-message/user-message.service';

describe('Footer', () => {
  let component: Footer;
  let fixture: ComponentFixture<Footer>;
  let messages: UserMessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footer],
      providers: [provideRouter([{ path: 'vinilos', redirectTo: '/' }])]
    }).compileComponents();
    fixture = TestBed.createComponent(Footer);
    component = fixture.componentInstance;
    messages = TestBed.inject(UserMessageService);
    messages.clear();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('matches the three-column footer prototype and keeps focus visible on dark', () => {
    const root: HTMLElement = fixture.nativeElement;
    const footer = root.querySelector('footer')!;
    const headings = Array.from(footer.querySelectorAll('nav h2'), heading => heading.textContent?.trim());

    expect(footer.classList.contains('bg-black')).toBeTrue();
    expect(footer.querySelector('.max-w-\\[1200px\\]')).not.toBeNull();
    expect(headings).toEqual(['Tienda', 'Ayuda']);
    expect(footer.textContent).toContain('Vinilos y CDs de metal. Envío gratis desde $200.000 en Colombia.');
    expect(footer.textContent).toContain(`© ${new Date().getFullYear()} Metaluxe`);
    expect(footer.textContent).toContain('Pago contra entrega disponible');
    expect(footer.querySelector('a[href="mailto:hola@metaluxe.example"]')).not.toBeNull();
    expect(Array.from(footer.querySelectorAll('button, a')).every(link => link.classList.contains('focus-visible:outline-white'))).toBeTrue();
  });

  it('connects store links to real catalog filters', () => {
    const filters = TestBed.inject(CatalogFilterService);
    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    buttons.find(button => button.textContent?.trim() === 'Vinilos')!.click();
    expect(filters.getFilters().formats.values).toEqual(['Vinilo']);
    buttons.find(button => button.textContent?.trim() === 'CDs')!.click();
    expect(filters.getFilters().formats.values).toEqual(['CD']);
    buttons.find(button => button.textContent?.trim() === 'Novedades')!.click();
    expect(filters.getFilters().collection).toBe('new');
    buttons.find(button => button.textContent?.trim() === 'Ofertas')!.click();
    expect(filters.getFilters().collection).toBe('offers');
  });

  it('opens persistent information from help links', () => {
    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('button'));
    buttons.find(button => button.textContent?.trim() === 'Envíos y pagos')!.click();
    expect(messages.messages().at(-1)).toEqual(jasmine.objectContaining({
      type: 'info', title: 'Envíos y pagos', duration: null
    }));
    expect(messages.messages().at(-1)?.text).toContain('Envío gratis desde $200.000');
  });
});