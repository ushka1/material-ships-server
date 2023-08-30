import socketio from 'socket.io';

import { logger } from 'config/logger';
import { IUser, User } from 'models/User';
import { ExtendedSocket } from 'router/middleware';
import { emitErrorNotification } from 'services/notificationService';
import { removeUserFromPool } from 'services/poolService';
import { removeUserFromRoom } from 'services/roomService';

/* ========================= CONNECT ========================= */

/**
 * Find user using the userId query param in the handshake.
 */
export async function findUserFromHandshake(
  socket: ExtendedSocket,
): Promise<IUser | void> {
  const userId = socket.handshake.query.userId as string;

  if (userId) {
    try {
      const user = await User.findById(userId).orFail().exec();
      logger.info('User found from handshake.', { socket, user });
      return user;
    } catch (e) {
      logger.error('Error while finding user from handshake.', {
        socket,
        error: e,
      });
    }
  }

  logger.error('User not found from handshake.', { socket });
}

/**
 * Create new user.
 */
export async function createNewUser(socket: ExtendedSocket): Promise<IUser> {
  const user = await User.create({
    socketId: socket.id,
  });

  logger.info('New user created.', { socket, user });
  return user;
}

export async function connectUser(user: IUser, socket: ExtendedSocket) {
  user.socketId = socket.id;
  await user.save();

  logger.info('User connected.', { socket, user });
}

/* ========================= DISCONNECT ========================= */

/**
 * Disconnect another active session of the user.
 */
export async function disconnectUserFromAnotherSession(
  user: IUser,
  socket: ExtendedSocket,
  io: socketio.Server,
) {
  logger.info('Another active session found.', { socket });

  const otherSocket = io.sockets.sockets.get(user.socketId!);
  if (otherSocket) {
    emitErrorNotification(otherSocket, {
      content: 'You connected from another place, this session will be closed.',
    });

    try {
      // deactivate other socket (disconnect controller must be disabled to avoid issues)
      otherSocket.removeAllListeners();
      otherSocket.disconnect();

      // perform standard disconnection cleanup
      await disconnectUserCleanup(user, io);
      await disconnectUser(user, socket);
    } catch (e) {
      logger.error('Error while disconnecting another active session.', {
        socket,
        error: e,
      });
    }
  }

  logger.info('Another active session closed.', { socket });
}

export async function disconnectUserCleanup(user: IUser, io: socketio.Server) {
  if (user.inRoom) {
    await removeUserFromRoom(user, io);
  }
  if (user.inPool) {
    await removeUserFromPool(user);
  }
}

export async function disconnectUser(user: IUser, socket: ExtendedSocket) {
  user.socketId = undefined;
  await user.save();

  logger.info('User disconnected.', { socket, user });
}
