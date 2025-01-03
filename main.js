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
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const button = e.target.querySelector('button');
      const originalText = button.textContent;
      
      button.textContent = 'Отправляем...';
      button.disabled = true;

      const formData = {
        name: form.querySelector('input[placeholder="Ваше имя"]').value,
        phone: form.querySelector('input[placeholder="Ваш телефон"]').value,
        message: form.querySelector('textarea').value
      };
      
      try {
        console.log('Sending form data:', formData);
        
        const response = await fetch('/api/send-telegram', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });

        const data = await response.json();
        console.log('Server response:', data);

        if (data.success) {
          alert('Спасибо за заявку! Мы свяжемся с вами в ближайшее время.');
          form.reset();
        } else {
          throw new Error(data.error || 'Failed to send message');
        }
      } catch (error) {
        console.error('Detailed error:', error);
        alert(`Произошла ошибка при отправке заявки: ${error.message}`);
      } finally {
        button.textContent = originalText;
        button.disabled = false;
      }
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
