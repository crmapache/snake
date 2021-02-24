import Snake         from '@snake/Snake';
import {random, key} from '@/js/helpers';
import anime         from 'animejs';

export default class Player {
  constructor(gameClass, id) {
    this.gameClass = gameClass;
    this.id        = id;
    
    this.controlKeys = ({
      1: [87, 68, 83, 65],
      2: [85, 75, 74, 72],
      3: [38, 39, 40, 37]
    })[id];
    
    this.snake = new Snake(this);
    this.gameClass.field.setSnake(this.snake);
  }
  
  wrapEl  = null;
  scoreEl = null;
  picksEl = null;
  
  _score = 0;
  _picks = 0;
  
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
    
    const bonusesWrap = document.createElement('div');
    bonusesWrap.classList.add('bonuses-wrap');
    
    player.append(this.scoreEl);
    player.append(this.picksEl);
    
    this.wrapEl.append(player);
    this.wrapEl.append(bonusesWrap);
  }
  
  increaceScore(score) {
    this.score += score;
    this.picks++;
  }
  
  destroy() {
    this.wrapEl.remove();
    this.snake.destroy();
  }
}