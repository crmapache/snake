import Snake         from '@snake/Snake';
import {random, key} from '@/js/helpers';
import anime         from 'animejs';
import constants     from '@/js/constants';

export default class Player {
  constructor(gameClass, id) {
    this.gameClass = gameClass;
    this.id        = id;
    
    this.wrapEl        = null;
    this.playerEl      = null;
    this.scoreEl       = null;
    this.picksEl       = null;
    this.bonusesWrapEl = null;
    
    this._score = 0;
    this._picks = 0;
    
    this.bonuses = {};
    
    this.controlKeys = constants.PLAYERS_KEYCODES[id];
    
    this.createSnake();
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
    
    this.playerEl = document.createElement('div');
    this.playerEl.classList.add('player', 'player-' + this.id);
    
    this.scoreEl = document.createElement('div');
    this.scoreEl.classList.add('score');
    this.scoreEl.innerText = this.score;
    
    this.picksEl = document.createElement('div');
    this.picksEl.classList.add('picks');
    this.picksEl.innerText = this.picks;
    
    this.bonusesWrapEl = document.createElement('div');
    this.bonusesWrapEl.classList.add('bonuses-wrap');
    
    this.playerEl.append(this.scoreEl);
    this.playerEl.append(this.picksEl);
    this.playerEl.append(this.bonusesWrapEl);
    
    this.wrapEl.append(this.playerEl);
  }
  
  increaceScore(score) {
    const scoreBonus = this.bonuses['score'];
    
    score *= this.gameClass.difficulty;
    
    if (scoreBonus) {
      score *= scoreBonus.level + 1;
    }
    
    this.score += score;
    this.picks++;
  }
  
  addBonus(bonus) {
    if (
        !this.bonuses[bonus.type] ||
        (this.bonuses[bonus.type] && this.bonuses[bonus.type].level <= bonus.level)
    ) {
      if (this.bonuses[bonus.type]) {
        this.bonuses[bonus.type].deactivate();
      }
      
      bonus.deactivateHandler = () => {
        if (this.gameClass.state === 'play') {
          if (bonus.type === 'transparency') {
            this.snake.transparency = false;
          }
          
          delete this.bonuses[bonus.type];
        }
      };
      
      bonus.activate();
      
      if (bonus.type === 'transparency') {
        this.snake.transparency = true;
      }
      
      if (bonus.type === 'cut') {
        bonus.activeTickHandler = () => {
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
    
    if (this.bonuses[bonus.type] && this.bonuses[bonus.type].level > bonus.level) {
      this.gameClass.sound.play('bonusError');
    }
  }
  
  cleanBonuses() {
    for(let bonusKey in this.bonuses) {
      this.bonuses[bonusKey].deactivate();
    }
  
    this.bonuses = {};
  }
  
  createSnake() {
    this.snake = new Snake(this);
    this.gameClass.field.setSnake(this.snake);
  }
  
  destroy() {
    this.cleanBonuses();
    this.playerEl.remove();
    this.snake.destroy();
  }
}