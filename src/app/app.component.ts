import { CommonModule, DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  OnInit,
  Inject,
  Renderer2,
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import * as AOS from 'aos';
import { NgParticlesModule } from 'ng-particles';
import type { Container, ISourceOptions, Engine } from 'tsparticles-engine';
import { loadSlim } from 'tsparticles-slim';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import emailjs from '@emailjs/browser';

interface TypedChar {
  char: string;
  class: string;
}
@Component({
  selector: 'app-root',
  imports: [CommonModule, NgParticlesModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, AfterViewInit {
  activeSection: string = '';
  language: 'es' | 'en' = 'es';
  contactForm!: FormGroup;
  isSending = false;
  sendSuccess: boolean | null = null;
  isScrolled = false;
  isMobileMenuOpen = false;
  particlesOptions: ISourceOptions = {
    background: {
      color: {
        value: getComputedStyle(document.documentElement)
          .getPropertyValue('--background-color')
          .trim(),
      },
    },
    fpsLimit: 60,
    particles: {
      color: {
        value: getComputedStyle(document.documentElement)
          .getPropertyValue('--main-color')
          .trim(),
      },
      links: {
        color: '#000000',
        distance: 150,
        enable: true,
        opacity: 0.5,
        width: 1,
      },
      collisions: { enable: true },
      move: {
        direction: 'none',
        enable: true,
        outModes: { default: 'bounce' },
        speed: 2,
      },
      number: {
        value: 60,
        density: { enable: true, area: 800 },
      },
      opacity: { value: 0.7 },
      shape: { type: 'circle' },
      size: { value: { min: 2, max: 6 } },
    },
    detectRetina: true,
  };

  particlesInit = this._particlesInit.bind(this);

  texts: TypedChar[][] = [
    [...'¡Hola! Soy Frontend Dev'].map((char) => ({
      char,
      class: 'text-main',
    })),
    [...'Hi! I am a Frontend Dev'].map((char) => ({
      char,
      class: 'text-main',
    })),
    [...'Bienvenido a mi portfolio!'].map((char) => ({
      char,
      class: 'text-main',
    })),
    [...'Welcome to my portfolio!'].map((char) => ({
      char,
      class: 'text-main',
    })),
  ];

  typedChars: TypedChar[] = [];
  textIndex = 0;
  charIndex = 0;
  isDeleting = false;

  title = 'Portfolio';

  isDarkMode = false;
  private container?: Container;

  constructor(
    private fb: FormBuilder,
    private meta: Meta,
    private titleService: Title,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
    });
  }

  private async _particlesInit(engine: Engine): Promise<void> {
    await loadSlim(engine);
  }

  ngOnInit() {
    this.configDarkMode();
    this.updateDarkModeClass();
    this.particlesOptions = this.getParticlesOptions();
    this.typeLoop();
    const savedLang = localStorage.getItem('lang') as 'es' | 'en';
    if (savedLang) this.language = savedLang;

    // Inicializar SEO
    this.updateMetaTags();
    this.addStructuredData();
  }

  ngAfterViewInit(): void {
    AOS.init({
      duration: 1000,
      once: false,
    });
    this.scrollObserver();
    this.setupScrollListener();
  }

  setupScrollListener() {
    window.addEventListener('scroll', () => {
      this.isScrolled = window.scrollY > 50;
    });
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  scrollObserver() {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.6,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.activeSection = entry.target.id;
        }
      });
    }, options);

    ['home', 'about', 'projects', 'contact'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }

  configDarkMode() {
    // Detecta si el sistema está en modo oscuro
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;

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
        window.tsParticles
          .load('tsparticles', this.particlesOptions)
          .then((container) => {
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
        color: { value: isDark ? '#000000' : '#ffffff' },
      },
      fpsLimit: 60,
      particles: {
        color: {
          value: rootStyles.getPropertyValue('--main-color').trim(),
        },
        links: {
          color: isDark ? '#ffffff' : '#000000',
          distance: 150,
          enable: true,
          opacity: 0.5,
          width: 1,
        },
        collisions: { enable: true },
        move: {
          direction: 'none',
          enable: true,
          outModes: { default: 'bounce' },
          speed: 2,
        },
        number: {
          value: 70,
          density: { enable: true, area: 800 },
        },
        opacity: { value: 0.7 },
        shape: { type: 'circle' },
        size: { value: { min: 2, max: 7 } },
      },
      detectRetina: true,
    };
  }

  toggleLanguage() {
    this.language = this.language === 'es' ? 'en' : 'es';
    localStorage.setItem('lang', this.language);
    this.updateMetaTags(); // Actualizar meta tags al cambiar idioma
  }

  updateMetaTags() {
    const lang = this.language;

    // Actualizar atributo lang del HTML
    this.document.documentElement.setAttribute('lang', lang);

    // Textos según idioma
    const content = {
      es: {
        title: 'Francisco Larrosa - Frontend Developer | Portfolio',
        description:
          'Desarrollador frontend especializado en Angular y Tailwind CSS. Más de 3 años de experiencia construyendo interfaces modernas, accesibles y de alto rendimiento. Portfolio profesional con proyectos destacados.',
        ogTitle: 'Francisco Larrosa - Frontend Developer | Portfolio',
        twitterTitle: 'Francisco Larrosa - Frontend Developer | Portfolio',
      },
      en: {
        title: 'Francisco Larrosa - Frontend Developer | Portfolio',
        description:
          'Frontend developer specialized in Angular and Tailwind CSS. Over 3 years of experience building modern, accessible, and high-performance interfaces. Professional portfolio with featured projects.',
        ogTitle: 'Francisco Larrosa - Frontend Developer | Portfolio',
        twitterTitle: 'Francisco Larrosa - Frontend Developer | Portfolio',
      },
    };

    const currentContent = content[lang];

    // Actualizar título
    this.titleService.setTitle(currentContent.title);

    // Actualizar meta description
    this.meta.updateTag({
      name: 'description',
      content: currentContent.description,
    });

    // Actualizar Open Graph
    this.meta.updateTag({
      property: 'og:title',
      content: currentContent.ogTitle,
    });
    this.meta.updateTag({
      property: 'og:description',
      content: currentContent.description,
    });
    this.meta.updateTag({
      property: 'og:locale',
      content: lang === 'es' ? 'es_ES' : 'en_US',
    });

    // Actualizar Twitter Cards
    this.meta.updateTag({
      name: 'twitter:title',
      content: currentContent.twitterTitle,
    });
    this.meta.updateTag({
      name: 'twitter:description',
      content: currentContent.description,
    });
  }

  addStructuredData() {
    const script = this.renderer.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Francisco Larrosa',
      jobTitle: 'Frontend Developer',
      url: 'https://franciscolarrosa.com',
      sameAs: [
        'https://github.com/FranciscoLarrosa96',
        'https://www.linkedin.com/in/francisco-larrosa',
      ],
      knowsAbout: [
        'Angular',
        'TypeScript',
        'Tailwind CSS',
        'HTML',
        'SCSS',
        'JavaScript',
        'Git',
        'GitHub',
        'Responsive Design',
        'UX/UI Design',
        'Docker',
        'Frontend Development',
        'Web Development',
      ],
      description:
        'Desarrollador frontend especializado en Angular y Tailwind CSS con más de 3 años de experiencia construyendo interfaces modernas, accesibles y de alto rendimiento.',
      alumniOf: {
        '@type': 'Organization',
        name: 'Frontend Developer',
      },
    });

    this.renderer.appendChild(this.document.head, script);
  }

  onParticlesLoaded(container: Container): void {
    this.container = container;
  }

  sendEmail() {
    if (this.contactForm.invalid) return;

    this.isSending = true;
    const serviceID = 'service_email_portfolio';
    const templateID = 'template_portfolio';
    const publicKey = 'jHuV3S8GpBcTctdLe';

    emailjs
      .send(serviceID, templateID, this.contactForm.value, publicKey)
      .then(() => {
        this.sendSuccess = true;
        this.contactForm.reset();
      })
      .catch(() => {
        this.sendSuccess = false;
      })
      .finally(() => {
        this.isSending = false;
      });
  }
}
