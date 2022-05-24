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
    lat: Number,
    type: String,
    priceCategory : Number,
    hasSteplessAccess : Boolean,
    hasParking :Boolean,
    hasBicycleParking :Boolean,
    hasLocalPublicTransport :Boolean,
    hasTaxiRank : Boolean,
    hasCarRental : Boolean,
    hasWiFi : Boolean,
    federalState : String,
    stationManagement :String,
    has247service: Boolean
});

export interface Station extends mongoose.Document{
    id: string,
    name: string,
    shortcut: string,
    lon: number,
    lat: number,
    type?: string,
    priceCategory ?: number,
    hasSteplessAccess ?: boolean,
    hasParking ?:boolean,
    hasBicycleParking ?:boolean,
    hasLocalPublicTransport ?:boolean,
    hasTaxiRank ?: boolean,
    hasCarRental ?: boolean,
    hasWiFi ?: boolean,
    federalState ?: string,
    stationManagement ?:string,
    has247service?: boolean
}

export interface StationModel{
    id: string,
    name: string,
    shortcut: string,
    lon: number,
    lat: number,
    type?: string,
    priceCategory ?: number,
    hasSteplessAccess ?: boolean,
    hasParking ?:boolean,
    hasBicycleParking ?:boolean,
    hasLocalPublicTransport ?:boolean,
    hasTaxiRank ?: boolean,
    hasCarRental ?: boolean,
    hasWiFi ?: boolean,
    federalState ?: string,
    stationManagement ?:string,
    has247service?: boolean
}