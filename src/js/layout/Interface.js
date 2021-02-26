import constants from '@/js/constants';

class Section {
  constructor(selector, displayStyle = 'flex') {
    this.el           = document.querySelector(selector);
    this.displayStyle = displayStyle;
    this.toDeactivate = [];
    
    if (!this.el) {
      throw new Error('Section selector is null.');
    }
    
    this.el.style.display = 'none';
  }
  
  activate() {
    this.el.style.display = this.displayStyle;
    this.deactivateOther();
  }
  
  deactivate() {
    this.el.style.display = 'none';
  }
  
  deactivateOther() {
    for (let Section of this.toDeactivate) {
      Section.deactivate();
    }
  }
  
  addToDeactivate(section) {
    this.toDeactivate.push(section);
  }
}

export default class Interface {
  constructor(gameClass) {
    this.gameClass = gameClass;
    
    this.screenWarning = new Section('#screen-warning');
    this.menu          = new Section('#menu');
    this.game          = new Section('#game');
    this.pauseMenu     = new Section('#pause-menu');
    this.endMenu       = new Section('#end-menu');
    
    this.menu.addToDeactivate(this.game);
    
    this.game.addToDeactivate(this.menu);
    
    this.checkScreen = this.checkScreen.bind(this);
    
    this.playersChoosed = false;
  }
  
  init() {
    this.checkScreen();
    this.menu.activate();
    
    const shoosePlayer1   = document.querySelector('#player-1');
    const shoosePlayer2   = document.querySelector('#player-2');
    const shoosePlayer3   = document.querySelector('#player-3');
    const menuStartButton = document.querySelector('#menu-start-button');
    const playAgainButton = document.querySelector('#play-again');
    const goToMenuButton  = document.querySelector('#go-to-menu');
    
    shoosePlayer1.addEventListener('click', () => {
      this.shoosePlayerButtonClickHandler(shoosePlayer1, menuStartButton, 1);
    });
    
    shoosePlayer2.addEventListener('click', () => {
      this.shoosePlayerButtonClickHandler(shoosePlayer2, menuStartButton, 2);
    });
    
    shoosePlayer3.addEventListener('click', () => {
      this.shoosePlayerButtonClickHandler(shoosePlayer3, menuStartButton, 3);
    });
    
    menuStartButton.addEventListener('click', () => {
      if (this.playersChoosed) {
        this.gameClass.sound.play('click');
        this.toGame();
        this.gameClass.start();
      }
    });
    
    playAgainButton.addEventListener('click', () => {
      this.gameClass.field.clean();
      
      for (let player of this.gameClass.players) {
        player.cleanBonuses();
        player.snake.destroy();
        player.createSnake();
        player.score = 0;
        player.picks = 0;
      }
      
      this.endMenu.deactivate();
      this.gameClass.start();
    });
    
    goToMenuButton.addEventListener('click', () => {
      this.gameClass.field.clean();
      
      for (let player of this.gameClass.players) {
        player.destroy();
      }
      
      this.gameClass.players    = [];
      this.gameClass.difficulty = constants.DEFAULT_DIFFICULTY;
      this.gameClass.state      = null;
      this.gameClass.results    = null;
      
      menuStartButton.classList.add('disabled');
      shoosePlayer1.classList.remove('active');
      shoosePlayer2.classList.remove('active');
      shoosePlayer3.classList.remove('active');
      
      this.createChooseDifficultyButtons();
      
      this.endMenu.deactivate();
      this.menu.activate();
    });
    
    this.createChooseDifficultyButtons();
    
    window.addEventListener('resize', this.checkScreen);
    
    window.addEventListener('keydown', e => {
      if (e.keyCode === constants.SPACE_KEYCODE) {
        if (this.gameClass.state === 'play') {
          this.gameClass.pause();
          this.pauseMenu.activate();
        } else if (this.gameClass.state === 'pause') {
          this.gameClass.start();
          this.pauseMenu.deactivate();
        }
      }
    });
    
    this.initMusicButton();
    this.initSoundButton();
  }
  
  checkScreen() {
    if (window.innerWidth < 1000 || window.innerHeight < 700) {
      this.screenWarning.activate();
    } else {
      this.screenWarning.deactivate();
    }
  }
  
  toMenu() {
    this.menu.activate();
  }
  
  toGame() {
    this.game.activate();
  }
  
  openEndMenu() {
    this.endMenu.activate();
    
    const topListWrap     = document.querySelector('#top-list-wrap');
    topListWrap.innerHTML = '';
    
    const results = [];
    
    for (let key in this.gameClass.results) {
      results[key] = this.gameClass.results[key];
    }
    
    for (let i = 0; i < results.length; i++) {
      if (results[i]) {
        const topItem = document.createElement('div');
        topItem.classList.add('top-item');
        
        if (results[i].playerID !== null) {
          topItem.classList.add('player-' + results[i].playerID);
        }
        
        const itemTitle = document.createElement('div');
        itemTitle.classList.add('item-title');
        itemTitle.innerText = i;
        
        const itemScoreValue = document.createElement('div');
        itemScoreValue.classList.add('item-score-value');
        itemScoreValue.innerText = results[i].score;
        
        topItem.append(itemTitle);
        topItem.append(itemScoreValue);
        topListWrap.append(topItem);
        
        if (i === 3 && results.length > 4) {
          const topListDivider = document.createElement('div');
          topListDivider.classList.add('top-list-divider');
          topListDivider.innerText = '...';
          
          topListWrap.append(topListDivider);
        }
      }
    }
  }
  
  shoosePlayerButtonClickHandler(el, menuStartButton, n) {
    this.gameClass.sound.play('click');
    el.classList.toggle('active');
    this.gameClass.togglePlayer(n);
    
    if (this.gameClass.players.length < 1) {
      this.playersChoosed = false;
      menuStartButton.classList.add('disabled');
    } else {
      this.playersChoosed = true;
      menuStartButton.classList.remove('disabled');
    }
  }
  
  createChooseDifficultyButtons() {
    const buttonsWrap     = document.querySelector('#choose-difficulty-wrap');
    buttonsWrap.innerHTML = '';
    
    for (let i = 1; i <= 20; i++) {
      const button = document.createElement('div');
      button.classList.add('choose-difficulty-button');
      button.id = 'choose-difficulty-button-' + i;
      
      if (i <= this.gameClass.difficulty) {
        button.classList.add('active');
      }
      
      button.addEventListener('click', () => {
        this.gameClass.sound.play('click');
        
        this.gameClass.difficulty = i;
        
        const buttons = Array.from(document.querySelectorAll('.choose-difficulty-button'));
        
        for (let j = 1; j <= buttons.length; j++) {
          if (j <= i) {
            buttons[j - 1].classList.add('active');
          } else {
            buttons[j - 1].classList.remove('active');
          }
        }
      });
      
      button.addEventListener('mouseover', () => {
        const buttons = Array.from(document.querySelectorAll('.choose-difficulty-button'));
        
        for (let j = 1; j <= buttons.length; j++) {
          if (j <= i) {
            buttons[j - 1].classList.add('hovered');
          }
        }
      });
      
      button.addEventListener('mouseout', () => {
        const buttons = Array.from(document.querySelectorAll('.choose-difficulty-button'));
        
        for (let j = 1; j <= buttons.length; j++) {
          if (j <= i) {
            buttons[j - 1].classList.remove('hovered');
          }
        }
      });
      
      buttonsWrap.append(button);
    }
  }
  
  initMusicButton() {
    const musicButton = document.querySelector('#music-button');
    let isMusicActive = window.localStorage.getItem('music');
    
    if (isMusicActive === undefined || isMusicActive === 'true') {
      window.localStorage.setItem('music', true);
      musicButton.classList.add('active');
      this.gameClass.sound.musicActive = true;
    } else if (isMusicActive === 'false') {
      this.gameClass.sound.music.volume(0);
      this.gameClass.sound.musicActive = false;
      musicButton.classList.remove('active');
    }
    
    musicButton.addEventListener('click', e => {
      musicButton.classList.toggle('active');
      this.gameClass.sound.toggleMusic();
    });
  }
  
  initSoundButton() {
    const soundButton = document.querySelector('#sound-button');
    let isSoundActive = window.localStorage.getItem('sound');
    
    if (isSoundActive === undefined || isSoundActive === 'true') {
      window.localStorage.setItem('sound', true);
      soundButton.classList.add('active');
      this.gameClass.sound.soundActive = true;
    } else if (isSoundActive === 'false') {
      this.gameClass.sound.music.volume(0);
      this.gameClass.sound.click.volume(0);
      this.gameClass.sound.snakesCollision.volume(0);
      this.gameClass.sound.rabbitEaten.volume(0);
      this.gameClass.sound.getBonus.volume(0);
      this.gameClass.sound.bonusEnd.volume(0);
      this.gameClass.sound.bonusError.volume(0);
      this.gameClass.sound.soundActive = false;
      soundButton.classList.remove('active');
    }
    
    soundButton.addEventListener('click', e => {
      soundButton.classList.toggle('active');
      this.gameClass.sound.toggleSound();
    });
  }
}