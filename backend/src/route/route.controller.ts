import { Controller, Get, Param, Body } from "@nestjs/common";
import { AxiosResponse } from "axios";
import { Observable, Subject, tap } from "rxjs";

import { RouteService } from "./route.service";

@Controller('routes')
export class RouteController{
    constructor(
        private routeService: RouteService
    ){}
    

    // GET /location/{name}
    @Get('searchForStation/:input')
    searchForStation(
        @Param('input') input: string
    ){
        //console.log(input);
        return this.routeService.searchForStation(input);
    }

    // GET /arrivalBoard/{id}
    @Get('getArrivalRoutesFromStation/:id/:date')
    getArrivalRoutesFromStation( 
        @Param('id') id: string,
        @Param('date') date: Date 
        ){
        return this.routeService.getArrivalBoardById(id,date);
    }

    // GET /arrivalBoard/{id}
    @Get('getDepartureRoutesFromStation/:id/:date')
    getDepartureRoutesFromStation( 
        @Param('id') id: string,
        @Param('date') date: Date 
        ){
        return this.routeService.getDepartureBoardById(id,date);
    }

    // GET /journeyDetails/{id}
    @Get('details/:id')
    getSelectedDetailsId( @Param('id') id: string ){
        //console.log(id);
        return this.routeService.getTrackByDetailsId(id);
    }

    @Get('getDataWithDetailsIds/:input/:evaId')
    getDataWithDetailsIds( 
        @Param('input') input: string,
        @Param('evaId') evaId: string
        ){
        //console.log(input.split(','));
        return this.routeService.getDataWithDetailsIds(input.split(','), evaId);
    }
}