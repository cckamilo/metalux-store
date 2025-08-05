import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { RouterOutlet } from '@angular/router';




@Component({
  standalone: true,
  selector: 'app-main-layout',
  imports: [CommonModule, Header, Footer, RouterOutlet ],
  templateUrl: './main-layout.html'
})
export class MainLayout {

}
