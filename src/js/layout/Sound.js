import {Howl, Howler} from 'howler';

export default class Sound {
  constructor() {
    this.musicActive = null;
    this.soundActive = null;
    
    this.musicVolume           = 0.3;
    this.soundVolume           = 0.5;
    this.snakesCollisionVolume = 1;
    
    this.music = new Howl({
      src:    ['sounds/music.mp3'],
      loop:   true,
      volume: this.musicVolume,
    });
    
    this.click = new Howl({
      src:    ['sounds/click.mp3'],
      volume: this.soundVolume,
    });
    
    this.rabbitEaten = new Howl({
      src:    ['sounds/rabbit-eaten.mp3'],
      volume: this.soundVolume,
    });
    
    this.snakesCollision = new Howl({
      src:    ['sounds/snakes-collision.mp3'],
      volume: this.snakesCollisionVolume,
    });
    
    this.getBonus = new Howl({
      src:    ['sounds/get-bonus.mp3'],
      volume: this.soundVolume,
    });
    
    this.bonusEnd = new Howl({
      src:    ['sounds/bonus-end.mp3'],
      volume: this.soundVolume,
    });
    
    this.bonusError = new Howl({
      src:    ['sounds/bonus-error.mp3'],
      volume: this.soundVolume,
    });
  }
  
  play(eventName) {
    this[eventName].play();
  }
  
  stop(eventName) {
    this[eventName].stop();
  }
  
  toggleMusic() {
    if (this.musicActive) {
      this.music.fade(this.music.volume(), 0.0, 300);
      this.musicActive = false;
      window.localStorage.setItem('music', false);
    } else {
      this.music.fade(0.0, this.musicVolume, 300);
      this.musicActive = true;
      window.localStorage.setItem('music', true);
    }
  }
  
  toggleSound() {
    if (this.soundActive) {
      this.click.fade(this.click.volume(), 0.0, 300);
      this.snakesCollision.fade(this.snakesCollision.volume(), 0.0, 300);
      this.rabbitEaten.fade(this.rabbitEaten.volume(), 0.0, 300);
      this.getBonus.fade(this.getBonus.volume(), 0.0, 300);
      this.bonusEnd.fade(this.bonusEnd.volume(), 0.0, 300);
      this.bonusError.fade(this.bonusError.volume(), 0.0, 300);
      
      this.soundActive = false;
      window.localStorage.setItem('sound', false);
    } else {
      this.click.fade(0.0, this.soundVolume, 300);
      this.snakesCollision.fade(0.0, this.snakesCollision.volume(), 300);
      this.rabbitEaten.fade(0.0, this.soundVolume, 300);
      this.getBonus.fade(0.0, this.soundVolume, 300);
      this.bonusEnd.fade(0.0, this.soundVolume, 300);
      this.bonusError.fade(0.0, this.soundVolume, 300);
      
      this.soundActive = true;
      window.localStorage.setItem('sound', true);
    }
  }
}