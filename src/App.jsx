import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

const emailJsConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID?.trim() || '',
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID?.trim() || '',
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY?.trim() || ''
};

const EMAILJS_PLACEHOLDER_VALUES = new Set([
  'your_emailjs_service_id',
  'your_emailjs_template_id',
  'your_emailjs_public_key',
  'service_portfolio',
  'template_portfolio',
  'user_public_key'
]);

const hasEmailJsConfig = Object.values(emailJsConfig).every(
  value => value && !EMAILJS_PLACEHOLDER_VALUES.has(value)
);

const TYPING_TEXTS = [
  'Data Analyst',
  'Python Developer',
  'Dashboard Designer',
  'Full-Stack Developer',
  'Problem Solver'
];

function SkeletonLoader({ isExiting }) {
  return (
    <div
      className={`page-skeleton ${isExiting ? 'exiting' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Loading Vaishnavi Hiremath portfolio"
    >
      <nav className="skeleton-nav" aria-hidden="true">
        <div className="skeleton-block skeleton-logo"></div>
        <div className="skeleton-nav-links">
          <span className="skeleton-block skeleton-nav-about"></span>
          <span className="skeleton-block skeleton-nav-specialization"></span>
          <span className="skeleton-block skeleton-nav-projects"></span>
          <span className="skeleton-block skeleton-nav-experience"></span>
          <span className="skeleton-block skeleton-nav-education"></span>
          <span className="skeleton-block skeleton-nav-contact"></span>
        </div>
        <div className="skeleton-menu-icon">
          <span className="skeleton-block"></span>
          <span className="skeleton-block"></span>
          <span className="skeleton-block"></span>
        </div>
      </nav>

      <div className="skeleton-shell" aria-hidden="true">
        <section className="skeleton-hero-layout">
          <div className="skeleton-copy">
            <div className="skeleton-block skeleton-kicker"></div>
            <div className="skeleton-block skeleton-heading"></div>
            <div className="skeleton-block skeleton-job-line"></div>
            <div className="skeleton-paragraph">
              <div className="skeleton-block"></div>
              <div className="skeleton-block"></div>
              <div className="skeleton-block"></div>
            </div>
            <div className="skeleton-actions-row">
              <div className="skeleton-block skeleton-button"></div>
              <div className="skeleton-block skeleton-button skeleton-button-light"></div>
            </div>
            <div className="skeleton-social-row">
              <div className="skeleton-block skeleton-social-dot"></div>
              <div className="skeleton-block skeleton-social-dot"></div>
              <div className="skeleton-block skeleton-social-dot"></div>
            </div>
          </div>

          <div className="skeleton-visual">
            <div className="skeleton-block skeleton-figure"></div>
          </div>
        </section>
      </div>
    </div>
  );
}

function App() {
  // ---- Initial Loading State ----
  const [isLoading, setIsLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    // Show the skeleton screen briefly, then reveal the page
    const timer = setTimeout(() => {
      setIsExiting(true);
      // After exit animation completes, remove the loader
      setTimeout(() => {
        setIsLoading(false);
        setIsExiting(false);
      }, 280);
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  // ---- Typing Effect ----
  const [typedText, setTypedText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = TYPING_TEXTS[textIndex];
    let timer;

    if (!isDeleting && charIndex === currentText.length) {
      timer = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && charIndex === 0) {
      timer = setTimeout(() => {
        setIsDeleting(false);
        setTextIndex(prev => (prev + 1) % TYPING_TEXTS.length);
      }, 40);
    } else if (isDeleting) {
      timer = setTimeout(() => {
        setTypedText(currentText.substring(0, charIndex - 1));
        setCharIndex(prev => prev - 1);
      }, 40);
    } else {
      timer = setTimeout(() => {
        setTypedText(currentText.substring(0, charIndex + 1));
        setCharIndex(prev => prev + 1);
      }, 80);
    }

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, textIndex]);

  // ---- Navbar Scroll & Active Section States ----
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Toggle navbar shadow/padding
      setIsScrolled(window.scrollY > 50);

      // Track active section
      const sections = document.querySelectorAll('.section, .hero');
      let currentSectionId = 'hero';
      sections.forEach(section => {
        const top = section.offsetTop - 200;
        if (window.scrollY >= top) {
          currentSectionId = section.getAttribute('id');
        }
      });
      setActiveSection(currentSectionId);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ---- Scroll Entrance Animations ----
  useEffect(() => {
    const animatedElements = document.querySelectorAll('[data-animate]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    animatedElements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // ---- Smooth Scroll Helper ----
  const scrollToSection = (e, id) => {
    e.preventDefault();
    setIsNavOpen(false);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  useEffect(() => {
    document.body.classList.toggle('nav-menu-open', isNavOpen);

    return () => document.body.classList.remove('nav-menu-open');
  }, [isNavOpen]);
  // ---- Contact Form Handler with EmailJS ----
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    setSubmitMessage('');

    if (!hasEmailJsConfig) {
      setSubmitStatus('error');
      setSubmitMessage('Email service is not configured yet. Please email me directly at sagaralmad002@gmail.com.');
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    const fromName = String(formData.get('from_name') || '').trim();
    const fromEmail = String(formData.get('from_email') || '').trim();
    const subject = String(formData.get('subject') || '').trim();
    const message = String(formData.get('message') || '').trim();

    const messageSubject = subject || 'Portfolio contact form message';
    const emailMessage = [
      `Name: ${fromName}`,
      `Email: ${fromEmail}`,
      `Subject: ${messageSubject}`,
      '',
      'Message:',
      message
    ].join('\n');

    const templateParams = {
      from_name: fromName,
      from_email: fromEmail,
      reply_to: fromEmail,
      subject: messageSubject,
      message: emailMessage,
      original_message: message,
      to_name: 'Vaishnavi Hiremath',
      user_name: fromName,
      user_email: fromEmail,
      name: fromName,
      email: fromEmail,
      title: messageSubject,
      time: new Date().toLocaleString()
    };

    setIsSubmitting(true);

    try {
      await emailjs.send(emailJsConfig.serviceId, emailJsConfig.templateId, templateParams, {
        publicKey: emailJsConfig.publicKey
      });

      form.reset();
      setSubmitStatus('success');
      setSubmitMessage('Your message has been sent successfully!');
      setTimeout(() => {
        setSubmitStatus(null);
        setSubmitMessage('');
      }, 5000);
    } catch (error) {
      console.error('EmailJS error:', error);
      setSubmitStatus('error');
      setSubmitMessage('Failed to send message. Please try again or email me directly at sagaralmad002@gmail.com.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Skeleton Loader */}
      {isLoading && <SkeletonLoader isExiting={isExiting} />}

      {/* Main Content - fades in after skeleton */}
      <div className={`main-content ${!isLoading ? 'content-visible' : ''}`}>
      {/* Navbar */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${isNavOpen ? 'open' : ''}`} id="navbar">
        <a href="#hero" className="nav-logo" onClick={(e) => scrollToSection(e, 'hero')}>Vaishnavi</a>
        <div className={`nav-links ${isNavOpen ? 'open' : ''}`} id="navLinks">
          <a
            href="#about"
            className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
            onClick={(e) => scrollToSection(e, 'about')}
          >
            About
          </a>
          <a
            href="#skills"
            className={`nav-link ${activeSection === 'skills' ? 'active' : ''}`}
            onClick={(e) => scrollToSection(e, 'skills')}
          >
            Specialization
          </a>
          <a
            href="#portfolio"
            className={`nav-link ${activeSection === 'portfolio' ? 'active' : ''}`}
            onClick={(e) => scrollToSection(e, 'portfolio')}
          >
            My Projects
          </a>
          <a
            href="#experience"
            className={`nav-link ${activeSection === 'experience' ? 'active' : ''}`}
            onClick={(e) => scrollToSection(e, 'experience')}
          >
            Experience
          </a>
          <a
            href="#education"
            className={`nav-link ${activeSection === 'education' ? 'active' : ''}`}
            onClick={(e) => scrollToSection(e, 'education')}
          >
            Education
          </a>
          <a
            href="#contact"
            className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
            onClick={(e) => scrollToSection(e, 'contact')}
          >
            Contact Me
          </a>
        </div>
        <button
          className="nav-toggle"
          id="navToggle"
          aria-label="Toggle menu"
          aria-expanded={isNavOpen}
          aria-controls="navLinks"
          onClick={() => setIsNavOpen(!isNavOpen)}
        >
          <span></span><span></span><span></span>
        </button>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="hero">
        <div className="hero-content">
          <div className="hero-text">
            <p className="hero-greeting">Hello, I'm</p>
            <h1 className="hero-name">Vaishnavi Hiremath</h1>
            <h2 className="hero-role">
              <span className="typed-text">{typedText}</span>
              <span className="typed-cursor">|</span>
            </h2>
            <p className="hero-desc">
              Passionate about transforming raw data into actionable business insights and building scalable full-stack web applications. B.Tech graduate with a CGPA of 9.0.
            </p>
            <div className="hero-actions">
              <a href="#contact" className="btn btn-primary" onClick={(e) => scrollToSection(e, 'contact')}>Get In Touch</a>
              <a href="#portfolio" className="btn btn-outline" onClick={(e) => scrollToSection(e, 'portfolio')}>View Projects</a>
            </div>
            <div className="hero-socials">
              <a href="https://www.linkedin.com/in/vaishnavi-hiremath-a2b79931a/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x={2} y={9} width={4} height={12} /><circle cx={4} cy={4} r={2} /></svg>
              </a>
              <a href="https://github.com/VaishnaviHiremath12" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
              </a>
              <a href="mailto:vaishnavihiremath33@gmail.com" aria-label="Email">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
              </a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-image-wrap" style={{ background: 'transparent', boxShadow: 'none', borderRadius: '0', overflow: 'visible' }}>
              <img src="/developer-character.jpg" alt="Vaishnavi Hiremath" className="hero-avatar" />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section" id="about">
        <div className="container">
          <h2 className="section-title">About <span>Me</span></h2>
          <div className="about-grid">
            <div className="about-right">
              <h3>Data Analyst & Python Developer</h3>
              <p>
                I'm a fresh B.Tech graduate in Electronics & Communication Engineering from Appa Institute of Engineering & Technology, Kalaburagi. With a strong academic record (CGPA 9.0), I bring a solid foundation in data analytics, Python development, and web technologies.
              </p>
              <p>
                I'm passionate about uncovering patterns in data, building interactive dashboards with Power BI, and crafting full-stack web applications using React.js and FastAPI. My experience spans data analysis, business intelligence, and backend development.
              </p>
              <div className="about-details">
                <div className="detail-row">
                  <span className="detail-label">Name:</span>
                  <span className="detail-value">Vaishnavi Hiremath</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Location:</span>
                  <span className="detail-value">Bengaluru, India</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">
                    <a href="mailto:vaishnavihiremath33@gmail.com">vaishnavihiremath33@gmail.com</a>
                  </span>
                </div>
              </div>
              <a
                href="/Vaishnavi_Hiremath_Resume.pdf"
                download="Vaishnavi_Hiremath_Resume.pdf"
                className="btn btn-primary"
              >
                Download Resume
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Specialization Section */}
      <section className="section section-alt" id="skills">
        <div className="container">
          <h2 className="section-title">My <span>Specialization</span></h2>
          <p className="section-subtitle">Technologies and tools I work with</p>
          <div className="specialization-grid">
            <div className="spec-card" data-animate="">
              <div className="spec-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><line x1={18} y1={20} x2={18} y2={10} /><line x1={12} y1={20} x2={12} y2={4} /><line x1={6} y1={20} x2={6} y2={14} /></svg>
              </div>
              <h3>Data Analytics</h3>
              <p>SQL, Python, Pandas, NumPy, Power BI, Excel, EDA, ETL, Statistical Analysis, Data Wrangling</p>
            </div>
            <div className="spec-card" data-animate="">
              <div className="spec-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
              </div>
              <h3>Web Development</h3>
              <p>React.js, FastAPI, HTML, CSS, REST APIs, Tailwind CSS, SQLAlchemy, Full-Stack Development</p>
            </div>
            <div className="spec-card" data-animate="">
              <div className="spec-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 0 0-4 4c0 2 2 3 2 6H14c0-3 2-4 2-6a4 4 0 0 0-4-4z" /><line x1={10} y1={16} x2={14} y2={16} /><line x1={10} y1={19} x2={14} y2={19} /><path d="M10 22h4" /></svg>
              </div>
              <h3>ML & GenAI</h3>
              <p>Machine Learning Basics, LLM Fundamentals, Prompt Engineering, Data Modeling</p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="section" id="portfolio">
        <div className="container">
          <h2 className="section-title">My <span>Projects</span></h2>
          <p className="section-subtitle">Projects I've built</p>
          <div className="projects-grid">
            <div className="project-card" data-animate="">
              <div className="project-image">
                <div className="project-placeholder">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" width="48" height="48"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
                </div>
              </div>
              <div className="project-info">
                <span className="project-type">Full-Stack Web App</span>
                <h3>E-Commerce Website</h3>
                <p>Full-stack e-commerce platform with React.js frontend, FastAPI backend, role-based access control (RBAC), responsive UI/UX, and multi-user data isolation.</p>
                <div className="project-tech-tags">
                  <span>React.js</span><span>FastAPI</span><span>SQLAlchemy</span><span>Tailwind CSS</span><span>Python</span>
                </div>
                <a href="https://github.com/VaishnaviHiremath12/SHOPEASE-E-Commerce-website-" target="_blank" rel="noopener noreferrer" className="project-link">View Project</a>
              </div>
            </div>

            <div className="project-card" data-animate="">
              <div className="project-image">
                <div className="project-placeholder">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" width="48" height="48"><line x1={18} y1={20} x2={18} y2={10} /><line x1={12} y1={20} x2={12} y2={4} /><line x1={6} y1={20} x2={6} y2={14} /></svg>
                </div>
              </div>
              <div className="project-info">
                <span className="project-type">Data Analytics Dashboard</span>
                <h3>Crowdfunding Performance Dashboard</h3>
                <p>Interactive Power BI dashboard analyzing crowdfunding data with data modeling, DAX measures, tracking success rate (38.35%), total funds ($48B), and backer count (44.52M).</p>
                <div className="project-tech-tags">
                  <span>SQL</span><span>Power BI</span><span>Excel</span><span>DAX</span><span>Data Modeling</span>
                </div>
                <a href="https://github.com/VaishnaviHiremath12" target="_blank" rel="noopener noreferrer" className="project-link">View Project</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="section section-alt" id="experience">
        <div className="container">
          <h2 className="section-title">My <span>Experience</span></h2>
          <div className="experience-timeline">
            <div className="exp-card" data-animate="">
              <div className="exp-dot"></div>
              <div className="exp-content">
                <div className="exp-header">
                  <div>
                    <h3>Python Developer Intern</h3>
                    <p className="exp-company">Minds NXT</p>
                  </div>
                  <span className="exp-date">Jan 2026 - Present</span>
                </div>
                <ul>
                  <li>Developed and deployed RESTful APIs using Python and FastAPI to support backend functionality and CRUD operations</li>
                  <li>Integrated APIs with React.js frontend and managed database operations using SQLAlchemy ORM with SQLite</li>
                  <li>Implemented JWT authentication, unit testing, debugging, and code reviews</li>
                </ul>
              </div>
            </div>
            <div className="exp-card" data-animate="">
              <div className="exp-dot"></div>
              <div className="exp-content">
                <div className="exp-header">
                  <div>
                    <h3>Data Analyst Intern</h3>
                    <p className="exp-company">Ai variant - Bangalore</p>
                  </div>
                  <span className="exp-date">Jun 2025 - Sep 2025</span>
                </div>
                <ul>
                  <li>Analyzed large-scale business datasets using SQL, Python, and Excel to uncover trends and perform statistical analysis</li>
                  <li>Built interactive Power BI dashboards to visualize performance metrics and deliver business intelligence insights</li>
                  <li>Performed data cleaning, data wrangling, and report automation using Python and Excel</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="section" id="education">
        <div className="container">
          <h2 className="section-title">My <span>Education</span></h2>
          <div className="education-card" data-animate="">
            <div className="edu-info">
              <h3>B.Tech - Electronics &amp; Communication Engineering</h3>
              <p className="edu-school">Appa Institute of Engineering &amp; Technology, Kalaburagi</p>
              <p className="edu-year">2021 - 2025</p>
              <p className="edu-cgpa">CGPA: <strong>9.0 / 10</strong></p>
            </div>
          </div>

          <h3 className="cert-heading">Certifications</h3>
          <div className="certs-list">
            <div className="cert-item" data-animate="">
              <div>
                <h4>Data Visualization: Empowering Business with Effective Insights</h4>
                <p>Tata Forage - Aug 2025</p>
              </div>
            </div>
            <div className="cert-item" data-animate="">
              <div>
                <h4>Data Analyst Certification</h4>
                <p>ExcelR - Aug 2025</p>
              </div>
            </div>
            <div className="cert-item" data-animate="">
              <div>
                <h4>Python Libraries for Data Science</h4>
                <p>Simplilearn SkillUp - Sep 2025</p>
              </div>
            </div>
            <div className="cert-item" data-animate="">
              <div>
                <h4>NASSCOM Future Skills Prime Certification</h4>
                <p>2025</p>
              </div>
            </div>
            <div className="cert-item" data-animate="">
              <div>
                <h4>Deloitte Technology Virtual Internship</h4>
                <p>Deloitte Forage - Mar 2026</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section section-alt" id="contact">
        <div className="container">
          <h2 className="section-title">Contact <span>Me</span></h2>
          <p className="section-subtitle">Let's work together</p>
          <div className="contact-grid">
            <div className="contact-info">
              <div className="contact-card">
                <div className="contact-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                </div>
                <div>
                  <h4>Email</h4>
                  <a href="mailto:vaishnavihiremath33@gmail.com">vaishnavihiremath33@gmail.com</a>
                </div>
              </div>
              <div className="contact-card">
                <div className="contact-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                </div>
                <div>
                  <h4>Phone</h4>
                  <a href="tel:9535504808">+91 9535504808</a>
                </div>
              </div>
              <div className="contact-card">
                <div className="contact-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx={12} cy={10} r={3} /></svg>
                </div>
                <div>
                  <h4>Location</h4>
                  <p>Bengaluru, India</p>
                </div>
              </div>
              <div className="contact-socials">
                <a href="https://www.linkedin.com/in/vaishnavi-hiremath-a2b79931a/" target="_blank" rel="noopener noreferrer" className="social-btn">LinkedIn</a>
                <a href="https://github.com/VaishnaviHiremath12" target="_blank" rel="noopener noreferrer" className="social-btn">GitHub</a>
              </div>
            </div>
            <form className="contact-form" onSubmit={handleContactSubmit}>
              <input type="text" name="from_name" placeholder="Your Name" autoComplete="name" required />
              <input type="email" name="from_email" placeholder="Your Email" autoComplete="email" required />
              <input type="text" name="subject" placeholder="Subject" autoComplete="off" />
              <textarea name="message" placeholder="Your Message" rows={5} required></textarea>
              
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>

              {submitStatus === 'success' && (
                <div className="form-status-msg form-status-success" role="status" aria-live="polite">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>{submitMessage}</span>
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="form-status-msg form-status-error" role="alert" aria-live="assertive">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <span>{submitMessage}</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2026 Vaishnavi Hiremath. All rights reserved.</p>
        </div>
      </footer>
      </div>
    </>
  );
}

export default App;
