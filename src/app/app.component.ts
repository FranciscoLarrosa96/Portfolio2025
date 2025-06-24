import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as AOS from 'aos';
interface TypedChar {
  char: string;
  class: string;
}
@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit {


  texts: TypedChar[][] = [
    [...'¡Hola! Soy Frontend Dev'].map(char => ({ char, class: 'text-main' })),
    [
      ...'Trabajo con '.split('').map(c => ({ char: c, class: '' })),
      ...'Angular'.split('').map(c => ({ char: c, class: 'text-red-600 font-semibold' })),
      { char: ' ', class: '' },
      ...'y '.split('').map(c => ({ char: c, class: '' })),
      ...'Tailwind'.split('').map(c => ({ char: c, class: 'text-sky-500 font-semibold' })),
    ],
    [...'Bienvenido a mi portfolio!'].map(char => ({ char, class: 'text-main' }))
  ];

  typedChars: TypedChar[] = [];
  textIndex = 0;
  charIndex = 0;
  isDeleting = false;



  title = 'Portfolio';

  isDarkMode = false;

  ngOnInit() {

    // Detecta si el sistema está en modo oscuro
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Si el usuario ya eligió un modo antes, respetalo
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
    } else {
      this.isDarkMode = prefersDark;
    }

    this.updateDarkModeClass();
    this.typeLoop();
  }

  ngAfterViewInit(): void {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    const htmlElement = document.documentElement;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    if (this.isDarkMode) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }

  updateDarkModeClass(): void {
    const html = document.documentElement;
    if (this.isDarkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }

  typeLoop(): void {
    const currentText = this.texts[this.textIndex];

    if (this.isDeleting) {
      this.typedChars.pop();
      this.charIndex--;
    } else {
      this.typedChars.push(currentText[this.charIndex]);
      this.charIndex++;
    }

    let delay = this.isDeleting ? 30 : 80;

    if (!this.isDeleting && this.charIndex === currentText.length) {
      delay = 1500;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.textIndex = (this.textIndex + 1) % this.texts.length;
    }

    setTimeout(() => this.typeLoop(), delay);
  }
}
