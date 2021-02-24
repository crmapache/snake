import Snake         from '@snake/Snake';
import {random, key} from '@/js/helpers';
import anime         from 'animejs';

export default class Player {
  constructor(gameClass, id) {
    this.gameClass = gameClass;
    this.id        = id;
    
    this.wrapEl        = null;
    this.scoreEl       = null;
    this.picksEl       = null;
    this.bonusesWrapEl = null;
    
    this._score = 0;
    this._picks = 0;
    
    this.bonuses = {};
    
    this.controlKeys = ({
      1: [87, 68, 83, 65],
      2: [85, 75, 74, 72],
      3: [38, 39, 40, 37]
    })[id];
    
    this.snake = new Snake(this);
    this.gameClass.field.setSnake(this.snake);
  }
  
  get score() {
    return this._score;
  }
  
  set score(v) {
    anime.remove(this);
    
    anime({
      targets:   this.scoreEl,
      innerText: v,
      round:     1,
      duration:  700,
      easing:    'easeOutExpo',
    });
    
    this._score = v;
  }
  
  get picks() {
    return this._picks;
  }
  
  set picks(v) {
    anime.remove(this);
    
    anime({
      targets:   this.picksEl,
      innerText: v,
      round:     1,
      duration:  700,
      easing:    'easeOutExpo',
    });
    
    this._picks = v;
  }
  
  init() {
    this.wrapEl = document.querySelector('#players-wrap');
    
    const player = document.createElement('div');
    player.classList.add('player', 'player-' + this.id);
    
    this.scoreEl = document.createElement('div');
    this.scoreEl.classList.add('score');
    this.scoreEl.innerText = this.score;
    
    this.picksEl = document.createElement('div');
    this.picksEl.classList.add('picks');
    this.picksEl.innerText = this.picks;
    
    this.bonusesWrapEl = document.createElement('div');
    this.bonusesWrapEl.classList.add('bonuses-wrap');
    
    player.append(this.scoreEl);
    player.append(this.picksEl);
    player.append(this.bonusesWrapEl);
    
    this.wrapEl.append(player);
  }
  
  increaceScore(score) {
    const scoreBonus = this.bonuses['score'];
    console.log(score);
    if (scoreBonus) {
      score *= scoreBonus.level + 1;
    }
    console.log(score);
    this.score += score;
    this.picks++;
  }
  
  addBonus(bonus) {
    const transparencyBonusEndHandler = () => {
      this.snake.transparency = false;
    };
    
    if (
        !this.bonuses[bonus.type] ||
        (this.bonuses[bonus.type] && this.bonuses[bonus.type].level <= bonus.level)
    ) {
      bonus.get();
      this.gameClass.sound.play('getBonus');
      
      if (this.bonuses[bonus.type]) {
        if (bonus.type === 'transparency') {
          transparencyBonusEndHandler();
        }
        
        this.bonuses[bonus.type].stop();
      }
      
      bonus.endHandler = () => {
        this.gameClass.sound.play('bonusEnd');
        
        if (bonus.type === 'transparency') {
          transparencyBonusEndHandler();
        }
        
        delete this.bonuses[bonus.type];
      };
      
      if (bonus.type === 'transparency') {
        this.snake.transparency = true;
      }
      
      if (bonus.type === 'cut') {
        bonus.tickHandler = () => {
          if (this.snake.cells.length > this.snake.initialSize) {
            const lastSnakeCell = this.snake.cells.pop();
            const fieldCell     = this.gameClass.field.cells[key(lastSnakeCell.x, lastSnakeCell.y)];
            
            if (fieldCell) {
              fieldCell.snake = null;
            }
          }
        };
      }
      
      this.bonuses[bonus.type] = bonus;
    }
  }
  
  destroy() {
    this.wrapEl.remove();
    this.snake.destroy();
  }
}