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

import { RoomServer } from './room/room.server';

const roomServer = new RoomServer();

@WebSocketGateway()
export class AppGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;

	private logger: Logger = new Logger('AppGateway');

	private emitError(client: Socket, on: string, message: string) {
		client.emit('issue', { on, message });
	}

	private emitRooms(domain: string) {
		const rooms = roomServer.getRooms(domain);

		this.server.to(domain).emit('rooms', rooms);
	}

	private leaveServer(client: Socket) {
		const { user } = roomServer.removeUser(client.id) ?? {};

		if (user) {
			this.server.to(user.room).emit('message', {
				user: { name: 'bot' },
				text: `${user.name} has left.`,
			});

			const { users = [] } = roomServer.getUsersInRoom(user.room);

			this.server.to(user.room).emit('roomData', {
				room: user.room,
				message: `${user.name} left!`,
				users: users,
			});

			this.emitRooms(user.domain);
		}
	}

	afterInit() {
		this.logger.log('WebSocket up and running');
	}

	@SubscribeMessage('init')
	initHandler(client: Socket, payload: any) {
		const { email } = payload;

		if (!email) {
			this.emitError(
				client,
				'init',
				'Email address not provided for initialization, disconnecting client'
			);

			client.disconnect();
		}
		const domain = email.split('@')[1];
		client.join(domain);

		this.emitRooms(domain);
	}

	@SubscribeMessage('join')
	joinHandler(client: any, payload: any) {
		try {
			const {
				user: { name = '', id = '', email = '' } = {},
				room,
			} = payload;

			const { error, user } = roomServer.addUser({
				domain: email.split('@')[1],
				clientId: client.id,
				email,
				name,
				room,
				id,
			});

			if (error) {
				return this.emitError(client, 'join', error);
			}

			client.join(user.room);
			client.join(user.domain);

			client.emit('message', {
				user: { name: 'bot' },
				text: `${user.name}, welcome to room ${user.room}.`,
			});

			client.broadcast.to(user.room).emit('message', {
				user: { name: 'bot' },
				text: `${user.name} has joined!`,
			});

			const { users = [] } = roomServer.getUsersInRoom(user.room);

			this.server.to(user.room).emit('roomData', {
				room: user.room,
				users: users,
			});

			this.logger.log(`${email} joined room ${room}`);

			this.emitRooms(user.domain);
		} catch (error) {
			console.trace(error);
		}
	}

	@SubscribeMessage('leave')
	leaveHandler(client: any, payload: any) {
		try {
			const { room } = payload;

			this.leaveServer(client);

			client.leave(room);
		} catch (error) {
			console.trace(error);
		}
	}

	@SubscribeMessage('sendMessage')
	sendMessageHandler(client: any, payload: any) {
		try {
			const { message, timestamp } = payload;

			const { error, user } = roomServer.getUser(client.id);

			if (error) {
				return this.emitError(client, 'sendMessage', error);
			}

			const { room, ...rest } = user;

			this.server.to(room).emit('message', {
				text: message,
				user: rest,
				timestamp,
			});

			this.logger.log(`${message} sent at ${timestamp}`);
		} catch (error) {
			console.trace(error);
		}
	}

	handleConnection(client: Socket, ...args: any[]) {
		this.logger.log(`Client connected: ${client.id} `, ...args);
	}

	handleDisconnect(client: Socket) {
		try {
			this.logger.log(`Client disconnected: ${client.id} `);

			this.leaveServer(client);
		} catch (error) {
			console.trace(error);
		}
	}
}
