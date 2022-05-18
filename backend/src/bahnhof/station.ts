import * as mongoose from 'mongoose';

/*export interface Bahnhof{
    id: string,
    name: string,
    shortcut: string,
    lon: number,
    lat: number
}*/

export const StationSchema  = new mongoose.Schema({
    id: String,
    name: String,
    shortcut: String,
    lon: Number,
    lat: Number
});

export interface Station extends mongoose.Document{
    id: string,
    name: string,
    shortcut: string,
    lon: number,
    lat: number
}

export interface StationModel{
    id: string,
    name: string,
    shortcut: string,
    lon: number,
    lat: number,
    hasDisabledEntry: boolean
}