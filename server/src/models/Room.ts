import { Document, model, Model, Schema } from 'mongoose';
import User, { IUser, IUserDocument, userSchema } from './User';
import bcrypt from 'bcrypt';

export interface ICurrentRoomUsers {
    socketId: String;
    email: String;
    userId: Schema.Types.ObjectId;
}

export interface IRoom {
    roomName?: string;
    roomCode: string;
    owner: Schema.Types.ObjectId | IUser | string;
    guests?: (Schema.Types.ObjectId | IUser | string)[];
    currentUsers: ICurrentRoomUsers | any;
}

export interface IRoomDocument extends Document, IRoom {}

const childSchema = new Schema({ socketId: String, email: String, userId: Schema.Types.ObjectId });

const roomSchema: any = new Schema({
    roomName: {
        type: String,
        required: false,
    },
    roomCode: {
        type: String,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    guests: [
        {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
    ],
    currentUsers: [childSchema],
});

export interface IRoomModel extends Model<IRoomDocument> {
    getAllRooms: any;
}

// roomSchema.static('getAllRooms', async function (this: any, userId: string) {
//     const rooms: IRoomDocument[] = await this.find({ owner: userId }).select('id roomName roomCode').exec();
//     rooms.map((room) => ({id: room._id, ...room}))
//     throw new Error('incorrect email');
// },)

export default model<IRoomDocument, IRoomModel>('room', roomSchema);
