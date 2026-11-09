import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-main-layout',
  imports: [Header, Footer, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './main-layout.html'
})
export class MainLayout {}