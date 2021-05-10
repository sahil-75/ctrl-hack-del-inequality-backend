const users: User[] = [];

type User = {
	id: string;
	name: string;
	room: string;
	clientId: string;
};

export class RoomService {
	addUser = ({ id, clientId, name = '', room = '' }: User): any => {
		try {
			name = name.trim().toLowerCase();
			room = room.trim().toLowerCase();

			const existingUser = users.find(
				(user: User) => user.room === room && user.name === name
			);

			if (!name || !room) return { error: 'Room name required' };

			if (existingUser) return { error: 'User already exists in room' };

			const user = { id, name, room, clientId };

			users.push(user);
			return { user };
		} catch (error) {
			return { error: error.message };
		}
	};

	removeUser = (id: string) => {
		try {
			const index = users.findIndex((user: User) => user.clientId === id);

			if (index !== -1) return users.splice(index, 1)[0];
		} catch (error) {
			return { error: error.message };
		}
	};

	getUser = (id: string) => {
		try {
			return users.find((user: User) => user.clientId === id);
		} catch (error) {
			return { error: error.message };
		}
	};

	getUsersInRoom = (room: string) => {
		try {
			return users.filter((user: User) => user.room === room);
		} catch (error) {
			return { error: error.message };
		}
	};

	getRooms = () => {
		const roomIds = [...new Set(users.map((user: User) => user.room))];

		console.log(roomIds, users);

		return roomIds.map((room: string) => ({
			room,
			users: this.getUsersInRoom(room),
		}));
	};
}
