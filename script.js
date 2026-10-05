const $ = (s, p = document) => p.querySelector(s);

const nav = $('.nav'), toggle = $('.menu-toggle');
toggle.addEventListener('click', () => { const open = nav.classList.toggle('open'); toggle.classList.toggle('open', open); toggle.setAttribute('aria-expanded', open); });
document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); toggle.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }));

const sections = [...document.querySelectorAll('main section[id]')], links = [...document.querySelectorAll('.nav a')];

const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); }), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const spy = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id)); }), { rootMargin: '-35% 0px -55% 0px' }); sections.forEach(s => spy.observe(s));
document.querySelectorAll('.project-plus').forEach(button => button.addEventListener('click', () => button.closest('.project').classList.toggle('expanded')));

const topButton = $('.to-top'); window.addEventListener('scroll', () => topButton.classList.toggle('show', scrollY > 500), { passive:true }); topButton.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
const contactForm = $('.contact-form');

if (contactForm) {
  const status = $('.form-status', contactForm);
  const submitButton = $('button[type="submit"]', contactForm);
  const endpoint = contactForm.action;
  const startedAt = Date.now();
  const minimumFillTime = 3000;
  const cooldownMs = 30000;
  const rateWindowMs = 15 * 60 * 1000;
  const maxSubmissionsPerWindow = 3;
  const rateKey = 'portfolio-contact-submissions';
  let submitting = false;

  const setStatus = (message, isError = false) => {
    status.textContent = message;
    status.classList.toggle('error', isError);
  };

  const setButtonState = (disabled, label = 'Send message') => {
    submitButton.disabled = disabled;
    $('span', submitButton).textContent = label;
  };

  const recentSubmissions = () => {
    try {
      const submissions = JSON.parse(localStorage.getItem(rateKey) || '[]');
      const cutoff = Date.now() - rateWindowMs;
      const recent = submissions.filter(time => Number.isFinite(time) && time > cutoff);
      localStorage.setItem(rateKey, JSON.stringify(recent));
      return recent;
    } catch {
      return [];
    }
  };

  const recordSubmission = () => {
    try {
      localStorage.setItem(rateKey, JSON.stringify([...recentSubmissions(), Date.now()]));
    } catch {
      // Storage may be unavailable; Formspree still applies service-side protections.
    }
  };

  contactForm.addEventListener('submit', async event => {
    event.preventDefault();
    if (submitting) return;

    ['name', 'email', 'subject', 'message'].forEach(name => {
      const field = contactForm.elements[name];
      field.value = field.value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim();
    });

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      setStatus('Please complete all fields with a valid email address.', true);
      return;
    }

    if (endpoint.includes('REPLACE_WITH_YOUR_FORM_ID')) {
      setStatus('The contact form is not configured yet. Please try the email link instead.', true);
      return;
    }

    const honeypot = $('[name="_gotcha"]', contactForm);
    if (honeypot.value.trim()) {
      setStatus('Thanks — your message has been received.');
      return;
    }

    if (Date.now() - startedAt < minimumFillTime) {
      setStatus('Please take a moment to review your message before sending.', true);
      return;
    }

    if (recentSubmissions().length >= maxSubmissionsPerWindow) {
      setStatus('Too many messages were sent from this browser. Please try again later.', true);
      return;
    }

    submitting = true;
    setButtonState(true, 'Sending…');
    setStatus('Sending your message…');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) {
        let detail = '';
        try {
          const result = await response.json();
          const firstError = Array.isArray(result.errors) ? result.errors[0] : null;
          detail = firstError?.message || firstError?.code || result.error || result.message || '';
        } catch { /* Use the safe fallback below. */ }

        if (response.status === 403) {
          throw new Error(detail || 'Formspree refused this submission. Check that the form is active and its domain/CAPTCHA settings allow this site.');
        }

        throw new Error(detail || 'Unable to submit the form.');
      }

      recordSubmission();
      contactForm.reset();
      setStatus('Thanks — your message has been sent. I’ll get back to you soon.');
      setButtonState(true, 'Sent');
      window.setTimeout(() => {
        setButtonState(false);
        setStatus('');
      }, cooldownMs);
    } catch (error) {
      setStatus(error.message || 'Something went wrong. Please try again or use the email link.', true);
      setButtonState(false);
    } finally {
      submitting = false;
    }
  });
}
$('#year').textContent = new Date().getFullYear();
