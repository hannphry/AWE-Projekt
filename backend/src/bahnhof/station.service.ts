//HTTP-Requests:
import { HttpModule, HttpService } from '@nestjs/axios';

import { Injectable } from '@nestjs/common';
import { Model } from "mongoose";
import { InjectModel } from '@nestjs/mongoose';
import { Station, StationModel } from './station';

@Injectable()
export class StationService {

    constructor(
        @InjectModel('Station') private readonly stationModel: Model<Station>,
        private httpService: HttpService
        ){}

    /*bahnhoefe: Bahnhof[] = [
        {
            id: "1",
            name: "Test",
            shortcut: "T",
            lon: 1.0,
            lat: 2.0
        },
        {
            id: "2",
            name: "Aachen",
            shortcut: "AA",
            lon: 1.0,
            lat: 2.0
        }
    ];*/
    async getStations(): Promise<Station[]>{
        const stations = await this.stationModel.find();
        //console.log(stations.length);
        return stations as Station[];
    }

    addStation(pStation: StationModel){
        //console.log(pBahnhof);
        const newStation = new this.stationModel(pStation);
        console.log(newStation);
        const result = newStation.save();
        return { id: pStation.id };
    }

    fillStationData(){
        this.httpService.get('https://api.deutschebahn.com/stada/v2/stations',{headers: {
            Authorization: 'Bearer 112d350cb8cb41770e1abf08d88b7ab4',
            Accept: 'application/json'
        }}).subscribe((obj) =>{
            //let data = obj.data.result.splice(0,1000);
            let data = obj.data.result;
            //console.log(data);
            let counter = 0;
            data.forEach(elem => {
                //console.log(elem.evaNumbers)
                try{
                    let id = elem.evaNumbers[0].number;
                    let name = elem.name;
                    let shortcut = elem.ril100Identifiers[0].rilIdentifier
                    let lat = elem.evaNumbers[0].geographicCoordinates.coordinates[0];
                    let lon = elem.evaNumbers[0].geographicCoordinates.coordinates[1];
                    
                    //Additional attributes:
                    let type = elem.productLine.productLine
                    let priceCategory = elem.priceCategory
                    let hasSteplessAccess = true;
                    if(elem.hasSteplessAccess == "yes" || elem.hasSteplessAccess == "partial") hasSteplessAccess = true;
                    else if(elem.hasSteplessAccess == "no") hasSteplessAccess = false;

                    let hasParking = elem.hasParking;
                    let hasBicycleParking = elem.hasBicycleParking;
                    let hasLocalPublicTransport = elem.hasLocalPublicTransport;
                    let hasTaxiRank = elem.hasTaxiRank;
                    let hasCarRental = elem.hasCarRental;
                    let hasWiFi = elem.hasWiFi;
                    let federalState = elem.federalState;
                    let stationManagement = elem.stationManagement.name;
                    let has247service: boolean;
                    
                    try{
                        if(elem.localServiceStaff.availability){
                            let availability = elem.localServiceStaff.availability;
                            if(
                                availability.monday.fromTime == "00:00" && availability.monday.toTime == "24:00" &&
                                availability.tuesday.fromTime == "00:00" && availability.tuesday.toTime == "24:00" &&
                                availability.wednesday.fromTime == "00:00" && availability.wednesday.toTime == "24:00" &&
                                availability.thursday.fromTime == "00:00" && availability.thursday.toTime == "24:00" &&
                                availability.friday.fromTime == "00:00" && availability.friday.toTime == "24:00" &&
                                availability.saturday.fromTime == "00:00" && availability.saturday.toTime == "24:00" &&
                                availability.sunday.fromTime == "00:00" && availability.sunday.toTime == "24:00"
                            ) has247service = true;
                        }
                        else has247service = false;
                    }catch{
                        //console.log("No data on staff availability");
                        has247service = false;
                    }
                        
                    let station = this.stationModel.findOne({id: id});
                    if(station != undefined){
                        var newStation = new this.stationModel({});
                        newStation.id = id;
                        newStation.name = name;
                        newStation.shortcut = shortcut;
                        newStation.lat = lat;
                        newStation.lon = lon;
                        newStation.type = type;
                        newStation.priceCategory = priceCategory;
                        newStation.hasSteplessAccess = hasSteplessAccess;
                        newStation.hasParking = hasParking;
                        newStation.hasBicycleParking = hasBicycleParking;
                        newStation.hasLocalPublicTransport = hasLocalPublicTransport;
                        newStation.hasTaxiRank = hasTaxiRank;
                        newStation.hasCarRental = hasCarRental;
                        newStation.hasWiFi = hasWiFi;
                        newStation.federalState = federalState;
                        newStation.stationManagement = stationManagement;
                        newStation.has247service = has247service;
                        
                        //console.log(newStation);
                        newStation.save();
                        console.log(`Save ${id}`);
                    }else{
                        console.log("Station already in DB")
                    }
                        //console.log(`Saving station ${newStation.id}`);
                }catch{
                    console.log(`Skipping station ${counter}`);
                }
                counter++;
            });
        });
    }

    getAllStationsFromDBAPI(): any{
        let promise = new Promise(resolve=>{
            this.httpService.get('https://api.deutschebahn.com/stada/v2/stations',{headers: {
            Authorization: 'Bearer 112d350cb8cb41770e1abf08d88b7ab4',
            Accept: 'application/json'
            }}).subscribe(data=>{
                resolve(data);
            });
        });
        return promise;
    }
}
