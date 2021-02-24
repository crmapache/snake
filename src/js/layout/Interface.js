class Section {
  constructor(selector, displayStyle = 'block') {
    this.el            = document.querySelector(selector);
    this.displayStyle  = displayStyle;
    this.toDisactivate = [];
    
    if (!this.el) {
      throw new Error('Section selector is null.');
    }
    
    this.el.style.display = 'none';
  }
  
  activate() {
    this.el.style.display = this.displayStyle;
    this.disactivateOther();
  }
  
  disactivate() {
    this.el.style.display = 'none';
  }
  
  disactivateOther() {
    for (let Section of this.toDisactivate) {
      Section.disactivate();
    }
  }
  
  addToDisactivate(section) {
    this.toDisactivate.push(section);
  }
}

export default class Interface {
  constructor(gameClass) {
    this.gameClass = gameClass;
    
    this.screenWarning = new Section('#screen-warning', 'flex');
    this.menu          = new Section('#menu', 'flex');
    this.game          = new Section('#game', 'flex');
    
    this.menu.addToDisactivate(this.game);
    
    this.game.addToDisactivate(this.menu);
    
    this.screenWarning.addToDisactivate(this.game);
    this.screenWarning.addToDisactivate(this.menu);
    
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
    
    this.createChooseDifficultyButtons();
    
    window.addEventListener('resize', this.checkScreen);
  }
  
  checkScreen() {
    if (window.innerWidth < 1000 || window.innerHeight < 700) {
      this.screenWarning.activate();
    } else {
      this.screenWarning.disactivate();
    }
  }
  
  toMenu() {
    this.menu.activate();
  }
  
  toGame() {
    this.game.activate();
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
    const buttonsWrap = document.querySelector('#choose-difficulty-wrap');
    
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
}