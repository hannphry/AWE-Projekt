//HTTP-Requests:
import { HttpService } from '@nestjs/axios';

import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { forkJoin, map, merge, mergeAll, mergeMap, Observable, ReplaySubject, Subject, toArray, zip } from 'rxjs';

const { XMLParser, XMLBuilder, XMLValidator} = require("fast-xml-parser");

@Injectable()
export class DelayService {
    constructor(
        private httpService: HttpService,
    ){}
    searchForStation(input: string){
        var subject = new ReplaySubject(1);
        this.httpService.get(`https://api.deutschebahn.com/fahrplan-plus/v1/location/${input}`,{headers: {
            Authorization: 'Bearer 112d350cb8cb41770e1abf08d88b7ab4',
            Accept: 'application/json'
         }}).subscribe(
            obj=>{
                if(obj.data.length > 0){
                    let arr = [];
                    arr.push(obj.data.slice(0,5));
                    subject.next(arr);
                    subject.complete();
                }
            },
            (value: AxiosResponse<any, any>) => console.log('HTTP Error, Id: '+input)
         );
        return subject;
    }

    getDelays(input: string[]){
        var subject = new ReplaySubject(1);
        let results: any[] = [];
        //map
        /*
        input.forEach(id =>{
            this.httpService.get(`https://api.deutschebahn.com/timetables/v1/fchg/${id}`,{headers: {
                Authorization: 'Bearer 112d350cb8cb41770e1abf08d88b7ab4',
                Accept: 'application/json'
            }}).subscribe(
                async obj=>{
                    let values :any [] = [];
                    values.push(await this.parseXml(`${obj.data}`));
                    let name: string = values[0].timetable.$.station
                    let amountDelays = 0;
                    let delayMessages : {id: string,category: string,priority: string,from: string,to: string}[] = [];
                    values[0].timetable.s.forEach((elem: any) =>{
                    if(elem.m){
                        let messages: any[] = elem.m
                        messages.forEach(message => {
                        try{
                            let delayMessage : {id: string,category: string,priority: string,from: string,to: string} = {
                            id: message.$.id,
                            category: message.$.cat,
                            priority: message.$.pr,
                            from: message.$.from,
                            to: message.$.to
                            };
                            delayMessages.push(delayMessage);
                        }catch{
                            console.log("Error")
                        }
                        amountDelays++;
                        })
                    }else{
                        amountDelays++;
                    }
                    });
                    //console.log({name: name, amount: amountDelays, delays: delayMessages.length})
                    results.push({name: name, amount: amountDelays, delays: delayMessages.length});

                    subject.next(results);
                    //subject.complete();
                },
                (value: AxiosResponse<any, any>) => console.log('HTTP Error'),
                () => {
                    //subject.next(results);
                    //console.log(results);
                }
                );
        });
        */


        /*
            this.httpService.get(`https://api.deutschebahn.com/timetables/v1/fchg/${input}`,{headers: {
                Authorization: 'Bearer 112d350cb8cb41770e1abf08d88b7ab4',
                Accept: 'application/json'
             }}).subscribe(
                async obj=>{
                    values.push(await this.parseXml(`${obj.data}`));
                    let name: string = values[0].timetable.$.station
                    let amountDelays = 0;
                    let delayMessages : {id: string,category: string,priority: string,from: string,to: string}[] = [];
                    values[0].timetable.s.forEach((elem: any) =>{
                    if(elem.m){
                        //console.log(elem.m)
                        let messages: any[] = elem.m
                        messages.forEach(message => {
                        try{
                            let delayMessage : {id: string,category: string,priority: string,from: string,to: string} = {
                            id: message.$.id,
                            category: message.$.cat,
                            priority: message.$.pr,
                            from: message.$.from,
                            to: message.$.to
                            };
                            delayMessages.push(delayMessage);
                        }catch{
                            console.log("Error")
                        }
                        amountDelays++;
                        })
                    }else{
                        amountDelays++;
                    }
                    });
                    result = {name: name, amount: amountDelays, delays: delayMessages};
                    //console.log({name: name, amount: amountDelays, delays: delayMessages});
                    
                    //console.log(amountDelays);
                    //this.delaysPerStation.push({name: name, amount: amountDelays, delays: delayMessages});
                    
    
    
                    subject.next(result);
                },
                (value: AxiosResponse<any, any>) => console.log('HTTP Error, '+input)
                );
            })
        */ 
            //subject.complete();
            subject.subscribe(obj=> console.log(obj));
            return subject;
        
        }

    parseXml(input: string) {
        return new Promise((resolve, reject) => {
            var parseString = require('xml2js').parseString
            parseString(input, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    getDelaysOfStations(input: string[]): Observable<any[]>{
        return zip(
            input.flatMap(
              (id) => {
                return this.httpService.get(`https://api.deutschebahn.com/timetables/v1/fchg/${id}`,{headers: {
                    Authorization: 'Bearer 112d350cb8cb41770e1abf08d88b7ab4',
                    Accept: 'application/json'
                    }})
              }
            ),
            (...results) => {
                return results.map(result => result.data);
              }
          )
    }

    getTimeTables(input: string[], evaNo: string, date: string): Observable<any[]>{
        return zip(
            input.flatMap(
              (hour) => {
                this.sleep(1500);
                return this.httpService.get(`https://api.deutschebahn.com/timetables/v1/plan/${evaNo}/${date}/${hour}`,{headers: {
                    Authorization: 'Bearer 112d350cb8cb41770e1abf08d88b7ab4',
                    Accept: 'application/json'
                    }})
              }
            ),
            (...results) => {
                return results.map(result => result.data);
              }
          )
    }

    sleep(milliseconds: number) {
        const date = Date.now();
        let currentDate = null;
        do {
          currentDate = Date.now();
        } while (currentDate - date < milliseconds);
        //console.log("sleep");
      }

}