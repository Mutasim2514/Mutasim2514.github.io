      // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Navigation background change on scroll
        window.addEventListener('scroll', () => {
            const nav = document.querySelector('.nav');
            if (window.scrollY > 100) {
                nav.style.background = 'rgba(0, 0, 0, 0.95)';
                nav.style.backdropFilter = 'blur(30px)';
            } else {
                nav.style.background = 'rgba(0, 0, 0, 0.9)';
                nav.style.backdropFilter = 'blur(20px)';
            }
        });

        // Show notification popup
        setTimeout(() => {
            const notification = document.getElementById('notification');
            notification.classList.add('show');
            
            // Auto hide after 5 seconds
            setTimeout(() => {
                notification.classList.remove('show');
            }, 5000);
        }, 2000);

        // Close notification function
        function closeNotification() {
            const notification = document.getElementById('notification');
            notification.classList.remove('show');
        }

        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.portfolio-item, .content-card, .skill-card, .contact-item').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });

        // Add click ripple effect to buttons
        document.querySelectorAll('.cta-button, .portfolio-link').forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.style.position = 'absolute';
                ripple.style.borderRadius = '50%';
                ripple.style.background = 'rgba(255, 255, 255, 0.3)';
                ripple.style.transform = 'scale(0)';
                ripple.style.animation = 'ripple 0.6s linear';
                ripple.style.pointerEvents = 'none';
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        // Add ripple animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        // Typing effect for hero subtitle
        const subtitle = document.querySelector('.hero p');
        const originalText = subtitle.textContent;
        subtitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < originalText.length) {
                subtitle.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        setTimeout(typeWriter, 1000);

        // Parallax effect for hero section
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.hero-content');
            const speed = scrolled * 0.5;
            parallax.style.transform = `translateY(${speed}px)`;
        });

        // Mobile menu toggle (if needed)
        const createMobileMenu = () => {
            if (window.innerWidth <= 768) {
                const navLinks = document.querySelector('.nav-links');
                const hamburger = document.createElement('div');
                hamburger.className = 'hamburger';
                hamburger.innerHTML = '☰';
                hamburger.style.cssText = `
                    font-size: 24px;
                    cursor: pointer;
                    color: white;
                    display: block;
                `;
                
                hamburger.addEventListener('click', () => {
                    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
                    navLinks.style.flexDirection = 'column';
                    navLinks.style.position = 'absolute';
                    navLinks.style.top = '100%';
                    navLinks.style.left = '0';
                    navLinks.style.width = '100%';
                    navLinks.style.background = 'rgba(0, 0, 0, 0.95)';
                    navLinks.style.padding = '20px';
                });
                
                document.querySelector('.nav-container').appendChild(hamburger);
            }
        };

        // Initialize mobile menu on load and resize
        createMobileMenu();
        window.addEventListener('resize', createMobileMenu);