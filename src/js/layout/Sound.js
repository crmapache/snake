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
      src: ['sounds/rabbitEaten.mp3']
    });
    
    this.snakesCollision = new Howl({
      src:    ['sounds/snakesCollision.mp3'],
      volume: 1,
    });
  }
  
  play(eventName) {
    this[eventName].play();
  }
}