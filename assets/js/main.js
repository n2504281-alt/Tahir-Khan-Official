document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // PRELOADER & INITIAL ANIMATION
  // ==========================================================================
  const preloader = document.querySelector('.preloader');
  
  window.addEventListener('load', () => {
    if (preloader) {
      setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        
        // Trigger initial hero text animations after loader ends
        if (typeof gsap !== 'undefined') {
          gsap.from('.hero-badge', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out', delay: 0.2 });
          gsap.from('.hero-title-main', { opacity: 0, y: 40, duration: 1, ease: 'power3.out', delay: 0.4 });
          gsap.from('.hero-subtitle', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out', delay: 0.6 });
          gsap.from('.hero-description', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out', delay: 0.8 });
          gsap.from('.hero-image', { scale: 1.15, opacity: 0, duration: 1.5, ease: 'power3.out', delay: 0.4 });
        }
      }, 1000);
    }
  });

  // Backup in case load event does not fire
  setTimeout(() => {
    if (preloader && preloader.style.opacity !== '0') {
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
    }
  }, 3000);

  // Custom cursor logic removed

  // ==========================================================================
  // LIGHT / DARK THEME TOGGLE
  // ==========================================================================
  const themeToggleBtn = document.querySelector('.theme-toggle-btn');
  const savedTheme = localStorage.getItem('theme') || 'dark';

  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
      localStorage.setItem('theme', currentTheme);
      // Theme changed
    });
  }

  // ==========================================================================
  // STICKY HEADER & SCROLL PROGRESS
  // ==========================================================================
  const header = document.querySelector('header');
  const scrollProgressBar = document.querySelector('.scroll-progress');

  window.addEventListener('scroll', () => {
    // Sticky header blur transition
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll progress indicator
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (totalScroll > 0) {
      const scrollPercent = (window.scrollY / totalScroll) * 100;
      if (scrollProgressBar) {
        scrollProgressBar.style.width = scrollPercent + '%';
      }
    }
  });

  // ==========================================================================
  // MOBILE MENU TOGGLE
  // ==========================================================================
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('nav');
  const navLinksList = document.querySelectorAll('.nav-links a');

  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isOpen = navMenu.classList.contains('active');
      mobileMenuToggle.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    // Close mobile menu when clicking nav links
    navLinksList.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }

  // ==========================================================================
  // LENIS SMOOTH SCROLLING
  // ==========================================================================
  let lenisInstance = null;
  if (typeof Lenis !== 'undefined') {
    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    // Synchronize Lenis scrolling with GSAP ScrollTrigger updates
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenisInstance.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenisInstance.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenisInstance.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }

  // Smooth scroll click handler for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        if (lenisInstance) {
          lenisInstance.scrollTo(targetElement, {
            offset: -80,
            duration: 1.5,
          });
        } else {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // ==========================================================================
  // GSAP SCROLLTRIGGER REVEALS & PARALLAX
  // ==========================================================================
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Parallax background movements
    gsap.to('.bg-shape-1', {
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1
      },
      y: 300,
      x: -100
    });

    gsap.to('.bg-shape-2', {
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5
      },
      y: -250,
      x: 150
    });

    // Section Titles Reveal
    gsap.utils.toArray('.section-title').forEach(title => {
      gsap.from(title, {
        scrollTrigger: {
          trigger: title,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out'
      });
    });

    // Fade up animations for cards/grids
    gsap.utils.toArray('.fade-up-element').forEach(element => {
      gsap.from(element, {
        scrollTrigger: {
          trigger: element,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out'
      });
    });

    // Stagger fade animations
    const triggerStaggers = [
      { parent: '.network-grid-container', target: '.country-column-card' }
    ];

    triggerStaggers.forEach(stagger => {
      const parentEl = document.querySelector(stagger.parent);
      if (parentEl) {
        gsap.from(stagger.target, {
          scrollTrigger: {
            trigger: parentEl,
            start: 'top 80%',
            toggleActions: 'play none none none',
            markers: true
          },
          opacity: 0,
          y: 40,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power3.out'
        });
      }
    });

    // About Portrait Parallax Reveal
    const aboutVisual = document.querySelector('.about-visual');
    if (aboutVisual) {
      gsap.from('.about-portrait', {
        scrollTrigger: {
          trigger: aboutVisual,
          start: 'top 80%',
          end: 'bottom top',
          scrub: true
        },
        scale: 1.1,
        y: 30
      });
    }

    // ScrollSpy: Update active nav indicators based on scroll
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      const sectionId = section.getAttribute('id');
      const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
      
      if (navLink) {
        ScrollTrigger.create({
          trigger: section,
          start: 'top 40%',
          end: 'bottom 40%',
          onEnter: () => activateNavLink(navLink),
          onEnterBack: () => activateNavLink(navLink)
        });
      }
    });

    function activateNavLink(activeLink) {
      navLinksList.forEach(link => link.classList.remove('active'));
      activeLink.classList.add('active');
    }
  } else {
    // Simple scroll spy fallback
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
      let currentSection = 'home';
      sections.forEach(section => {
        const top = section.offsetTop - 120;
        if (window.scrollY >= top) {
          currentSection = section.getAttribute('id');
        }
      });
      navLinksList.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
          link.classList.add('active');
        }
      });
    });
  }

  // ==========================================================================
  // TIMELINE MILESTONE HIGHLIGHT
  // ==========================================================================
  const timelineNodes = document.querySelectorAll('.timeline-node');
  timelineNodes.forEach(node => {
    node.addEventListener('mouseenter', () => {
      timelineNodes.forEach(n => n.classList.remove('active'));
      node.classList.add('active');
    });
  });

  // Obsolete selectors, gallery lightbox, and country selectors removed.

  // ==========================================================================
  // CONTACT FORM VALIDATION & FEEDBACK
  // ==========================================================================
  const contactForm = document.getElementById('portfolioContactForm');
  const successToast = document.querySelector('.form-success-toast');

  if (contactForm && successToast) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('contactName').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const subject = document.getElementById('contactSubject').value.trim();
      const message = document.getElementById('contactMessage').value.trim();

      if (name && email && subject && message) {
        // Mock successful submission
        successToast.style.display = 'block';
        successToast.innerHTML = '<i class="fas fa-check-circle"></i> Message sent successfully! Thank you for connecting with Tahir Khan.';
        contactForm.reset();

        // Fade out success toast after 5 seconds
        setTimeout(() => {
          if (typeof gsap !== 'undefined') {
            gsap.to(successToast, {
              opacity: 0,
              duration: 0.5,
              onComplete: () => {
                successToast.style.display = 'none';
                successToast.style.opacity = '1';
              }
            });
          } else {
            successToast.style.display = 'none';
          }
        }, 5000);
      }
    });
  }
});
