var canvas;

export const Sketch = (p) => {
  // this class describes the properties of a single particle.
  class Particle {
    // setting the co-ordinates, radius and the
    // speed of a particle in both the co-ordinates axes.
      constructor(){
        this.x = p.random(0,p.width);
        this.y = p.random(0,p.height);
        this.r = p.random(3,14);
        this.xSpeed = p.random(-0.3,0.3);
        this.ySpeed = p.random(-0.3,0.35);
      }
    
    // creation of a particle.
      createParticle() {
        p.noStroke();
        p.fill('rgba(192,255,164,0.5)');
        p.circle(this.x,this.y,this.r);
      }
    
    // setting the particle in motion.
      moveParticle() {
        if(this.x < 0 || this.x > p.width)
          this.xSpeed*=-1;
        if(this.y < 0 || this.y > p.height)
          this.ySpeed*=-1;
        this.x+=this.xSpeed;
        this.y+=this.ySpeed;
      }
    
    // this function creates the connections(lines)
    // between particles which are less than a certain distance apart
      joinParticles(particles) {
        particles.forEach(element =>{
          let dis = p.dist(this.x,this.y,element.x,element.y);
          if(dis<175) {
            p.stroke('rgba(224,251,212,0.3)');
            p.line(this.x,this.y,element.x,element.y);
          }
        });
      }
    }
    
  // an array to add multiple particles
  let particles = [];
  
  p.setup = () => {
    canvas = p.createCanvas(window.innerWidth, window.innerHeight);
    canvas.position(0,0)
    canvas.style('z-index', '-1')
    for(let i = 0;i<p.width/12;i++){
      particles.push(new Particle());
    }
  }
  
  p.draw = () => {
    p.background('#EFD4FB');
    for(let i = 0;i<particles.length;i++) {
      particles[i].createParticle();
      particles[i].moveParticle();
      particles[i].joinParticles(particles.slice(i));
    }
  }
}
