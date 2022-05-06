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
        //console.log(bahnhoefe);
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
            let data = obj.data.result.splice(0,1000);
            console.log(data.length);
            data.forEach(elem => {
                try{
                    let id = elem.evaNumbers[0].number;
                    let name = elem.name;
                    let lat = elem.evaNumbers[0].geographicCoordinates.coordinates[0];
                    let lon = elem.evaNumbers[0].geographicCoordinates.coordinates[1];
    
                    if(id != undefined && name != undefined && lat != undefined && lon != undefined){
                        
                        let station = this.stationModel.findOne({id: id});
                        if(station != undefined){
                            var newStation = new this.stationModel({
                                id: id,
                                name: name,
                                shortcut: '',
                                lat: lat,
                                lon: lon
                            });
                            //console.log(newStation);
                            newStation.save();
                        }
                        
                        //console.log(`Saving station ${newStation.id}`);
                    }
                }catch{
                    console.log(`Skipping station ${elem.id}`);
                }

            });
        });
    }


}
