import anime      from 'animejs';
import {percents} from '@/js/helpers';

export default class Bonus {
  constructor(type, level, cell) {
    this.type  = type;
    this.level = level;
    this.cell  = cell;
    
    this.health = 99.999999;
    
    this.healthInterval = setInterval(() => {
      anime.remove(this);
      
      anime({
        targets:  this,
        health:   this.health - percents(this.health, 10),
        duration: 700,
        easing:   'easeOutExpo',
        complete: () => {
          if (this.health <= 10) {
            this.removeFromField();
          }
        }
      });
    }, 900);
    
    this.lifeInterval     = null;
    this.lifeTimerCounter = 10 * this.level;
    
    this.tickHandler = null;
    this.endHandler  = null;
  }
  
  get() {
    this.lifeInterval = setInterval(() => {
      this.lifeTimerCounter--;
      if (typeof this.tickHandler === 'function') {
        this.tickHandler();
      }
      
      if (this.lifeTimerCounter < 0) {
        clearInterval(this.lifeInterval);
        this.endHandler();
      }
    }, 1000);
  }
  
  stop() {
    clearInterval(this.lifeInterval);
  }
  
  removeFromField() {
    clearInterval(this.healthInterval);
    this.cell.bonus = null;
  }
}