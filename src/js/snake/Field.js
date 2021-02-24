import Rabbit        from '@snake/Rabbit';
import Bonus         from '@snake/./Bonus';
import {key, random} from '@/js/helpers';

export default class Field {
  constructor(gameClass) {
    this.gameClass = gameClass;
    this.cells     = {};
    this.width     = 40;
    this.height    = 25;
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
          angle:  0,
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
        } else if (rabbit) {
          cellInner.classList.add('rabbit-' + rabbit.level);
          cellInner.innerText = Math.floor(rabbit.health);
        } else if (bonus) {
        
        }
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
    let level    = this.chooseLevel(1, 5);
    const cell   = this.getFreeCell();
    const rabbit = new Rabbit(level, cell);
    
    cell.rabbit = rabbit;
  }
  
  spewBonus() {
    let level = this.chooseLevel(1, 5);
    
    let type = '';
    
    const cell  = this.getFreeCell();
    const bonus = new Bonus(level, cell, type);
    
    cell.rabbit = rabbit;
  }
  
  chooseLevel(level, topLevel) {
    const isUp = random(1, (100 * level) / this.gameClass.difficulty) === 1;
    
    if (level === topLevel || !isUp) {
      return level;
    }
    
    return this.chooseLevel(level + 1, topLevel);
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
}