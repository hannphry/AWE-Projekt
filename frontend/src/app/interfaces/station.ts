export interface Station{
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