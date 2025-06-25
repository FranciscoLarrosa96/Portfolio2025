import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as AOS from 'aos';
import { NgParticlesModule } from 'ng-particles';
import type { ISourceOptions } from 'tsparticles-engine';
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";
interface TypedChar {
  char: string;
  class: string;
}
@Component({
  selector: 'app-root',
  imports: [CommonModule, NgParticlesModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit {
  particlesOptions: ISourceOptions = {
    background: {
      color: { value: "transparent" },
    },
    fpsLimit: 60,
    particles: {
      color: { value: "#00ffcc" }, // verde agua
      links: {
        color: "#00ffcc",
        distance: 150,
        enable: true,
        opacity: 0.5,
        width: 1,
      },
      collisions: { enable: true },
      move: {
        direction: "none",
        enable: true,
        outModes: { default: "bounce" },
        speed: 2,
      },
      number: {
        value: 60,
        density: { enable: true, area: 800 },
      },
      opacity: { value: 0.7 },
      shape: { type: "circle" },
      size: { value: { min: 2, max: 6 } },
    },
    detectRetina: true,
  };

  particlesInit = this._particlesInit.bind(this);

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


  private async _particlesInit(engine: Engine): Promise<void> {
    console.log("tsparticles engine loaded", engine);
    await loadSlim(engine);
  }

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
