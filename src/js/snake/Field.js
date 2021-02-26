import Rabbit        from '@snake/Rabbit';
import Bonus         from '@snake/./Bonus';
import {key, random} from '@/js/helpers';
import constants     from '@/js/constants';

export default class Field {
  constructor(gameClass) {
    this.gameClass = gameClass;
    this.cells     = {};
    this.width     = constants.FIELD_WIDTH;
    this.height    = constants.FIELD_HEIGHT;
  }
  
  init() {
    const field = document.querySelector('#field');
    
    for (let i = 1; i <= this.height; i++) {
      const row = document.createElement('div');
      row.classList.add('row');
      
      for (let j = 1; j <= this.width; j++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.id = key(j, i);
        
        const cellInner = document.createElement('div');
        cellInner.classList.add('cell-inner');
        
        cell.append(cellInner);
        row.append(cell);
        
        this.cells[key(j, i)] = {
          x:      j,
          y:      i,
          snake:  null,
          bonus:  null,
          rabbit: null,
        };
      }
      
      field.append(row);
    }
  }
  
  draw() {
    for (let cellKey in this.cells) {
      const x      = this.cells[cellKey].x;
      const y      = this.cells[cellKey].y;
      const snake  = this.cells[cellKey].snake;
      const rabbit = this.cells[cellKey].rabbit;
      const bonus  = this.cells[cellKey].bonus;
      const angle  = this.cells[cellKey].angle;
      
      const cell      = document.querySelector('#' + key(x, y));
      const cellInner = document.querySelector('#' + key(x, y) + ' > .cell-inner');
      
      if (cell) {
        cellInner.className = 'cell-inner';
        cellInner.innerText = '';
        
        if (snake) {
          cellInner.classList.add('snake-' + snake.id);
          
          if (snake.transparency) {
            cellInner.classList.add('transparent');
          }
        } else if (rabbit) {
          cellInner.classList.add('rabbit-' + rabbit.level);
          cellInner.innerText = Math.floor(rabbit.health);
        } else if (bonus) {
          cellInner.classList.add('bonus-' + bonus.type + '-' + bonus.level);
        }
      }
    }
    
    for (let player of this.gameClass.players) {
      player.bonusesWrapEl.innerHTML = '';
      
      for (let bonusKey in player.bonuses) {
        const type    = player.bonuses[bonusKey].type;
        const level   = player.bonuses[bonusKey].level;
        const counter = player.bonuses[bonusKey].activeTime;
        
        const bonus = document.createElement('div');
        bonus.classList.add('bonus', 'bonus-' + type + '-' + level);
        bonus.innerText = counter;
        player.bonusesWrapEl.append(bonus);
      }
    }
  }
  
  setSnake(snake) {
    const incubator = snake => {
      const direction = (['top', 'right', 'bottom', 'left'])[random(0, 3)];
      let x, y;
      
      if (direction === 'top') {
        x = random(3, this.gameClass.field.width - 2);
        y = this.gameClass.field.height;
      }
      
      if (direction === 'right') {
        x = 1;
        y = random(1, this.gameClass.field.height - 2);
      }
      
      if (direction === 'bottom') {
        x = random(3, this.gameClass.field.width - 2);
        y = 1;
      }
      
      if (direction === 'left') {
        x = this.gameClass.field.width;
        y = random(3, this.gameClass.field.height - 2);
      }
      
      if (this.gameClass.field.cells[key(x, y)].snake !== null) {
        return incubator(snake);
      }
      
      snake.born(x, y, direction);
    };
    
    incubator(snake);
  }
  
  removeSnake(snake) {
    for (let cellKey in this.cells) {
      if (this.cells[cellKey].snake && this.cells[cellKey].snake.id === snake.id) {
        this.cells[cellKey].snake = null;
      }
    }
  }
  
  spewRabbit() {
    let rabbitsOnField = 0;
    
    for (let cellKey in this.cells) {
      if (this.cells[cellKey].rabbit) {
        rabbitsOnField++;
        
        if (rabbitsOnField > this.gameClass.players.length + 1) {
          return;
        }
      }
    }
    
    let level    = this.chooseLevel(1, 5, 100);
    const cell   = this.getFreeCell();
    const rabbit = new Rabbit(level, cell);
    
    cell.rabbit = rabbit;
  }
  
  spewBonus() {
    let bonusesOnField = 0;
    
    for (let cellKey in this.cells) {
      if (this.cells[cellKey].bonus) {
        bonusesOnField++;
        
        if (bonusesOnField >= this.gameClass.players.length) {
          return;
        }
      }
    }
    
    const getBonusName = () => {
      const bonusTypes = [
        {name: 'freeze', range: [1, 3]},
        {name: 'cut', range: [4, 5]},
        {name: 'transparency', range: [6, 15]},
        {name: 'score', range: [31, 100]},
      ];
      
      let name = null;
      
      const typeRangeValue = random(1, 100);
      
      for (let bonusType of bonusTypes) {
        if (typeRangeValue >= bonusType.range[0] && typeRangeValue <= bonusType.range[1]) {
          name = bonusType.name;
        }
      }
      return name;
    };
    
    const cell = this.getFreeCell();
    
    let level   = this.chooseLevel(1, 5, 50);
    const bonus = new Bonus(this.gameClass, getBonusName(), level, cell);
    
    cell.bonus = bonus;
  }
  
  chooseLevel(level, topLevel, n) {
    const isUp = random(1, (n * level) / this.gameClass.difficulty) === 1;
    
    if (level === topLevel || !isUp) {
      return level;
    }
    
    return this.chooseLevel(level + 1, topLevel, n);
  };
  
  getFreeCell() {
    const freeCellsKeys = [];
    
    for (let cellKey in this.cells) {
      const cell = this.cells[cellKey];
      if (cell.snake === null && cell.bonus === null && cell.rabbit === null) {
        freeCellsKeys.push(cellKey);
      }
    }
    
    return this.cells[freeCellsKeys[random(0, freeCellsKeys.length - 1)]];
  }
  
  clean() {
    for (let player of this.gameClass.players) {
      player.snake.destroy();
    }
    
    for (let cellKey in this.cells) {
      if (this.cells[cellKey].bonus) {
        this.cells[cellKey].bonus.removeFromField();
      }
      
      if (this.cells[cellKey].rabbit) {
        this.cells[cellKey].rabbit.destroy();
      }
    }
  }
}