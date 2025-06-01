class Particle {
    constructor(canvas, ctx, x, y) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 1;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
        this.distance;
        this.angle = Math.random() * 2 * Math.PI;
        this.speed = 0.05;
        this.velocityX = Math.cos(this.angle) * this.speed;
        this.velocityY = Math.sin(this.angle) * this.speed;
        
        // Random color from orange gradient
        const colors = ['#ff8c00', '#ff7b00', '#ff6a00', '#ff5900', '#ff4800'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

    update(mouse) {
        // Mouse interaction
        if (mouse.x && mouse.y) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                const force = (mouse.radius - distance) / mouse.radius;
                const directionX = dx / distance;
                const directionY = dy / distance;
                this.x = this.x - (directionX * force * this.density);
                this.y = this.y - (directionY * force * this.density);
            }
        }

        // Return to original position
        if (this.x !== this.baseX) {
            const dx = this.x - this.baseX;
            this.x -= dx * this.speed;
        }
        if (this.y !== this.baseY) {
            const dy = this.y - this.baseY;
            this.y -= dy * this.speed;
        }

        // Add some natural movement
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Bounce off edges
        if (this.x < 0 || this.x > this.canvas.width) this.velocityX *= -1;
        if (this.y < 0 || this.y > this.canvas.height) this.velocityY *= -1;
    }
}

class ParticleNetwork {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particleArray = [];
        this.mouse = {
            x: null,
            y: null,
            radius: 150
        };

        this.init();
        this.animate();
        this.handleResize();
        this.setupEventListeners();
    }

    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        const numberOfParticles = (this.canvas.width * this.canvas.height) / 9000;
        
        this.particleArray = [];
        for (let i = 0; i < numberOfParticles; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            this.particleArray.push(new Particle(this.canvas, this.ctx, x, y));
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = 0; i < this.particleArray.length; i++) {
            this.particleArray[i].update(this.mouse);
            this.particleArray[i].draw();
        }
        
        this.connect();
        requestAnimationFrame(() => this.animate());
    }

    connect() {
        for (let a = 0; a < this.particleArray.length; a++) {
            for (let b = a; b < this.particleArray.length; b++) {
                const dx = this.particleArray[a].x - this.particleArray[b].x;
                const dy = this.particleArray[a].y - this.particleArray[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(255, 140, 0, ${1 - distance/100})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(this.particleArray[a].x, this.particleArray[a].y);
                    this.ctx.lineTo(this.particleArray[b].x, this.particleArray[b].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    handleResize() {
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.init();
        });
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousemove', (event) => {
            this.mouse.x = event.x;
            this.mouse.y = event.y;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.x = undefined;
            this.mouse.y = undefined;
        });
    }
}

// Initialize particle network when the page loads
window.addEventListener('load', () => {
    new ParticleNetwork();
}); 