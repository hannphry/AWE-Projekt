import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { StoerungSchema } from './stoerung';
import { StoerungController } from './stroerung.controller';
import { StoerungService } from './stoerung.service';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [HttpModule, MongooseModule.forFeature([{name: 'Stoerung', schema: StoerungSchema}])],
  controllers: [StoerungController],
  providers: [StoerungService],
})
export class StoerungModule {
    data!: [];
    //stoerungen!: Stoerung[];
    constructor(private httpService: HttpService){
        //this.getStoerungen();
    }
    /*
    getStoerungen(){
        let data;
        this.httpService.get('http://openservice-test.vrr.de/static03/XML_ADDINFO_REQUEST?outputFormat=JSON&fitlerPublicationStatus=current'
        ).subscribe((obj) =>{
            //console.log(obj);
            this.addStoerungen(obj.data.result);
        });
        //return data;
    }
    addStoerungen(data: any){
        //console.log(data);
        let elem = data[0];
        console.log({
            id: elem.evaNumbers[0].number,
            type: elem.type
        })
        data.forEach(elem => {
            let stoerung: Stoerung = {
                id: elem.evaNumbers[0].number,
                type: elem.type
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