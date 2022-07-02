//HTTP-Requests:
import { HttpService } from '@nestjs/axios';

import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { map, Observable, ReplaySubject, Subject, zip } from 'rxjs';

@Injectable()
export class RouteService {
    constructor(
        private httpService: HttpService
        ){}

    // GET /location/{name}
    searchForStation(input: string){
        //console.log("Backend Service with name "+input);
        var subject = new ReplaySubject(1);
        //https://api.deutschebahn.com/fahrplan-plus/v1/location/Berlin
        this.httpService.get(`https://api.deutschebahn.com/fahrplan-plus/v1/location/${input}`,{headers: {
            Authorization: 'Bearer 112d350cb8cb41770e1abf08d88b7ab4',
            Accept: 'application/json'
         }}).subscribe(obj=>{
            if(obj.data.length > 0){
                //console.log(obj.data);
                let arr = [];
                arr.push(obj.data.slice(0,5));
                subject.next(arr);
                subject.complete();
            }
        });
        return subject;
    }    
    
    // GET /arrivalBoard/{id}
    getArrivalBoardById(id: string, date: Date){
            var subject = new ReplaySubject(1);
            this.httpService.get(`https://api.deutschebahn.com/freeplan/v1/arrivalBoard/${id}?date=${date}T13%3A00`,{headers: {
                Authorization: 'Bearer 112d350cb8cb41770e1abf08d88b7ab4',
                Accept: 'application/json'
            }}).subscribe(obj =>{
                let arr: {origin: string, detailsId: string}[]= [];
                let data = obj.data
                if(data){
                    data.forEach(route => {
                        if(route.origin && route.detailsId){
                            route.origin = route.origin.replace('&#x0028;',' (');
                            route.origin = route.origin.replace('&#x0029;',') ');
                            let routeObject: {origin: string, detailsId: string} = {
                                origin: route.origin,
                                detailsId: route.detailsId
                            };
                            if(arr.findIndex(item => item.origin == routeObject.origin) < 0){
                                arr.push(routeObject);
                            }
                        }
                    });
                }
                subject.next(arr);
                subject.complete();
        });
        return subject;
    }

    // GET /departureBoard/{id}
    getDepartureBoardById(id: string, date: Date){
        //console.log("03Test");
        var subject = new ReplaySubject(1);
        this.httpService.get(`https://api.deutschebahn.com/freeplan/v1/departureBoard/${id}?date=${date}T13%3A00`,{headers: {
            Authorization: 'Bearer 112d350cb8cb41770e1abf08d88b7ab4',
            Accept: 'application/json'
        }}).subscribe(obj =>{
            let arr: {name: string, dateTime: string, track: string,detailsId: string}[]= [];
            let data = obj.data
            if(data){
                data.forEach(route => {
                    if(route.name && route.dateTime && route.track && route.detailsId){
                        
                        // hier möchte ich einmal die getArrivalBoardById aufrufen, um die letzte Station als Ziel zu bekommen
                        let routeObject: {name: string, dateTime: string, track: string,detailsId: string} = {
                            
                            name: route.name,
                            dateTime: route.dateTime,
                            track: route.track,
                            detailsId: route.detailsId
                        };
                        //console.log("Obj.:")
                        //console.log(routeObject)
                        arr.push(routeObject);
                        
                    }
                });
            }
            
            subject.next(arr);
            subject.complete();
        });

        return subject;
    }

    // GET /journeyDetails/{id}
    getTrackByDetailsId(id: string){
        //console.log("getTrackByDetailsId");
        var subject = new ReplaySubject(1);
        id = encodeURIComponent(encodeURIComponent(id));
        /*
        let a = new Date();
        let b = new Date();
        a.setHours(15);
        a.setMinutes(30);
        b.setHours(16);
        b.setMinutes(30);

        console.log(b.getTime()-a.getTime());
        */

        this.httpService.get(`https://api.deutschebahn.com/fahrplan-plus/v1/journeyDetails/${id}`,{headers: {
            Authorization: 'Bearer 112d350cb8cb41770e1abf08d88b7ab4',
            Accept: 'application/json'
        }}).subscribe(
            (obj: AxiosResponse<any, any>) => {
                //console.log('HTTP response', value)
                try{
                    if(obj){
                        //console.log("1")
                        let arr: {stopId: string, stopName: string, lat: number, lon: number, depTime:  string, arrTime: String, train: string, type: string, operator: string }[]= [];
                        let data = obj.data
                        if(data){
                            //console.log("2")
                            try{
                                data.forEach(route => {
                                    //console.log("3");
                                    try{
                                        if(route.stopName ){
                                            route.stopName = route.stopName.replace('&#x0028;',' (');
                                            route.stopName = route.stopName.replace('&#x0029;',') ');
                                            let routeObject: {stopId: string, stopName: string, lat: number, lon: number, depTime:  string, arrTime: string, train: string, type: string, operator: string } = {
                                                stopId: route.stopId,
                                                stopName: route.stopName,
                                                lat: route.lat,
                                                lon: route.lon,
                                                depTime: route.depTime,
                                                arrTime: route.arrTime,
                                                train: route.train,
                                                type: route.type,
                                                operator: route.operator
                                            };
                                            
                                            arr.push(routeObject);
                                        }
                                    }catch{
                                        //console.log("Error 3");
                                    }
                                });
                            }catch{
                                //console.log("Error 2");
                            }
                        }
            
                        subject.next(arr);
                        subject.complete();
                    }
                }catch{
                    console.log("Error?")
                }
            },
            (value: AxiosResponse<any, any>) => console.log('HTTP Error, Id: '+id)

                /*
            }*/
    
                
        );
    return subject;
    }

    getDataWithDetailsIds(input: string[], evaId: string){
        return zip(
            input.flatMap(
              (id) => {
                console.log(id);
                id = encodeURIComponent(encodeURIComponent(id));
                return this.httpService.get(`https://api.deutschebahn.com/fahrplan-plus/v1/journeyDetails/${id}`,{headers: {
                    Authorization: 'Bearer 112d350cb8cb41770e1abf08d88b7ab4',
                    Accept: 'application/json'
                    }})
              }
            ),
            (...results) => {
                return results.map(result => {
                    //console.log(result);
                    let index = result.data.findIndex(obj =>{ `${obj.stopId}` == evaId})
                    if(index >= 0){
                        let res = {
                            id : result.data[index].stopId,
                            name : result.data[index].train,
                            time : result.data[index].arrTime,
                            nextStation: result.data[index+1].stopName,
                            lastStation: result.data[result.data.length -1].stopName
                        }
                        return res;
                    }
                    else return result.data
                });
              }
          )
    }
}