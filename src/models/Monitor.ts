import mongoose, { Schema, Document } from "mongoose";

export enum MethodType {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE'
}

const MonitorSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    url: {
        type: String,
        required: true
    },
    methodType: {
        type: String,
        enum: Object.values(MethodType),
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    escalationEmails: {
        type: [String],
        default: []
    },
    escalationTeams: {
        type: [String],
        default: []
    },
    escalationType: {
        type: String,
        enum: ['email', 'slack', 'discord'],
        default: 'email'
    },
    checkInterval: {
        type: Number,
        default: 60
    }
}, {
    timestamps: true
});

export interface IMonitor extends Document {
    name: string;
    url: string;
    methodType: MethodType;
    userId: mongoose.Types.ObjectId;
}

export const Monitor = mongoose.model<IMonitor>('Monitor', MonitorSchema);