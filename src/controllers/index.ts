import { onConnect } from './connect';
import { matchmaking } from './matchmaking';
import { applySetting } from './setting';
import { getTurnId } from './turn';
import { handleGame } from './game';

export interface ExtSocket extends SocketIO.Socket {
  playerId?: string;
  roomId?: string;
  turnId?: number;
}

export default function (socket: ExtSocket) {
  socket.on('connect-player', onConnect);
  socket.on('apply-setting', applySetting);
  socket.on('matchmaking', matchmaking);
  socket.on('turn-controller', getTurnId);
  socket.on('game-controller', handleGame);
}
