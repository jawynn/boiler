import AOS from 'aos';
import 'aos/dist/aos.css';

// Initialize AOS with custom settings
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({
    duration: 1000,
    once: true,
    offset: 100,
    easing: 'ease-out-cubic'
  });

  // Form submission handler
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const button = e.target.querySelector('button');
      const originalText = button.textContent;
      
      button.textContent = 'Отправляем...';
      button.disabled = true;
      
      setTimeout(() => {
        alert('Спасибо за заявку! Мы свяжемся с вами в ближайшее время.');
        e.target.reset();
        button.textContent = originalText;
        button.disabled = false;
      }, 1500);
    });
  }

  // Анимация для преимуществ
  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, {
    threshold: 0.5
  });

  const advantageItems = document.querySelectorAll('.advantage-item');
  if (advantageItems.length) {
    advantageItems.forEach(item => {
      observer.observe(item);
    });
  }
});
