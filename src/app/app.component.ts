import { CommonModule, DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  OnInit,
  OnDestroy,
  Inject,
  Renderer2,
  NgZone,
  HostListener,
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import emailjs from '@emailjs/browser';

interface Project {
  name: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  tone: string;
  domain: string;
  categoryEs: string;
  categoryEn: string;
  descEs: string;
  descEn: string;
  stack: string[];
  githubUrl: string;
  liveUrl: string;
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  activeSection: string = 'home';
  readonly currentYear = new Date().getFullYear();
  private observers: IntersectionObserver[] = [];
  private motionCleanup: (() => void)[] = [];
  private sectionPositions = new Map<string, number>();
  language: 'es' | 'en' = 'es';
  contactForm!: FormGroup;
  isSending = false;
  sendSuccess: boolean | null = null;
  isScrolled = false;
  isMobileMenuOpen = false;

  title = 'Portfolio';

  isDarkMode = false;
  prefersReducedMotion = false;

  @HostListener('document:keydown.escape')
  closeMenuOnEscape() {
    if (this.isMobileMenuOpen) {
      this.closeMobileMenu();
      this.document.getElementById('menu-toggle')?.focus();
    }
  }

  @HostListener('window:resize')
  closeMenuOnDesktop() {
    if (window.innerWidth > 850) this.closeMobileMenu();
  }

  fieldInvalid(name: string): boolean {
    const field = this.contactForm.get(name);
    return !!field && field.invalid && field.touched;
  }

  private readPreference(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  private savePreference(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* Preferences still apply to this visit. */
    }
  }

  ngOnDestroy(): void {
    this.observers.forEach((observer) => observer.disconnect());
    this.motionCleanup.forEach((cleanup) => cleanup());
  }

  techStack: {
    name: string;
    logo: string;
    categoryEs: string;
    categoryEn: string;
  }[] = [
    {
      name: 'Angular',
      logo: 'assets/logos/angular.svg',
      categoryEs: 'Núcleo',
      categoryEn: 'Core',
    },
    {
      name: 'TypeScript',
      logo: 'assets/logos/typescript.svg',
      categoryEs: 'Núcleo',
      categoryEn: 'Core',
    },
    {
      name: 'Tailwind CSS',
      logo: 'assets/logos/Tailwind CSS.svg',
      categoryEs: 'Núcleo',
      categoryEn: 'Core',
    },
    {
      name: 'RxJS',
      logo: 'assets/logos/rxjs.svg',
      categoryEs: 'Herramientas',
      categoryEn: 'Tooling',
    },
    {
      name: 'GitHub',
      logo: 'assets/logos/github.svg',
      categoryEs: 'Herramientas',
      categoryEn: 'Tooling',
    },
    {
      name: 'Git',
      logo: 'assets/logos/git-bash.svg',
      categoryEs: 'Herramientas',
      categoryEn: 'Tooling',
    },
    {
      name: 'Node.js',
      logo: 'assets/logos/node.svg',
      categoryEs: 'Herramientas',
      categoryEn: 'Tooling',
    },
    {
      name: 'Docker',
      logo: 'assets/logos/docker.svg',
      categoryEs: 'Herramientas',
      categoryEn: 'Tooling',
    },
    {
      name: 'NestJS',
      logo: 'assets/logos/nest.svg',
      categoryEs: 'Herramientas',
      categoryEn: 'Tooling',
    },
  ];

  projects: Project[] = [
    {
      name: '7Ideas',
      image: 'assets/img/7ideas.png',
      imageWidth: 1891,
      imageHeight: 912,
      tone: 'plum',
      domain: 'sieteideas.com.ar',
      categoryEs: 'Sitio institucional',
      categoryEn: 'Business website',
      descEs:
        'Una presencia digital para una empresa de software: servicios claros, identidad propia y un formulario para conectar con nuevos clientes.',
      descEn:
        'A digital presence for a software company: clear services, a distinct identity, and a contact form to connect with new clients.',
      stack: ['Angular 20', 'Tailwind CSS', 'EmailJS'],
      githubUrl: '',
      liveUrl: 'https://www.sieteideas.com.ar/',
    },
    {
      name: 'Clínica de Ojos',
      image: 'assets/img/clinicadeojos.avif',
      imageWidth: 1902,
      imageHeight: 697,
      tone: 'teal',
      domain: 'Clínica de Ojos · Tandil',
      categoryEs: 'Salud · Web institucional',
      categoryEn: 'Healthcare website',
      descEs:
        'Información y servicios de una clínica oftalmológica, organizados en un sitio adaptable y fácil de recorrer.',
      descEn:
        'An eye clinic’s information and services, organized in a responsive website that’s easy to navigate.',
      stack: ['HTML', 'CSS', 'JavaScript'],
      githubUrl: 'https://github.com/FranciscoLarrosa96/ClinicaDeOjos',
      liveUrl: 'https://franciscolarrosa96.github.io/ClinicaDeOjos/#home',
    },
    {
      name: 'Reparaciones Iván',
      image: 'assets/img/landingpageivan.avif',
      imageWidth: 1882,
      imageHeight: 885,
      tone: 'blue',
      domain: 'Reparaciones Iván',
      categoryEs: 'Servicios · Landing page',
      categoryEn: 'Services · Landing page',
      descEs:
        'Una vidriera digital para un servicio técnico: qué ofrece, cómo trabaja y cómo contactarlo, en una experiencia directa.',
      descEn:
        'A digital storefront for a repair service: what it offers, how it works, and how to get in touch, in one straightforward experience.',
      stack: ['Angular 19', 'SCSS', 'Tailwind CSS'],
      githubUrl: 'https://github.com/FranciscoLarrosa96/landingPageIvan',
      liveUrl: 'https://franciscolarrosa96.github.io/landingPageIvan/',
    },
    {
      name: 'BioMind',
      image: 'assets/img/previa.avif',
      imageWidth: 1358,
      imageHeight: 889,
      tone: 'mint',
      domain: 'BioMind',
      categoryEs: 'Aplicación web · IA',
      categoryEn: 'Web application · AI',
      descEs:
        'Una aplicación que utiliza Google Gemini para presentar explicaciones de análisis de laboratorio a partir de archivos PDF.',
      descEn:
        'An application that uses Google Gemini to present explanations of laboratory reports from PDF files.',
      stack: ['Angular 19', 'TypeScript', 'Google Gemini'],
      githubUrl: 'https://github.com/FranciscoLarrosa96/BioMind',
      liveUrl: 'https://franciscolarrosa96.github.io/BioMind/',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private meta: Meta,
    private titleService: Title,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private zone: NgZone,
  ) {
    this.contactForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.pattern(/\S/),
          Validators.maxLength(100),
        ],
      ],
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(254)],
      ],
      message: [
        '',
        [
          Validators.required,
          Validators.pattern(/\S/),
          Validators.maxLength(5000),
        ],
      ],
    });
  }

  ngOnInit() {
    this.prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    this.configDarkMode();
    this.updateDarkModeClass();

    const savedLang = this.readPreference('lang');
    if (savedLang === 'es' || savedLang === 'en') this.language = savedLang;

    // Inicializar SEO
    this.updateMetaTags();
    this.addStructuredData();
  }

  ngAfterViewInit(): void {
    this.scrollObserver();
    this.setupScrollListener();
    this.zone.runOutsideAngular(() => {
      this.setupScrollReveal();
      this.setupHeroMotion();
    });
  }

  setupScrollListener() {
    // IntersectionObserver en lugar de un listener de scroll: evita disparar
    // change detection de Angular en cada pixel scrolleado.
    const sentinel = document.getElementById('scroll-sentinel');
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        this.isScrolled = !entry.isIntersecting;
      },
      { rootMargin: '-50px 0px 0px 0px', threshold: 0 },
    );
    observer.observe(sentinel);
    this.observers.push(observer);
  }

  setupScrollReveal() {
    const items = Array.from(
      this.document.querySelectorAll<HTMLElement>('[data-reveal]'),
    );
    if (this.prefersReducedMotion || !('IntersectionObserver' in window))
      return;
    // Content is visible by default. Only observed items below the viewport are
    // prepared for entry; deep links and keyboard navigation remain readable.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            element.classList.remove('reveal-pending');
            element.classList.add('is-in');
          } else if (entry.boundingClientRect.top >= window.innerHeight) {
            // Rearm below the viewport so later downward passes can replay.
            element.classList.remove('is-in');
            element.classList.add('reveal-pending');
          }
        });
      },
      { threshold: 0, rootMargin: '0px 0px -24px 0px' },
    );
    items.forEach((element) => {
      if (element.getBoundingClientRect().top >= window.innerHeight - 24) {
        element.classList.add('reveal-pending');
      }
      observer.observe(element);
    });
    this.observers.push(observer);
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const showAll = () => {
      if (!preference.matches) return;
      observer.disconnect();
      items.forEach((element) => element.classList.remove('reveal-pending'));
    };
    preference.addEventListener('change', showAll);
    this.motionCleanup.push(() =>
      preference.removeEventListener('change', showAll),
    );
  }

  setupHeroMotion() {
    const hero = this.document.getElementById('hero-visual');
    const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!hero || reduced.matches || !pointer.matches) return;
    let frame = 0;
    const move = (event: PointerEvent) => {
      if (reduced.matches || !pointer.matches) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const x = Math.max(
          -0.5,
          Math.min(0.5, (event.clientX - rect.left) / rect.width - 0.5),
        );
        const y = Math.max(
          -0.5,
          Math.min(0.5, (event.clientY - rect.top) / rect.height - 0.5),
        );
        hero.style.setProperty('--tilt-x', `${-y * 5}deg`);
        hero.style.setProperty('--tilt-y', `${x * 5}deg`);
      });
    };
    const reset = () => {
      cancelAnimationFrame(frame);
      hero.style.setProperty('--tilt-x', '0deg');
      hero.style.setProperty('--tilt-y', '0deg');
    };
    hero.addEventListener('pointermove', move, { passive: true });
    hero.addEventListener('pointerleave', reset);
    reduced.addEventListener('change', reset);
    pointer.addEventListener('change', reset);
    this.motionCleanup.push(() => {
      reset();
      hero.removeEventListener('pointermove', move);
      hero.removeEventListener('pointerleave', reset);
      reduced.removeEventListener('change', reset);
      pointer.removeEventListener('change', reset);
    });
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  scrollObserver() {
    // A narrow viewport band also works for sections taller than the screen.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            this.sectionPositions.set(
              entry.target.id,
              entry.boundingClientRect.top,
            );
          else this.sectionPositions.delete(entry.target.id);
        });
        const current = [...this.sectionPositions.entries()].sort(
          (a, b) => a[1] - b[1],
        );
        if (current.length) this.activeSection = current[current.length - 1][0];
      },
      { rootMargin: '-15% 0px -60% 0px', threshold: 0 },
    );
    ['home', 'projects', 'about', 'contact'].forEach((id) => {
      const el = this.document.getElementById(id);
      if (el) observer.observe(el);
    });
    this.observers.push(observer);
  }

  configDarkMode() {
    // Detecta si el sistema está en modo oscuro
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;

    // Si el usuario ya eligió un modo antes, respetalo
    const savedTheme = this.readPreference('theme');

    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
    } else {
      this.isDarkMode = prefersDark;
    }
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.savePreference('theme', this.isDarkMode ? 'dark' : 'light');

    this.updateDarkModeClass();
  }

  updateDarkModeClass(): void {
    const html = document.documentElement;
    if (this.isDarkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }

  toggleLanguage() {
    this.language = this.language === 'es' ? 'en' : 'es';
    this.savePreference('lang', this.language);
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
          'Desarrollador frontend especializado en Angular y Tailwind CSS. Más de 4 años de experiencia construyendo interfaces modernas, accesibles y de alto rendimiento. Portfolio profesional con proyectos destacados.',
        ogTitle: 'Francisco Larrosa - Frontend Developer | Portfolio',
        twitterTitle: 'Francisco Larrosa - Frontend Developer | Portfolio',
      },
      en: {
        title: 'Francisco Larrosa - Frontend Developer | Portfolio',
        description:
          'Frontend developer specialized in Angular and Tailwind CSS. Over 4 years of experience building modern, accessible, and high-performance interfaces. Professional portfolio with featured projects.',
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
    // Person Schema
    const personScript = this.renderer.createElement('script');
    personScript.type = 'application/ld+json';
    personScript.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Francisco Larrosa',
      jobTitle: 'Frontend Developer',
      url: 'https://franciscolarrosa.com.ar',
      sameAs: [
        'https://github.com/FranciscoLarrosa96',
        'https://www.linkedin.com/in/francisco-larrosa-784a3020b/',
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
        'Desarrollador frontend especializado en Angular y Tailwind CSS con más de 4 años de experiencia construyendo interfaces modernas, accesibles y de alto rendimiento.',
      alumniOf: {
        '@type': 'Organization',
        name: 'Frontend Developer',
      },
    });

    // WebSite Schema
    const websiteScript = this.renderer.createElement('script');
    websiteScript.type = 'application/ld+json';
    websiteScript.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Francisco Larrosa Portfolio',
      url: 'https://franciscolarrosa.com.ar',
      description:
        'Portfolio profesional de Francisco Larrosa, desarrollador frontend especializado en Angular y Tailwind CSS',
      author: {
        '@type': 'Person',
        name: 'Francisco Larrosa',
      },
      inLanguage: ['es', 'en'],
    });

    this.renderer.appendChild(this.document.head, personScript);
    this.renderer.appendChild(this.document.head, websiteScript);
  }

  sendEmail() {
    if (this.isSending) return;
    this.sendSuccess = null;
    this.contactForm.markAllAsTouched();
    if (this.contactForm.invalid) {
      const invalid = ['name', 'email', 'message'].find(
        (name) => this.contactForm.get(name)?.invalid,
      );
      if (invalid) this.document.getElementById(invalid)?.focus();
      return;
    }

    this.isSending = true;
    const serviceID = 'service_email_portfolio';
    const templateID = 'template_portfolio';
    const publicKey = 'jHuV3S8GpBcTctdLe';

    emailjs
      .send(
        serviceID,
        templateID,
        {
          name: this.contactForm.value.name.trim(),
          email: this.contactForm.value.email.trim(),
          message: this.contactForm.value.message.trim(),
        },
        publicKey,
      )
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
