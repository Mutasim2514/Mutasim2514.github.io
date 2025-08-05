        // Loading Screen Management
        window.addEventListener('load', () => {
            // Simulate loading time for better UX
            setTimeout(() => {
                const loadingScreen = document.getElementById('loadingScreen');
                const mainContent = document.getElementById('mainContent');
                
                loadingScreen.classList.add('hidden');
                mainContent.classList.add('loaded');
                
                // Initialize particle network after loading
                particleNetwork = new ParticleNetwork();
                
                // Remove loading screen from DOM after transition
                setTimeout(() => {
                    loadingScreen.remove();
                }, 800);
            }, 3500); // 3.5 seconds loading time
        });

        // Particle Network System
        class ParticleNetwork {
            constructor() {
                this.canvas = document.getElementById('particle-canvas');
                this.ctx = this.canvas.getContext('2d');
                this.particles = [];
                this.mouse = { x: 0, y: 0 };
                this.animationId = null;
                
                this.settings = {
                    particleCount: 200,
                    maxDistance: 120,
                    mouseRadius: 150,
                    colors: [
                        'rgba(255, 0, 102, 0.8)',   // Pink
                        'rgba(204, 0, 255, 0.8)',  // Purple  
                        'rgba(51, 102, 255, 0.8)', // Blue
                        'rgba(0, 204, 255, 0.8)'   // Cyan
                    ]
                };
                
                this.init();
                this.bindEvents();
            }
            
            init() {
                this.resizeCanvas();
                this.createParticles();
                this.animate();
            }
            
            resizeCanvas() {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
            }
            
            createParticles() {
                this.particles = [];
                for (let i = 0; i < this.settings.particleCount; i++) {
                    const speed = Math.random() * 1.5 + 0.5;
                    const angle = Math.random() * Math.PI * 2;
                    
                    this.particles.push({
                        x: Math.random() * this.canvas.width,
                        y: Math.random() * this.canvas.height,
                        vx: Math.cos(angle) * speed,
                        vy: Math.sin(angle) * speed,
                        baseVx: Math.cos(angle) * speed,
                        baseVy: Math.sin(angle) * speed,
                        size: Math.random() * 3 + 1,
                        color: this.settings.colors[Math.floor(Math.random() * this.settings.colors.length)],
                        opacity: Math.random() * 0.5 + 0.5
                    });
                }
            }
            
            updateParticles() {
                this.particles.forEach(particle => {
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    
                    if (particle.x < 0 || particle.x > this.canvas.width) {
                        particle.vx *= -0.8;
                        particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
                    }
                    if (particle.y < 0 || particle.y > this.canvas.height) {
                        particle.vy *= -0.8;
                        particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
                    }
                    
                    const dx = this.mouse.x - particle.x;
                    const dy = this.mouse.y - particle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < this.settings.mouseRadius) {
                        const force = (this.settings.mouseRadius - distance) / this.settings.mouseRadius;
                        particle.vx += dx * force * 0.005;
                        particle.vy += dy * force * 0.005;
                    }
                    
                    particle.vx *= 0.995;
                    particle.vy *= 0.995;
                    
                    particle.vx += (Math.random() - 0.5) * 0.02;
                    particle.vy += (Math.random() - 0.5) * 0.02;
                    
                    const maxVelocity = 3;
                    const currentSpeed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
                    if (currentSpeed > maxVelocity) {
                        particle.vx = (particle.vx / currentSpeed) * maxVelocity;
                        particle.vy = (particle.vy / currentSpeed) * maxVelocity;
                    }
                    
                    const minSpeed = 0.1;
                    if (currentSpeed < minSpeed) {
                        const pushAngle = Math.random() * Math.PI * 2;
                        particle.vx += Math.cos(pushAngle) * 0.3;
                        particle.vy += Math.sin(pushAngle) * 0.3;
                    }
                });
            }
            
            drawParticles() {
                this.particles.forEach(particle => {
                    this.ctx.save();
                    this.ctx.globalAlpha = particle.opacity;
                    this.ctx.fillStyle = particle.color;
                    this.ctx.beginPath();
                    this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.restore();
                });
            }
            
            drawConnections() {
                for (let i = 0; i < this.particles.length; i++) {
                    for (let j = i + 1; j < this.particles.length; j++) {
                        const dx = this.particles[i].x - this.particles[j].x;
                        const dy = this.particles[i].y - this.particles[j].y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        
                        if (distance < this.settings.maxDistance) {
                            const opacity = (this.settings.maxDistance - distance) / this.settings.maxDistance;
                            this.ctx.save();
                            this.ctx.globalAlpha = opacity * 0.3;
                            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                            this.ctx.lineWidth = 1;
                            this.ctx.beginPath();
                            this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                            this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                            this.ctx.stroke();
                            this.ctx.restore();
                        }
                    }
                }
            }
            
            animate() {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                
                this.updateParticles();
                this.drawConnections();
                this.drawParticles();
                
                this.animationId = requestAnimationFrame(() => this.animate());
            }
            
            bindEvents() {
                window.addEventListener('resize', () => {
                    this.resizeCanvas();
                    this.createParticles();
                });
                
                window.addEventListener('mousemove', (e) => {
                    this.mouse.x = e.clientX;
                    this.mouse.y = e.clientY;
                });
                
                window.addEventListener('touchmove', (e) => {
                    if (e.touches.length > 0) {
                        this.mouse.x = e.touches[0].clientX;
                        this.mouse.y = e.touches[0].clientY;
                    }
                });
            }
            
            destroy() {
                if (this.animationId) {
                    cancelAnimationFrame(this.animationId);
                }
            }
        }
        
        let particleNetwork;
        
        window.addEventListener('beforeunload', () => {
            if (particleNetwork) {
                particleNetwork.destroy();
            }
        });

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

        // Show notification popup after loading completes
        setTimeout(() => {
            const notification = document.getElementById('notification');
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 5000);
        }, 5000); // Show after page loads + 1.5s

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

        // Typing effect for hero subtitle (after loading)
        setTimeout(() => {
            const subtitle = document.querySelector('.hero p');
            if (subtitle) {
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
            }
        }, 4500);

        // Parallax effect for hero section
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.hero-content');
            if (parallax) {
                const speed = scrolled * 0.5;
                parallax.style.transform = `translateY(${speed}px)`;
            }
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
        setTimeout(() => {
            createMobileMenu();
        }, 4000);
        window.addEventListener('resize', createMobileMenu);
