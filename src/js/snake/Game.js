import Interface        from '@/js/layout/Interface';
import Sound            from '@/js/layout/Sound';
import Calculator       from '@snake/Calculator';
import Field            from '@snake/Field';
import Bonus            from '@snake/Bonus';
import Player           from '@snake/Player';
import {randomLauncher} from '@/js/helpers';


export default class Game {
  constructor() {
    this.interface  = new Interface(this);
    this.calculator = new Calculator(this);
    this.field      = new Field(this);
    this.sound      = new Sound();
    
    this.players    = [];
    this.difficulty = 7;
    this.state      = null;
  }
  
  init() {
    this.interface.init();
    this.field.init();
  }
  
  start() {
    //this.sound.play('music');
    this.state = 'play';
    this.field.draw();
    
    let gameInterval = setInterval(() => {
      if (this.state !== 'play') {
        return clearInterval(gameInterval);
      }
      
      for (let player of this.players) {
        if (!player.snake.crawl()) {
          this.field.draw();
          this.end();
        }
      }
    }, this.getSnakesSpeed());
    
    let drawInterval = setInterval(() => {
      if (this.state !== 'play') {
        return clearInterval(drawInterval);
      }
      
      this.field.draw();
    }, 33);
    
    randomLauncher(() => {
      if (this.state !== 'play') {
        return false;
      }
      
      this.field.spewRabbit();
      
      return true;
    }, ...this.getRabbitsFrequency());
    
    randomLauncher(() => {
      if (this.state !== 'play') {
        return false;
      }
      
      this.field.spewBonus();
      
      return true;
    }, ...this.getBonusFrequency());
  }
  
  pause() {
    this.state = 'pause';
  }
  
  end() {
    this.state = 'end';
  }
  
  togglePlayer(n) {
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].id === n) {
        this.players[i].destroy();
        this.players.splice(i, 1);
        return;
      }
    }
    
    const player = new Player(this, n);
    player.init();
    
    this.players.push(player);
  }
  
  getSnakesSpeed() {
    return 1000 / this.difficulty;
  }
  
  getRabbitsFrequency() {
    return [10000 / this.difficulty, 20000 / this.difficulty];
  }
  
  getBonusFrequency() {
    return [100000 / this.difficulty, 200000 / this.difficulty];
  }
}