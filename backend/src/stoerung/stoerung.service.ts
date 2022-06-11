//HTTP-Requests:
import { HttpModule, HttpService } from '@nestjs/axios';

import { Injectable } from '@nestjs/common';
import { Model } from "mongoose";
import { InjectModel } from '@nestjs/mongoose';
import { Stoerung, StoerungModel } from './stoerung';

@Injectable()
export class StoerungService {

    constructor(
        @InjectModel('Stoerung') private readonly stoerungModel: Model<Stoerung>,
        private httpService: HttpService
        ){}

    /*stoerungen: Stoerung[] = [
        {
            id: "1",
            type: "Bla"
        },
        {
            id: "2",
            type: "Bli"
        }
    ];*/
    async getStoerungen(): Promise<Stoerung[]>{
        const stoerungen = await this.stoerungModel.find();
        //console.log(stoerungen.length);
        return stoerungen as Stoerung[];
    }

    addStoerung(pStoerung: StoerungModel){
        //console.log(pStoerung);
        const newStoerung = new this.stoerungModel(pStoerung);
        console.log(newStoerung);
        const result = newStoerung.save();
        return { id: pStoerung.id };
    }

    fillStoerungData(){
        this.httpService.get('http://openservice-test.vrr.de/static03/XML_ADDINFO_REQUEST?outputFormat=JSON&fitlerPublicationStatus=current'
        ).subscribe((obj) =>{
            //let data = obj.data.result.splice(0,1000);
            let data = obj.data.result;
            console.log(data)
            //console.log(data);
            let counter = 0;
            data.forEach(elem => {
                //console.log(elem.evaNumbers)
                try{
                    let id = elem.evaNumbers[0].number;
                    let type = elem.type;
                    
                    //Additional attributes:
                        
                    let stoerung = this.stoerungModel.findOne({id: id});
                    if(stoerung != undefined){
                        var newStoerung = new this.stoerungModel({});
                        newStoerung.id = id;
                        newStoerung.type = type;
                        
                        //console.log(newStoerung);
                        newStoerung.save();
                        console.log(`Save ${id}`);
                    }else{
                        console.log("Stoerung already in DB")
                    }
                        //console.log(`Saving stoerung ${newStoerung.id}`);
                }catch{
                    console.log(`Skipping stoerung ${counter}`);
                }
                counter++;
            });
        });
    }

    getAllStoerungen(): any{
        let promise = new Promise(resolve=>{
            this.httpService.get('http://openservice-test.vrr.de/static03/XML_ADDINFO_REQUEST?outputFormat=JSON&fitlerPublicationStatus=current'
            ).subscribe(data=>{
                resolve(data);
            });
        });
        return promise;
    }
}
