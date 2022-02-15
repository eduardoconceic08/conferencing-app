import { Server, Socket } from 'socket.io';
import { SocketEvent } from '../types/enum';
import roomService from './roomService';

const SocketService = (io: Server): void => {
    io.on(SocketEvent.Connect, (socket: Socket | any) => {
        console.log('Start new connection');

        socket.on('join-room', (roomId: any, peerId: any, userEmail: any, userId: string) => {
            socket.user = userEmail;
            // people[socket.id] = { email: userEmail };
            socket.join(roomId);

            socket.to(roomId).broadcast.emit('user-connected', peerId, userEmail);
            roomService.addUserToConversation(userId, socket.id, userEmail, roomId).then((res) => {
                io.in(roomId).emit('user-list', res);
            });

            socket.on('send-message', (data: any) => {
                socket.to(roomId).emit('receive-message', data);
            });

            socket.on('send-is-typing', (email: string) => {
                socket.to(roomId).emit('receive-is-typing', email);
            });

            socket.on('disconnect', () => {
                roomService.removeUserFromConversation(userId, socket.id, userEmail, roomId).then((res) => {
                    io.in(roomId).emit('user-list', res);
                });
                socket.to(roomId).broadcast.emit('user-disconnected', peerId, userEmail);
            });
        });

        socket.on('disconnect', () => {
            console.log('End connection');
        });
    });
};

export default SocketService;
