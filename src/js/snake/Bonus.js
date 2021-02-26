import anime      from 'animejs';
import {percents} from '@/js/helpers';
import constants  from '@/js/constants';

export default class Bonus {
  constructor(gameClass, type, level, cell) {
    this.gameClass = gameClass;
    this.type      = type;
    this.level     = level;
    this.cell      = cell;
    
    this.fieldTime  = constants.BONUS_FIELD_TIME + (this.level * 2);
    this.activeTime = constants.BONUS_ACTIVE_TIME * this.level;
    
    this.fieldInterval  = null;
    this.activeInterval = null;
    
    this.activeTickHandler = null;
    this.deactivateHandler = null;
    
    this.startFieldTimer();
  }
  
  startFieldTimer() {
    this.fieldInterval = setInterval(() => {
      this.fieldTime--;
      
      if (this.fieldTime < 1) {
        this.removeFromField();
      }
    }, 1000);
  }
  
  activate() {
    this.gameClass.sound.play('getBonus');
    
    this.activeInterval = setInterval(() => {
      if (this.gameClass.state === 'play') {
        this.activeTime--;
        
        if (typeof this.activeTickHandler === 'function') {
          this.activeTickHandler();
        }
      }
      
      if (this.activeTime < 1) {
        this.gameClass.sound.play('bonusEnd');
        this.deactivate();
      }
    }, 1000);
  }
  
  deactivate() {
    clearInterval(this.activeInterval);
    
    if (typeof this.deactivateHandler === 'function') {
      this.deactivateHandler();
    }
  }
  
  removeFromField() {
    clearInterval(this.fieldInterval);
    this.cell.bonus = null;
  }
}