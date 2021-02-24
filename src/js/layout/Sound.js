import {Howl, Howler} from 'howler';

export default class Sound {
  constructor() {
    Howler.volume(0.5);
    
    this.music = new Howl({
      src:    ['sounds/music.mp3'],
      loop:   true,
      volume: 0.3,
    });
    
    this.click = new Howl({
      src: ['sounds/click.mp3']
    });
    
    this.rabbitEaten = new Howl({
      src: ['sounds/rabbit-eaten.mp3']
    });
    
    this.snakesCollision = new Howl({
      src:    ['sounds/snakes-collision.mp3'],
      volume: 1,
    });
    
    this.getBonus = new Howl({
      src: ['sounds/get-bonus.mp3'],
    });
    
    this.bonusEnd = new Howl({
      src: ['sounds/bonus-end.mp3'],
    });
  }
  
  play(eventName) {
    this[eventName].play();
  }
}