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

    // Convert hex to RGB
    function hexToRgb(hex) {
        // Remove # if present
        hex = hex.replace('#', '');
        
        // Parse r, g, b values
        let r, g, b;
        
        if (hex.length === 3) {
            r = parseInt(hex.charAt(0) + hex.charAt(0), 16);
            g = parseInt(hex.charAt(1) + hex.charAt(1), 16);
            b = parseInt(hex.charAt(2) + hex.charAt(2), 16);
        } else if (hex.length === 6) {
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
        } else {
            return null;
        }
        
        return { r, g, b };
    }

    // Lighten a color
    function lightenColor(hex, percent) {
        const rgb = hexToRgb(hex);
        if (!rgb) return hex;
        
        const r = Math.min(255, rgb.r + Math.round(rgb.r * percent / 100));
        const g = Math.min(255, rgb.g + Math.round(rgb.g * percent / 100));
        const b = Math.min(255, rgb.b + Math.round(rgb.b * percent / 100));
        
        return `rgb(${r}, ${g}, ${b})`;
    }

    // Set CSS variables for accent colors
    function setAccentColors(accent1, accent2, accent3, accent4) {
        document.documentElement.style.setProperty('--accent-1', accent1);
        document.documentElement.style.setProperty('--accent-2', accent2);
        document.documentElement.style.setProperty('--accent-3', accent3);
        document.documentElement.style.setProperty('--accent-4', accent4);
        
        // Set RGB versions for rgba usage
        const rgb1 = hexToRgb(accent1);
        const rgb2 = hexToRgb(accent2);
        const rgb3 = hexToRgb(accent3);
        
        if (rgb1) {
            document.documentElement.style.setProperty('--accent-1-rgb', `${rgb1.r}, ${rgb1.g}, ${rgb1.b}`);
            document.documentElement.style.setProperty('--accent-1-light', lightenColor(accent1, 20));
        }
        if (rgb2) {
            document.documentElement.style.setProperty('--accent-2-rgb', `${rgb2.r}, ${rgb2.g}, ${rgb2.b}`);
            document.documentElement.style.setProperty('--accent-2-light', lightenColor(accent2, 20));
        }
        if (rgb3) {
            document.documentElement.style.setProperty('--accent-3-rgb', `${rgb3.r}, ${rgb3.g}, ${rgb3.b}`);
            document.documentElement.style.setProperty('--accent-3-light', lightenColor(accent3, 20));
        }
        
        // Set text color RGB for rgba usage
        const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim();
        if (textColor.startsWith('#')) {
            const textRgb = hexToRgb(textColor);
            if (textRgb) {
                document.documentElement.style.setProperty('--text-color-rgb', `${textRgb.r}, ${textRgb.g}, ${textRgb.b}`);
            }
        } else if (textColor.startsWith('rgb')) {
            const rgbValues = textColor.match(/\d+/g);
            if (rgbValues && rgbValues.length >= 3) {
                document.documentElement.style.setProperty('--text-color-rgb', `${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]}`);
            }
        }
    }

    // Theme Toggle with Wave Effect
    function toggleTheme() {
        const wave = document.getElementById('themeTransitionWave');
        const isLight = document.body.classList.contains('light-theme');
        
        // Start the wave animation
        wave.style.background = isLight ? '#000000' : '#F8FAFC';
        wave.classList.add('active');
        
        // After wave covers the screen, toggle the theme
        setTimeout(() => {
            document.body.classList.toggle('light-theme');
            localStorage.setItem('portfolioTheme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
            
            // Update icon
            const icon = document.querySelector('#darkModeToggle i');
            if (document.body.classList.contains('light-theme')) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
            
            // Update accent colors
            const accent1 = getComputedStyle(document.documentElement).getPropertyValue('--accent-1').trim();
            const accent2 = getComputedStyle(document.documentElement).getPropertyValue('--accent-2').trim();
            const accent3 = getComputedStyle(document.documentElement).getPropertyValue('--accent-3').trim();
            const accent4 = getComputedStyle(document.documentElement).getPropertyValue('--accent-4').trim();
            setAccentColors(accent1, accent2, accent3, accent4);
            
            // Hide the wave after theme transition is complete
            setTimeout(() => {
                wave.classList.remove('active');
            }, 600);
        }, 600);
    }

    // Initialize theme from localStorage or prefer-color-scheme
    function initTheme() {
        const savedTheme = localStorage.getItem('portfolioTheme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
            document.body.classList.add('light-theme');
            document.querySelector('#darkModeToggle i').classList.remove('fa-moon');
            document.querySelector('#darkModeToggle i').classList.add('fa-sun');
        }
    }

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

    // Initialize theme system when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize theme
        initTheme();
        
        // Set up event listener for theme toggle
        document.getElementById('darkModeToggle').addEventListener('click', toggleTheme);
        
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
                    
                    // Close mobile menu if open
                    if (window.innerWidth <= 768) {
                        document.getElementById('navLinks').classList.remove('active');
                    }
                }
            });
        });

        // Navigation background change on scroll
        let lastScrollPosition = 0;
        window.addEventListener('scroll', () => {
            const nav = document.querySelector('.nav');
            if (window.scrollY > 100) {
                nav.style.background = document.body.classList.contains('light-theme') ? 
                    'rgba(248, 250, 252, 0.95)' : 'rgba(0, 0, 0, 0.95)';
                nav.style.backdropFilter = 'blur(30px)';
            } else {
                nav.style.background = document.body.classList.contains('light-theme') ? 
                    'rgba(248, 250, 252, 0.9)' : 'rgba(0, 0, 0, 0.9)';
                nav.style.backdropFilter = 'blur(20px)';
            }
            
            // Show/hide back to top button
            const backToTop = document.getElementById('backToTop');
            if (window.scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
            
            // Hide nav when scrolling down
            const scrollPosition = window.scrollY;
            if (scrollPosition > lastScrollPosition && scrollPosition > 100) {
                document.querySelector('.nav').classList.add('hidden');
            } else {
                document.querySelector('.nav').classList.remove('hidden');
            }
            lastScrollPosition = scrollPosition;
        });

        // Show notification popup after loading completes
        setTimeout(() => {
            const notification = document.getElementById('notification');
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 5000);
        }, 5000);

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
                    entry.target.classList.add('visible');
                    
                    // Animate skill progress bars
                    if (entry.target.classList.contains('skill-card')) {
                        const progressBar = entry.target.querySelector('.skill-progress-bar');
                        if (progressBar) {
                            const percent = progressBar.dataset.percent;
                            progressBar.style.width = `${percent}%`;
                        }
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.portfolio-item, .content-card, .skill-card, .contact-item, .timeline-item').forEach(el => {
            observer.observe(el);
        });

        // Add click ripple effect to buttons
        document.querySelectorAll('.cta-button, .portfolio-link, .submit-btn, .social-link').forEach(button => {
            button.addEventListener('click', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const size = Math.max(rect.width, rect.height);
                
                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = (x - size/2) + 'px';
                ripple.style.top = (y - size/2) + 'px';
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        // Micro-interactions for buttons and links
        document.querySelectorAll('button, a, .social-link').forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.transform = 'translateY(-2px)';
                element.style.transition = 'all 0.3s ease';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translateY(0)';
            });
        });

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
                        setTimeout(typeWriter, 50);
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

        // Mobile menu toggle
        document.getElementById('mobileMenuBtn').addEventListener('click', function() {
            document.getElementById('navLinks').classList.toggle('active');
            this.innerHTML = document.getElementById('navLinks').classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });

        // Scroll down button
        document.getElementById('scrollDown').addEventListener('click', function() {
            window.scrollBy({
                top: window.innerHeight - 100,
                behavior: 'smooth'
            });
        });

        // Contact form submission
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Here you would typically send the form data to a server
            // For demonstration, we'll just show a notification
            const notification = document.getElementById('notification');
            notification.querySelector('h4').textContent = 'Message Not Sent!';
            notification.querySelector('p').textContent = 'This feature is not fully developed right now!';
            notification.classList.add('show');
            
            // Reset form
            this.reset();
            
            // Hide notification after 5 seconds
            setTimeout(() => {
                notification.classList.remove('show');
            }, 5000);
        });
    });

