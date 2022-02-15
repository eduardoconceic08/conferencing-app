export interface ISingleRoom {
    id: string;
    roomCode: string;
    roomName?: string;
    owner: string;
    guests?: (string | IUser)[];
}

export interface IUser {
    id?: string;
    _id?: string;
    email: string;
    password: string;
    phone?: string;
    image?: string;
}

export interface IChangePassword {
    currentPassword: string;
    newPassword: string;
}

export interface IMessage {
    message: string;
    author: string;
    date: string;
    isFile: boolean;
}

export interface IUserList {
    email: string;
    socketId: string;
    userId: string;
    _id: string;
}
