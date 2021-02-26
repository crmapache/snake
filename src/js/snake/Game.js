import Interface        from '@/js/layout/Interface';
import Sound            from '@/js/layout/Sound';
import Field            from '@snake/Field';
import Bonus            from '@snake/Bonus';
import Player           from '@snake/Player';
import {randomLauncher} from '@/js/helpers';
import constants        from '@/js/constants';


export default class Game {
  constructor() {
    this.interface = new Interface(this);
    this.field     = new Field(this);
    this.sound     = new Sound();
    
    this.players    = [];
    this.difficulty = constants.DEFAULT_DIFFICULTY;
    this.state      = null;
    
    this.results = null;
  }
  
  init() {
    this.interface.init();
    this.field.init();
  }
  
  start() {
    if (!this.state) {
      this.field.spewRabbit();
    }
    
    this.sound.play('music');
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
    }, constants.DRAW_INTERVAL);
    
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
    this.sound.stop('music');
    this.setGameResults();
    this.updateAchievements();
    this.interface.openEndMenu();
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
    return [1000, 3000];
  }
  
  getBonusFrequency() {
    return [100000 / this.difficulty, 200000 / this.difficulty];
  }
  
  updateAchievements() {
    const achievements = JSON.parse(window.localStorage.getItem('achievements')) || [];
    
    for (let player of this.players) {
      const score = Math.round(player.score);
      
      if (score > 0) {
        achievements.push(score);
      }
    }
    
    window.localStorage.setItem('achievements', JSON.stringify(achievements));
  }
  
  setGameResults() {
    const achievements = JSON.parse(window.localStorage.getItem('achievements')) || [];
    const topList      = [];
    const results      = {};
    
    for (let i = 0; i < achievements.length; i++) {
      topList.push({
        score:       achievements[i],
        currentGame: false,
        playerID:    null,
      });
    }
    
    for (let player of this.players) {
      const score = Math.round(player.score);
      
      topList.push({
        score:       score,
        currentGame: true,
        playerID:    player.id,
      });
    }
    
    topList.sort((a, b) => b.score - a.score);
    
    for (let i = 0; i < topList.length; i++) {
      if (topList[i].currentGame || i < 3) {
        results[i + 1] = topList[i];
      }
    }
    
    this.results = results;
  }
}