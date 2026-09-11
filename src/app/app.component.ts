import { CommonModule, DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  OnInit,
  Inject,
  Renderer2,
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
export class AppComponent implements OnInit, AfterViewInit {
  activeSection: string = '';
  language: 'es' | 'en' = 'es';
  contactForm!: FormGroup;
  isSending = false;
  sendSuccess: boolean | null = null;
  isScrolled = false;
  isMobileMenuOpen = false;

  title = 'Portfolio';

  isDarkMode = false;
  prefersReducedMotion = false;

  // Which annotated term (if any) in the About section has its definition
  // expanded. Click/tap/Enter toggles it -- works identically on touch and
  // desktop, unlike a hover-only tooltip that mobile visitors can't reach.
  openTerm: string | null = null;

  toggleTerm(id: string, event: Event) {
    event.stopPropagation();
    this.openTerm = this.openTerm === id ? null : id;
  }

  @HostListener('document:click')
  closeOpenTerm() {
    this.openTerm = null;
  }

  @HostListener('document:keydown.escape')
  closeOpenTermOnEscape() {
    this.openTerm = null;
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
      name: 'Landing Page - Servicio Técnico',
      descEs:
        'Una landing elegante y moderna, construida con Angular, Tailwind CSS y animaciones suaves para una presencia online profesional.',
      descEn:
        'A sleek and modern landing page built with Angular, Tailwind CSS, and subtle animations for a strong online presence.',
      stack: ['Angular 19', 'SCSS', 'Tailwind CSS'],
      githubUrl: 'https://github.com/FranciscoLarrosa96/landingPageIvan',
      liveUrl: 'https://franciscolarrosa96.github.io/landingPageIvan/',
    },
    {
      name: 'Clínica de Ojos',
      descEs:
        'Sitio institucional para una clínica oftalmológica, con navegación fluida, diseño adaptable y secciones bien estructuradas.',
      descEn:
        'Institutional website for an eye clinic, with smooth navigation, responsive design, and well-structured content.',
      stack: ['HTML', 'CSS', 'JavaScript'],
      githubUrl: 'https://github.com/FranciscoLarrosa96/ClinicaDeOjos',
      liveUrl: 'https://franciscolarrosa96.github.io/ClinicaDeOjos/#home',
    },
    {
      name: 'BioMind',
      descEs:
        'Aplicación web inteligente que democratiza el acceso a la información médica. Utiliza IA de Google Gemini para convertir PDFs de análisis de laboratorio en explicaciones claras y comprensibles para cualquier persona.',
      descEn:
        'Intelligent web app that democratizes access to medical information. Uses Google Gemini AI to transform laboratory analysis PDFs into clear and understandable explanations for everyone.',
      stack: ['Angular 19', 'TypeScript', 'Google Gemini AI'],
      githubUrl: 'https://github.com/FranciscoLarrosa96/BioMind',
      liveUrl: 'https://franciscolarrosa96.github.io/BioMind/',
    },
    {
      name: 'Landing Page - 7Ideas',
      descEs:
        'Landing institucional moderna y dinámica para la empresa 7Ideas. Implementa Angular 20, Tailwind CSS y formulario funcional con EmailJS.',
      descEn:
        'Modern and dynamic landing page for 7Ideas company. Built with Angular 20, Tailwind CSS, and a working contact form using EmailJS.',
      stack: ['Angular 20', 'Tailwind CSS', 'EmailJS'],
      githubUrl: 'https://www.sieteideas.com.ar/',
      liveUrl: 'https://www.sieteideas.com.ar/',
    },
  ];

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

  ngOnInit() {
    this.prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    this.configDarkMode();
    this.updateDarkModeClass();

    const savedLang = localStorage.getItem('lang') as 'es' | 'en';
    if (savedLang) this.language = savedLang;

    // Inicializar SEO
    this.updateMetaTags();
    this.addStructuredData();
  }

  ngAfterViewInit(): void {
    this.scrollObserver();
    this.setupScrollListener();
    this.setupScrollReveal();
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
  }

  setupScrollReveal() {
    const items = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal]'),
    );

    if (this.prefersReducedMotion) {
      items.forEach((el) => el.classList.add('is-in'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' },
    );

    items.forEach((el) => observer.observe(el));
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
