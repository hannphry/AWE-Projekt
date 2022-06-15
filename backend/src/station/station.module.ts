import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { StationSchema } from './station';
import { StationController } from './station.controller';
import { StationService } from './station.service';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [HttpModule, MongooseModule.forFeature([{name: 'Station', schema: StationSchema}])],
  controllers: [StationController],
  providers: [StationService],
})
export class StationModule {
    data!: [];
    //bahnhoefe!: Bahnhof[];
    constructor(private httpService: HttpService){
        //this.getBahnhoefe();
    }
    /*
    getBahnhoefe(){
        let data;
        this.httpService.get('https://api.deutschebahn.com/stada/v2/stations',{headers: {
            Authorization: 'Bearer 112d350cb8cb41770e1abf08d88b7ab4',
            Accept: 'application/json'
        }}).subscribe((obj) =>{
            //console.log(obj);
            this.addBahnhoefe(obj.data.result);
        });
        //return data;
    }
    addBahnhoefe(data: any){
        //console.log(data);
        let elem = data[0];
        console.log({
            id: elem.evaNumbers[0].number,
            name: elem.name,
            shortcut: '',
            lat: elem.evaNumbers[0].geographicCoordinates.coordinates[0],
            lon: elem.evaNumbers[0].geographicCoordinates.coordinates[0]
        })
        data.forEach(elem => {
            let bahnhof: Bahnhof = {
                id: elem.evaNumbers[0].number,
                name: elem.name,
                shortcut: '',
                lat: elem.evaNumbers[0].geographicCoordinates.coordinates[0],
                lon: elem.evaNumbers[0].geographicCoordinates.coordinates[0]
            }
        });
        //this.data = data;
    
    }*/
}


//npm i --save @nestjs/axios

/*
import { HttpClient, HttpHeaders } from "@angular/common/http";
return this.httpClient.get<Split[]>(`${environment.apiUrl}splits`);/
*/


/**
 * this.httpService.get('https://api.deutschebahn.com/stada/v2/stations').subscribe((data)=>{
 * 
 * })
 * 
 *
*/