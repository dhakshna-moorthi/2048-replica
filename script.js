class Game2048 {
    constructor() {
        this.grid = Array(4).fill().map(() => Array(4).fill(0));
        this.score = 0;
        this.gridElement = document.querySelector('.grid');
        this.scoreElement = document.getElementById('score');
        this.init();
    }

    init() {
        // Create grid cells
        for (let i = 0; i < 16; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            this.gridElement.appendChild(cell);
        }

        // Add initial tiles
        this.addRandomTile();
        this.addRandomTile();
        this.updateDisplay();

        // Add event listeners
        document.addEventListener('keydown', this.handleInput.bind(this));
        document.getElementById('new-game').addEventListener('click', () => {
            this.reset();
        });
    }

    reset() {
        this.grid = Array(4).fill().map(() => Array(4).fill(0));
        this.score = 0;
        this.addRandomTile();
        this.addRandomTile();
        this.updateDisplay();
    }

    addRandomTile() {
        const emptyCells = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] === 0) {
                    emptyCells.push({x: i, y: j});
                }
            }
        }
        if (emptyCells.length > 0) {
            const {x, y} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.grid[x][y] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    updateDisplay() {
        const cells = document.querySelectorAll('.cell');
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const value = this.grid[i][j];
                const cell = cells[i * 4 + j];
                cell.textContent = value || '';
                cell.setAttribute('data-value', value);
            }
        }
        this.scoreElement.textContent = this.score;
    }

    handleInput(event) {
        let moved = false;
        const oldGrid = JSON.parse(JSON.stringify(this.grid));

        switch(event.key) {
            case 'ArrowUp':
                moved = this.moveUp();
                break;
            case 'ArrowDown':
                moved = this.moveDown();
                break;
            case 'ArrowLeft':
                moved = this.moveLeft();
                break;
            case 'ArrowRight':
                moved = this.moveRight();
                break;
        }

        if (moved) {
            this.addRandomTile();
            this.updateDisplay();
            
            if (this.isGameOver()) {
                alert('Game Over! Your score: ' + this.score);
                this.reset();
            }
        }
    }

    moveLeft() {
        return this.move(row => {
            const newRow = row.filter(cell => cell !== 0);
            for (let i = 0; i < newRow.length - 1; i++) {
                if (newRow[i] === newRow[i + 1]) {
                    newRow[i] *= 2;
                    this.score += newRow[i];
                    newRow.splice(i + 1, 1);
                }
            }
            while (newRow.length < 4) newRow.push(0);
            return newRow;
        });
    }

    moveRight() {
        return this.move(row => {
            const newRow = row.filter(cell => cell !== 0);
            for (let i = newRow.length - 1; i > 0; i--) {
                if (newRow[i] === newRow[i - 1]) {
                    newRow[i] *= 2;
                    this.score += newRow[i];
                    newRow.splice(i - 1, 1);
                    i--;
                }
            }
            while (newRow.length < 4) newRow.unshift(0);
            return newRow;
        });
    }

    moveUp() {
        return this.move(col => {
            const newCol = col.filter(cell => cell !== 0);
            for (let i = 0; i < newCol.length - 1; i++) {
                if (newCol[i] === newCol[i + 1]) {
                    newCol[i] *= 2;
                    this.score += newCol[i];
                    newCol.splice(i + 1, 1);
                }
            }
            while (newCol.length < 4) newCol.push(0);
            return newCol;
        }, true);
    }

    moveDown() {
        return this.move(col => {
            const newCol = col.filter(cell => cell !== 0);
            for (let i = newCol.length - 1; i > 0; i--) {
                if (newCol[i] === newCol[i - 1]) {
                    newCol[i] *= 2;
                    this.score += newCol[i];
                    newCol.splice(i - 1, 1);
                    i--;
                }
            }
            while (newCol.length < 4) newCol.unshift(0);
            return newCol;
        }, true);
    }

    move(callback, isVertical = false) {
        let moved = false;
        const oldGrid = JSON.parse(JSON.stringify(this.grid));

        for (let i = 0; i < 4; i++) {
            const line = isVertical 
                ? this.grid.map(row => row[i])
                : [...this.grid[i]];
            
            const newLine = callback(line);
            
            for (let j = 0; j < 4; j++) {
                if (isVertical) {
                    if (this.grid[j][i] !== newLine[j]) {
                        moved = true;
                        this.grid[j][i] = newLine[j];
                    }
                } else {
                    if (this.grid[i][j] !== newLine[j]) {
                        moved = true;
                        this.grid[i][j] = newLine[j];
                    }
                }
            }
        }

        return moved;
    }

    isGameOver() {
        // Check for empty cells
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] === 0) return false;
            }
        }

        // Check for possible merges
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const current = this.grid[i][j];
                if ((j < 3 && current === this.grid[i][j + 1]) ||
                    (i < 3 && current === this.grid[i + 1][j])) {
                    return false;
                }
            }
        }

        return true;
    }
}

// Start the game
new Game2048(); 