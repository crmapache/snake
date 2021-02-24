import anime      from 'animejs';
import {percents} from '@/js/helpers';

export default class Bonus {
  constructor(level, cell, type) {
    this.type  = type;
    this.level = level;
    this.cell  = cell;
    
    this.health = 99.999999;
    
    this.healthInterval = setInterval(() => {
      anime.remove(this);
      
      anime({
        targets:  this,
        health:   this.health - percents(this.health, 10),
        round:    1,
        duration: 700,
        easing:   'easeOutExpo',
      });
      
      this.health -= percents(this.health, 10);
      if (this.health < 1) {
        this.destroy();
      }
    }, 900);
  }
  
  destroy() {
    clearInterval(this.healthInterval);
    this.cell.bonus = null;
  }
}