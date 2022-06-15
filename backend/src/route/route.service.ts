//HTTP-Requests:
import { HttpService } from '@nestjs/axios';

import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { map, Observable, ReplaySubject, Subject } from 'rxjs';

@Injectable()
export class RouteService {
    constructor(
        private httpService: HttpService
        ){}
        
        getArrivalBoardById(id: string){
            var subject = new ReplaySubject(1);
            this.httpService.get(`https://api.deutschebahn.com/freeplan/v1/arrivalBoard/${id}?date=2022-06-01T13%3A00`,{headers: {
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



    getTrackByDetailsId(id: string){
        var subject = new ReplaySubject(1);
        this.httpService.get(`https://api.deutschebahn.com/freeplan/v1/journeyDetails/${id}`,{headers: {
            Authorization: 'Bearer 112d350cb8cb41770e1abf08d88b7ab4',
            Accept: 'application/json'
        }}).subscribe(obj =>{

            let arr: {stopId: string, stopName: string, lat: number, lon: number, depTime:  string, train: string, type: string, operator: string }[]= [];
            console.log(obj);
            //let data = obj.data;

/*
if(data){
                data.forEach(route => {
                    if(route.stopName ){
                        route.stopName = route.stopName.replace('&#x0028;',' (');
                        route.stopName = route.stopName.replace('&#x0029;',') ');
                        let routeObject: {stopId: string, stopName: string, lat: number, lon: number, depTime:  string, train: string, type: string, operator: string } = {
                            stopId: route.stopId,
                            stopName: route.stopName,
                            lat: route.lat,
                            lon: route.lon,
                            depTime: route.depTime,
                            train: route.train,
                            type: route.type,
                            operator: route.operator
                        };
                        
                        arr.push(routeObject);
                        
                    }
                });
            }
            subject.next(arr);
            subject.complete();
*/
            
    });
    return subject;
}




}