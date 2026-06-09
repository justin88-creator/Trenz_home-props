// About page interactions: reveal on scroll and team-card tilt
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
},{threshold:0.12});

document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// small interactive tilt for team cards
document.querySelectorAll('.team-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${ -y*6 }deg) rotateY(${ x*8 }deg)`;
  });
  card.addEventListener('mouseleave',()=>{
    card.style.transform='translateY(0)';
  });
});

const menuToggle = document.querySelector('.menu-toggle');
const navGroup = document.querySelector('.nav-group');
const navLinks = document.querySelectorAll('.nav-links a');

if (menuToggle && navGroup) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navGroup.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navGroup.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.navbar') && navGroup.classList.contains('open')) {
      navGroup.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

export {};
