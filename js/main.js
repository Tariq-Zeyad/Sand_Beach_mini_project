// ========== COMPONENT LOADER ==========
class ComponentLoader {
    constructor() {
        this.components = {
            navigation: 'components/navigation.html',
            header: 'components/header.html',
            hero: 'components/hero.html',
            menu: 'components/menu.html',
            about: 'components/about.html',
            testimonials: 'components/testimonials.html',
            faq: 'components/faq.html',
            reservation: 'components/reservation.html',
            footer: 'components/footer.html'
        };
    }

    async loadComponent(containerId, componentPath) {
        const container = document.getElementById(containerId);
        if (!container) return;

        try {
            // Show loading state
            container.innerHTML = `
                <div class="component-loading">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            `;

            const response = await fetch(componentPath);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const html = await response.text();
            container.innerHTML = html;
            
            // Initialize any component-specific functionality
            this.initializeComponent(containerId);
            
        } catch (error) {
            console.error(`Error loading component ${componentPath}:`, error);
            container.innerHTML = `
                <div class="alert alert-warning" role="alert">
                    Failed to load component. Please refresh the page.
                </div>
            `;
        }
    }

    async loadAllComponents() {
        const loadPromises = Object.entries(this.components).map(([id, path]) => {
            return this.loadComponent(`${id}-container`, path);
        });

        await Promise.all(loadPromises);
    }

    initializeComponent(containerId) {
        switch(containerId) {
            case 'navigation-container':
                this.initializeNavigation();
                break;
            case 'menu-container':
                this.initializeMenuFilters();
                break;
            case 'reservation-container':
                this.initializeReservationForm();
                break;
            case 'testimonials-container':
                this.initializeTestimonialCarousel();
                break;
        }
    }

    initializeNavigation() {
        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
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
                    
                    // Close mobile menu if open
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse.classList.contains('show')) {
                        navbarCollapse.classList.remove('show');
                    }
                }
            });
        });

        // Active link highlighting
        const sections = document.querySelectorAll('section[id]');
        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                if (window.scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    initializeMenuFilters() {
        const filterButtons = document.querySelectorAll('.btn-category');
        const menuItems = document.querySelectorAll('.menu-item');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Filter items
                const category = button.getAttribute('data-category');
                
                menuItems.forEach(item => {
                    if (category === 'all' || item.getAttribute('data-category') === category) {
                        item.style.display = 'block';
                        item.style.animation = 'fadeInUp 0.5s ease';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    initializeReservationForm() {
        const form = document.getElementById('reservationForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (!form.checkValidity()) {
                e.stopPropagation();
                form.classList.add('was-validated');
                return;
            }

            // Collect form data
            const formData = {
                name: document.getElementById('fullName').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                guests: document.getElementById('guests').value,
                date: document.getElementById('date').value,
                time: document.getElementById('time').value,
                requests: document.getElementById('specialRequests').value
            };

            // Show success message 
            alert(`Thank you ${formData.name}! Your reservation for ${formData.guests} guests on ${formData.date} at ${formData.time} has been received. We'll contact you at ${formData.phone} to confirm.`);
            
            form.reset();
            form.classList.remove('was-validated');
        });

        // Set minimum date to today
        const dateInput = document.getElementById('date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }
    }

    initializeTestimonialCarousel() {
        // Initialize Bootstrap carousel
        const carousel = document.getElementById('testimonialCarousel');
        if (carousel) {
            new bootstrap.Carousel(carousel, {
                interval: 5000,
                wrap: true
            });
        }
    }
}

// ========== INITIALIZE APPLICATION ==========
document.addEventListener('DOMContentLoaded', () => {
    const loader = new ComponentLoader();
    loader.loadAllComponents().then(() => {
        console.log('All components loaded successfully');
    }).catch(error => {
        console.error('Error loading components:', error);
    });
});