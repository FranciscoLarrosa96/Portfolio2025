import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { NgParticlesModule } from 'ng-particles';
import type { Container, ISourceOptions, Engine } from 'tsparticles-engine';
import { loadSlim } from "tsparticles-slim";
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
      color: { value: getComputedStyle(document.documentElement).getPropertyValue('--background-color').trim() }
    },
    fpsLimit: 60,
    particles: {
      color: {
        value: getComputedStyle(document.documentElement).getPropertyValue('--main-color').trim()
      },
      links: {
        color: "#000000",
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
    [...'Bienvenido a mi portfolio!'].map(char => ({ char, class: 'text-main' }))
  ];

  typedChars: TypedChar[] = [];
  textIndex = 0;
  charIndex = 0;
  isDeleting = false;



  title = 'Portfolio';

  isDarkMode = false;
  private container?: Container;

  private async _particlesInit(engine: Engine): Promise<void> {
    console.log("tsparticles engine loaded", engine);
    await loadSlim(engine);
  }

  ngOnInit() {
    this.configDarkMode();
    this.updateDarkModeClass();
    this.particlesOptions = this.getParticlesOptions();
    this.typeLoop();
  }

  ngAfterViewInit(): void {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }

  configDarkMode() {
    // Detecta si el sistema está en modo oscuro
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Si el usuario ya eligió un modo antes, respetalo
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
    } else {
      this.isDarkMode = prefersDark;
    }
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

    this.particlesOptions = this.getParticlesOptions();

    // Esto le dice al componente ng-particles que recargue las opciones
    // 👉 Método seguro para aplicar nuevas opciones con tsparticles-slim
    setTimeout(() => {
      this.container?.destroy();
      this.container = undefined; // limpiamos antes de volver a crear

      const el = document.getElementById('tsparticles') as HTMLElement;
      if (el) {
        window.tsParticles.load('tsparticles', this.particlesOptions).then(container => {
          this.container = container;
        });
      }
    }, 0);
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

  getParticlesOptions(): ISourceOptions {
    const rootStyles = getComputedStyle(document.documentElement);
    const isDark = this.isDarkMode;

    return {
      background: {
        color: { value: isDark ? "#000000" : "#ffffff" }
      },
      fpsLimit: 60,
      particles: {
        color: {
          value: rootStyles.getPropertyValue('--main-color').trim()
        },
        links: {
          color: isDark ? "#ffffff" : "#000000",
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
          value: 70,
          density: { enable: true, area: 800 },
        },
        opacity: { value: 0.7 },
        shape: { type: "circle" },
        size: { value: { min: 2, max: 7 } },
      },
      detectRetina: true,
    };
  }


  onParticlesLoaded(container: Container): void {
    this.container = container;
  }

}
