const users: User[] = [];

type User = {
	id: string;
	name: string;
	room: string;
	email: string;
	domain: string;
	clientId: string;
};

export class RoomService {
	domainUsers = (domain: string) =>
		users.filter((user: User) => user.domain === domain);

	addUser = ({ name = '', room = '', domain, ...rest }: User): any => {
		try {
			name = name.trim().toLowerCase();
			room = room.trim().toLowerCase();
			domain = domain.trim().toLowerCase();

			if (!name || !room) return { error: 'Room name required' };

			const { users: roomUsers } = this.getUsersInRoom(room);

			const isDomainCorrect = roomUsers.length
				? roomUsers[0].domain === domain
				: true;

			if (!isDomainCorrect) {
				return { error: 'This room is from different domain' };
			}

			const existingUser = users.find(
				(user: User) => user.room === room && user.name === name
			);

			if (existingUser) return { error: 'User already exists in room' };

			const user = { name, room, domain, ...rest };

			users.push(user);
			return { user };
		} catch (error) {
			return { error: error.message };
		}
	};

	removeUser = (id: string) => {
		try {
			const index = users.findIndex((user: User) => user.clientId === id);

			if (index !== -1) return { user: users.splice(index, 1)[0] };
		} catch (error) {
			return { error: error.message };
		}
	};

	getUser = (id: string) => {
		try {
			const user = users.find((user: User) => user.clientId === id);

			if (!user) {
				return { error: 'User not flund' };
			}

			return { user };
		} catch (error) {
			return { error: error.message };
		}
	};

	getUsersInRoom = (room: string) => {
		try {
			return { users: users.filter((user: User) => user.room === room) };
		} catch (error) {
			return { error: error.message };
		}
	};

	getRooms = (domain: string) => {
		const filteredUsers = domain ? this.domainUsers(domain) : users;

		const roomIds = [
			...new Set(filteredUsers.map((user: User) => user.room)),
		];

		return roomIds.map((room: string) => ({
			room,
			users: this.getUsersInRoom(room).users,
		}));
	};
}
