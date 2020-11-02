import { ExtSocket } from '../routes/index';
import { Socket } from '../utils/Socket';
import { changeTurn } from './turn';

import Player from '../models/Player';
import Room from '../models/Room';
import { GameResponse } from '../utils/responses';

export const handleGame = async function (
  this: ExtSocket,
  coords: { row: number; col: number },
) {
  const { io } = Socket.getInstance();
  const room = await Room.findById(this.roomId);

  try {
    if (!room || !io) {
      throw new Error('An unexpected error occurred.');
    }

    if (room.turn !== this.turnId) {
      return;
    }

    const enemyId = room.players.find((id) => id.toString() !== this.playerId);
    const enemy = await Player.findById(enemyId);

    if (!enemy) {
      throw new Error('An unexpected error occurred.');
    }

    const playerSocket = this;
    const enemySocket = io.sockets.connected[enemy.socketId]!;

    const shipHitted = await enemy.handleHit(coords.row, coords.col);

    const enemyBoard = enemy.board?.map((row) => {
      return row.map(({ id, row, col, shipId, hit }) => {
        return {
          id,
          row,
          col,
          shipId: !!(shipId && hit),
          hit,
        };
      });
    });

    const playerBoard = enemy.board?.map((row) => {
      return row.map(({ id, row, col, shipId, hit }) => {
        return {
          id,
          row,
          col,
          shipId,
          hit,
        };
      });
    });

    playerSocket.emit('game-controller', { enemyBoard });
    enemySocket.emit('game-controller', { playerBoard });

    const enemyHasShips = enemy.hasShips();

    if (!enemyHasShips) {
      playerSocket.emit('game-controller', { gameOver: { win: true } });
      enemySocket.emit('game-controller', { gameOver: { win: false } });
      return;
    }

    if (shipHitted) {
      playerSocket!.emit('game-controller', { unlock: true });
    } else {
      await changeTurn(this.roomId!);
      enemySocket!.emit('game-controller', { unlock: true });
    }
  } catch (err) {
    console.log(err);

    console.error('Error in "controllers/game.ts [handleGame]".');

    await room?.populate('players').execPopulate();
    const socketIds = room?.players.map((player) => player.socketId);

    socketIds?.forEach((socketId) => {
      io?.sockets.connected[socketId].error({
        message: 'An unexpected error occurred.',
      });
    });
  }
};