import {
	OnGatewayInit,
	WebSocketServer,
	SubscribeMessage,
	WebSocketGateway,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import { RoomService } from './room/services/room.services';

const roomService = new RoomService();

@WebSocketGateway()
export class AppGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;

	private logger: Logger = new Logger('AppGateway');

	afterInit() {
		this.logger.log('WebSocket up and running');
	}

	@SubscribeMessage('join')
	joinHandler(client: any, payload: any, callback: any): string {
		try {
			const { user: { name = '', id = '' } = {}, room } = payload;

			console.log(`${name} joined room ${room}`);

			const { error, user } = roomService.addUser({
				clientId: client.id,
				name,
				room,
				id,
			});

			if (error && callback) return callback(error);

			client.join(user.room);

			client.emit('message', {
				user: 'bot',
				text: `${user.name}, welcome to room ${user.room}.`,
			});

			client.broadcast.to(user.room).emit('message', {
				user: 'bot',
				text: `${user.name} has joined!`,
			});

			this.server.to(user.room).emit('roomData', {
				room: user.room,
				users: roomService.getUsersInRoom(user.room),
			});

			this.server.emit('rooms', roomService.getRooms());

			callback && callback();
		} catch (error) {
			console.error(error);
			callback && callback(error);
		}
	}

	@SubscribeMessage('sendMessage')
	sendMessageHandler(client: any, payload: any): string {
		// TODO
		client.emit('message', payload.test);
		return payload + 'Hello world!';
	}

	handleConnection(client: Socket, ...args: any[]) {
		this.logger.log(`Client connected: ${client.id} `, ...args);

		this.server.emit('rooms', roomService.getRooms());
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id} `);
	}
}
