document.addEventListener('DOMContentLoaded', () => {
    const generateRandomGrid = () => {
        const grid = Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => 0));

        const isValidValue = (row, col, value) => {
            if (grid[row].includes(value)) {
                return false;
            }

            for (let i = 0; i < 9; i++) {
                if (grid[i][col] === value) {
                    return false;
                }
            }

            const startRow = Math.floor(row / 3) * 3;
            const startCol = Math.floor(col / 3) * 3;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (grid[startRow + i][startCol + j] === value) {
                        return false;
                    }
                }
            }

            return true;
        };

        const removeNumbers = (grid, level) => {
            const totalCells = 9 * 9;
            const cellsToRemove = Math.floor(totalCells * level);
            let cellsRemoved = 0;

            while (cellsRemoved < cellsToRemove) {
                const row = Math.floor(Math.random() * 9);
                const col = Math.floor(Math.random() * 9);

                if (grid[row][col] !== 0) {
                    grid[row][col] = 0;
                    cellsRemoved++;
                }
            }
        };

        const solveSudoku = () => {
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    if (grid[row][col] === 0) {
                        for (let value = 1; value <= 9; value++) {
                            if (isValidValue(row, col, value)) {
                                grid[row][col] = value;
                                if (solveSudoku()) {
                                    return true;
                                }
                                grid[row][col] = 0;
                            }
                        }
                        return false;
                    }
                }
            }
            return true;
        };

        solveSudoku();
        removeNumbers(grid, 0.5); // Sværheds grad

        return grid;
    };

    const validateGrid = (grid) => {
        const isValidSubGrid = (startRow, startCol) => {
            const values = new Set();

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    const value = grid[startRow + i][startCol + j];
                    if (value !== 0) {
                        if (values.has(value)) {
                            return false;
                        }
                        values.add(value);
                    }
                }
            }

            return true;
        };

        const isValidRow = (row) => {
            const values = new Set();

            for (let i = 0; i < 9; i++) {
                const value = grid[row][i];
                if (value !== 0) {
                    if (values.has(value)) {
                        return false;
                    }
                    values.add(value);
                }
            }

            return true;
        };

        const isValidColumn = (col) => {
            const values = new Set();

            for (let i = 0; i < 9; i++) {
                const value = grid[i][col];
                if (value !== 0) {
                    if (values.has(value)) {
                        return false;
                    }
                    values.add(value);
                }
            }

            return true;
        };

        for (let i = 0; i < 9; i++) {
            if (!isValidSubGrid(Math.floor(i / 3) * 3, (i % 3) * 3) ||
                !isValidRow(i) ||
                !isValidColumn(i)
            ) {
                return false;
            }
        }

        return true;
    };

    const grid = generateRandomGrid();
    const closeSudokuButton = document.getElementById('close-sudoku');

    const createSudokuGrid = () => {
        const table = document.getElementById('sudoku-grid');
        for (let i = 0; i < 9; i++) {
            const row = document.createElement('tr');
            for (let j = 0; j < 9; j++) {
                const cell = document.createElement('td');
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'sudoku-cell';

                input.value = grid[i][j] !== 0 ? grid[i][j] : '';

                if (grid[i][j] !== 0) {
                    input.disabled = true;
                }

                input.addEventListener('input', (event) => {
                    const newValue = event.target.value;
                    if (!input.disabled) {
                        grid[i][j] = newValue !== '' ? parseInt(newValue) : 0;
                    } else {
                        event.target.value = grid[i][j];
                    }
                });

                cell.appendChild(input);
                row.appendChild(cell);
            }
            table.appendChild(row);
        }
    };

    const openPopupButton = document.getElementById('open-sudoku-popup');
    const popup = document.getElementById('popup-sudoku');
    const closePopupButton = document.getElementById('close-sudoku');
    const submitButton = document.getElementById('submit-sudoku');

    const openPopup = () => {
        popup.style.display = 'block';
    };

    const closePopup = () => {
        popup.style.display = 'none';
    };

    const clickOutsidePopup = (event) => {
        if (event.target === popup) {
            closePopup();
        }
    };

    const validateAndSubmitGrid = () => {
        if (validateGrid(grid)) {
            alert('Korrekt!');
        } else {
            alert('Forkert!');
        }
    };

    createSudokuGrid();

    closePopupButton.addEventListener('click', closePopup);
    closeSudokuButton.addEventListener('click', closePopup);
    window.addEventListener('click', clickOutsidePopup);
    submitButton.addEventListener('click', validateAndSubmitGrid);
    openPopupButton.addEventListener('click', openPopup);
});