// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// Initial Load Animation
const tl = gsap.timeline();

tl.to('body', {
  opacity: 1,
  duration: 1.5,
  ease: 'power2.out'
})
  ;

// ── Cinematic Hero Title Reveal ──
const heroLines = gsap.utils.toArray('.hero-line');
if (heroLines.length === 3) {
  gsap.timeline({ repeat: -1, repeatDelay: 0.5, delay: 0.8 })

    // Line 1: slide in from RIGHT → hold → fade out left
    .fromTo(heroLines[0],
      { opacity: 0, x: 90 },
      { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out' }
    )
    .to(heroLines[0],
      { opacity: 0, x: -50, duration: 0.7, ease: 'power2.in' }, '+=0.8'
    )

    // Line 2: slide in from RIGHT → hold → fade out left
    .fromTo(heroLines[1],
      { opacity: 0, x: 90 },
      { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out' }
    )
    .to(heroLines[1],
      { opacity: 0, x: -50, duration: 0.7, ease: 'power2.in' }, '+=0.8'
    )

    // Line 3: slide in from LEFT → hold → fade out right (to clear for Line 1)
    .fromTo(heroLines[2],
      { opacity: 0, x: -90 },
      { opacity: 1, x: 0, duration: 1.1, ease: 'power3.out' }
    )
    .to(heroLines[2],
      { opacity: 0, x: 50, duration: 0.7, ease: 'power2.in' }, '+=0.8'
    );
}

tl.to('.hero-subtitle', {
  opacity: 1,
  y: 0,
  duration: 1,
  ease: 'power3.out'
})
  .to('.hero-cta', {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power3.out'
  });

// ── Hero Card 3D Tilt ──
const heroCardWrap = document.getElementById('heroCardWrap');
const heroCardTilt = document.getElementById('heroCardTilt');

if (heroCardWrap && heroCardTilt) {
  // Slide in card on load
  gsap.fromTo(heroCardTilt,
    { opacity: 0, x: 80, rotateY: -25 },
    { opacity: 1, x: 0, rotateY: 0, duration: 1.4, ease: 'power3.out', delay: 0.6 }
  );

  // 3D tilt on mouse move
  heroCardWrap.addEventListener('mousemove', (e) => {
    const rect = heroCardWrap.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rx = ((e.clientY - cy) / rect.height) * -22;
    const ry = ((e.clientX - cx) / rect.width) * 22;

    gsap.to(heroCardTilt, {
      rotateX: rx,
      rotateY: ry,
      duration: 0.4,
      ease: 'power2.out',
      overwrite: 'auto',
      transformPerspective: 1000,
    });
  });

  // Spring back on mouse leave
  heroCardWrap.addEventListener('mouseleave', () => {
    gsap.to(heroCardTilt, {
      rotateX: 0,
      rotateY: 0,
      duration: 1.2,
      ease: 'elastic.out(1, 0.4)',
      overwrite: 'auto',
    });
  });
}


const floatElements = document.querySelectorAll('.float-card, .feature-panel, .floating-mockup');

floatElements.forEach((el, index) => {
  gsap.to(el, {
    y: '-15px',
    duration: 2 + index * 0.5, // Randomize duration slightly
    yoyo: true,
    repeat: -1,
    ease: 'sine.inOut',
    delay: index * 0.2
  });
});

// Scroll Triggers for Sections
const sections = document.querySelectorAll('section:not(.hero)');

sections.forEach(section => {
  gsap.fromTo(section.querySelectorAll('h2, p, .stat-card'),
    {
      y: 50,
      opacity: 0
    },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'top 20%',
        toggleActions: 'play none none reverse'
      }
    }
  );
});

// ── Cinematic Laptop Animation ──
const laptopLid = document.getElementById('laptopLid');
const laptopScene = document.getElementById('laptopScene');
const laptop = document.getElementById('laptop');

// Open lid when performance section scrolls into view
if (laptopLid) {
  ScrollTrigger.create({
    trigger: '#performance',
    start: 'top 60%',
    onEnter: () => {
      setTimeout(() => laptopLid.classList.add('open'), 400);
    },
    onLeaveBack: () => laptopLid.classList.remove('open'),
  });
}

// Spawn ambient particles
const perfParticles = document.getElementById('perfParticles');
if (perfParticles) {
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'perf-particle';
    const size = Math.random() * 80 + 20;
    p.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${Math.random() * 100}%;
      top:  ${Math.random() * 100}%;
      --dur: ${Math.random() * 6 + 5}s;
      --tx:  ${(Math.random() - 0.5) * 80}px;
      --ty:  ${(Math.random() - 0.5) * 80}px;
      animation-delay: ${Math.random() * -8}s;
    `;
    perfParticles.appendChild(p);
  }
}

// Mouse tilt on laptop scene
if (laptopScene && laptop) {
  laptopScene.addEventListener('mousemove', (e) => {
    const rect = laptopScene.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rx = ((e.clientY - cy) / rect.height) * 12;
    const ry = ((e.clientX - cx) / rect.width) * -18;
    gsap.to(laptop, {
      rotateX: 10 + rx,
      rotateY: -20 + ry,
      duration: 1.2,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  });
  laptopScene.addEventListener('mouseleave', () => {
    gsap.to(laptop, {
      rotateX: 10,
      rotateY: -20,
      duration: 1.5,
      ease: 'elastic.out(1, 0.5)',
      overwrite: 'auto'
    });
  });
}


gsap.to('.bg-text', {
  yPercent: 50,
  ease: 'none',
  scrollTrigger: {
    trigger: '.architecture',
    start: 'top bottom',
    end: 'bottom top',
    scrub: true
  }
});

// Horizontal Scroll Section
const horizontalSection = document.querySelector('.horizontal-scroll');
const track = document.querySelector('.scroll-track');

if (horizontalSection && track) {
  // Calculate total scroll distance
  const getScrollAmount = () => -(track.scrollWidth - window.innerWidth);

  const tween = gsap.to(track, {
    x: getScrollAmount,
    ease: 'none',
    scrollTrigger: {
      trigger: horizontalSection,
      pin: true,
      scrub: 1,
      end: () => `+=${track.scrollWidth - window.innerWidth}`,
      invalidateOnRefresh: true
    }
  });
}

// Subtle Mouse Tilt for Hero Mockup (optional refinement)
const hero = document.querySelector('.hero');
const mockup = document.querySelector('.floating-mockup');

if (hero && mockup) {
  hero.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;

    gsap.to(mockup, {
      rotateY: x,
      rotateX: -y,
      duration: 1,
      ease: 'power2.out'
    });
  });
}
