"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sunkShip = exports.shipProperlySettled = exports.shipsDefaultArray = exports.shipsDefault = exports.colsLength = exports.rowsLength = void 0;
exports.rowsLength = 10;
exports.colsLength = 10;
exports.shipsDefault = {
    'ship-0': { id: 'ship-0', size: 4, hp: 4 },
    'ship-2': { id: 'ship-2', size: 3, hp: 3 },
    'ship-1': { id: 'ship-1', size: 3, hp: 3 },
    'ship-3': { id: 'ship-3', size: 2, hp: 2 },
    'ship-4': { id: 'ship-4', size: 2, hp: 2 },
    'ship-5': { id: 'ship-5', size: 2, hp: 2 },
    'ship-6': { id: 'ship-6', size: 1, hp: 1 },
    'ship-7': { id: 'ship-7', size: 1, hp: 1 },
    'ship-8': { id: 'ship-8', size: 1, hp: 1 },
    'ship-9': { id: 'ship-9', size: 1, hp: 1 },
};
exports.shipsDefaultArray = Object.keys(exports.shipsDefault).map((key) => {
    return Object.assign({}, exports.shipsDefault[key]);
});
exports.shipProperlySettled = (board, row, col, shipId) => {
    const ship = exports.shipsDefault[shipId];
    let orientation = '';
    if (ship.size === 1) {
        orientation = 'horizontal';
    }
    else {
        if (board[row] &&
            board[row][col + 1] &&
            board[row][col + 1].shipId === shipId) {
            orientation = 'horizontal';
        }
        else if (board[row + 1] &&
            board[row + 1][col] &&
            board[row + 1][col].shipId === shipId) {
            orientation = 'vertical';
        }
        else {
            return false;
        }
    }
    if (orientation === 'horizontal') {
        for (let k = col; k < ship.size + col; k++) {
            if (!board[row] || !board[row][k] || board[row][k].shipId !== shipId) {
                return false;
            }
        }
        for (let k = row - 1; k < row + 2; k++) {
            for (let l = col - 1; l < col + ship.size + 1; l++) {
                if (board[k] &&
                    board[k][l] &&
                    board[k][l].shipId !== shipId &&
                    board[k][l].shipId !== null) {
                    return false;
                }
            }
        }
    }
    else if (orientation === 'vertical') {
        for (let k = row; k < row + ship.size; k++) {
            if (!board[k] || !board[k][col] || board[k][col].shipId !== shipId) {
                return false;
            }
        }
        for (let k = row - 1; k < row + ship.size + 1; k++) {
            for (let l = col - 1; l < col + 2; l++) {
                if (board[k] &&
                    board[k][l] &&
                    board[k][l].shipId !== shipId &&
                    board[k][l].shipId !== null) {
                    return false;
                }
            }
        }
    }
    return true;
};
exports.sunkShip = (board, shipId) => {
    const ship = Object.assign({}, exports.shipsDefault[shipId]);
    let orientation;
    let firstCell;
    for (const row of board) {
        for (const cell of row) {
            if (cell.shipId === ship.id) {
                firstCell = cell;
                break;
            }
        }
        if (firstCell) {
            break;
        }
    }
    if (!firstCell) {
        return;
    }
    if (board[firstCell.row][firstCell.col + 1] &&
        board[firstCell.row][firstCell.col + 1].shipId === ship.id) {
        orientation = 'horizontal';
    }
    else {
        orientation = 'vertical';
    }
    if (orientation === 'horizontal') {
        const firstColumn = firstCell.col - 1;
        const lastColumn = firstCell.col + ship.size;
        const firstRow = firstCell.row - 1;
        const lastRow = firstCell.row + 1;
        for (let col = firstColumn; col < lastColumn + 1; col++) {
            for (let row = firstRow; row < lastRow + 1; row++) {
                if (board[row] && board[row][col]) {
                    board[row][col].hit = true;
                }
            }
        }
    }
    else if (orientation === 'vertical') {
        const firstRow = firstCell.row - 1;
        const lastRow = firstCell.row + ship.size;
        const firstColumn = firstCell.col - 1;
        const lastColumn = firstCell.col + 1;
        for (let row = firstRow; row < lastRow + 1; row++) {
            for (let col = firstColumn; col < lastColumn + 1; col++) {
                if (board[row] && board[row][col]) {
                    board[row][col].hit = true;
                }
            }
        }
    }
};
//# sourceMappingURL=settingUtils.js.map