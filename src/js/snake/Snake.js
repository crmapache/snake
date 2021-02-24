import {key} from '@/js/helpers';

export default class Snake {
  constructor(playerClass) {
    this.playerClass = playerClass;
    this.gameClass   = playerClass.gameClass;
    this.id          = playerClass.id;
    
    this.initialSize = 5;
    this.cells       = [];
    this.direction   = null;
    
    this.bodyKeydownHandler = this.bodyKeydownHandler.bind(this);
    
    document.querySelector('body').addEventListener('keydown', this.bodyKeydownHandler);
  }
  
  born(x, y, direction) {
    const field = this.gameClass.field;
    
    this.direction = direction;
    
    for (let i = 0; i < this.initialSize; i++) {
      let cellX, cellY;
      
      if (direction === 'top') {
        cellX = x;
        cellY = y + i;
      }
      
      if (direction === 'right') {
        cellX = x - i;
        cellY = y;
      }
      
      if (direction === 'bottom') {
        cellX = x;
        cellY = y - i;
      }
      
      if (direction === 'left') {
        cellX = x + i;
        cellY = y;
      }
      
      this.cells.push({
        x: cellX,
        y: cellY,
      });
      
      if (field.cells[key(cellX, cellY)]) {
        field.cells[key(cellX, cellY)].snake = this;
      }
    }
  }
  
  crawl() {
    const defineHeadPositions = () => {
      const maxX = this.gameClass.field.width;
      const maxY = this.gameClass.field.height;
      
      const headX = this.cells[0].x;
      const headY = this.cells[0].y;
      
      let newHeadX, newHeadY;
      
      if (this.direction === 'top') {
        newHeadX = headX;
        newHeadY = headY - 1 < 1 ? maxY : headY - 1;
      }
      
      if (this.direction === 'right') {
        newHeadY = headY;
        newHeadX = headX + 1 > maxX ? 1 : headX + 1;
      }
      
      if (this.direction === 'bottom') {
        newHeadX = headX;
        newHeadY = headY + 1 > maxY ? 1 : headY + 1;
      }
      
      if (this.direction === 'left') {
        newHeadY = headY;
        newHeadX = headX - 1 < 1 ? maxX : headX - 1;
      }
      
      return [newHeadX, newHeadY];
    };
    
    const defineNewSnakeCells = (x, y, snakeAte) => {
      const cells = [];
      
      if (snakeAte) {
        cells.push({x: x, y: y});
        
        for (let i = 0; i < this.cells.length; i++) {
          cells.push({x: this.cells[i].x, y: this.cells[i].y});
        }
      } else {
        for (let i = 0; i < this.cells.length; i++) {
          cells[i] = {};
          
          if (i === 0) {
            cells[i].x = x;
            cells[i].y = y;
          } else {
            cells[i].x = this.cells[i - 1].x;
            cells[i].y = this.cells[i - 1].y;
          }
        }
      }
      
      return cells;
    };
    
    const updateFieldCells = (newSnakeCells) => {
      for (let i = 0; i < newSnakeCells.length; i++) {
        const currentKey = key(newSnakeCells[i].x, newSnakeCells[i].y);
        
        if (this.gameClass.field.cells[currentKey]) {
          this.gameClass.field.cells[currentKey].snake = this;
        }
      }
    };
    
    const cleanOldLastCell = snakeAte => {
      const keyToClean = key(this.cells[this.cells.length - 1].x, this.cells[this.cells.length - 1].y);
      
      if (this.gameClass.field.cells[keyToClean] && !snakeAte) {
        this.gameClass.field.cells[keyToClean].snake = null;
      }
    };
    
    const updateSnakeCells = cells => {
      this.cells = cells;
    };
    
    const isSnakesCollided = (x, y) => {
      return this.gameClass.field.cells[key(x, y)].snake !== null;
    };
    
    const isRabbitEaten = (x, y) => {
      if (this.gameClass.field.cells[key(x, y)].rabbit !== null) {
        this.playerClass.increaceScore(this.gameClass.field.cells[key(x, y)].rabbit.nutritionally);
        
        this.gameClass.field.cells[key(x, y)].rabbit.destroy();
        return true;
      }
      
      return false;
    };
    
    const [x, y]          = defineHeadPositions();
    const snakesCollision = isSnakesCollided(x, y);
    const snakeAte        = isRabbitEaten(x, y);
    
    const newSnakeCells = defineNewSnakeCells(x, y, snakeAte);
    updateFieldCells(newSnakeCells);
    cleanOldLastCell(snakeAte);
    updateSnakeCells(newSnakeCells);
    
    if (snakeAte) {
      this.gameClass.sound.play('rabbitEaten');
    }
    
    if (snakesCollision) {
      this.gameClass.sound.play('snakesCollision');
    }
    
    return !snakesCollision;
  }
  
  changeDirection(e, codes) {
    if (e.keyCode === codes[0] && !['top', 'bottom'].includes(this.direction)) {
      this.direction = 'top';
    }
    
    if (e.keyCode === codes[1] && !['right', 'left'].includes(this.direction)) {
      this.direction = 'right';
    }
    
    if (e.keyCode === codes[2] && !['top', 'bottom'].includes(this.direction)) {
      this.direction = 'bottom';
    }
    
    if (e.keyCode === codes[3] && !['right', 'left'].includes(this.direction)) {
      this.direction = 'left';
    }
  }
  
  bodyKeydownHandler(e) {
    this.changeDirection(e, this.playerClass.controlKeys);
  }
  
  destroy() {
    document.querySelector('body').removeEventListener('keydown', this.bodyKeydownHandler);
    this.gameClass.field.removeSnake(this);
  }
}