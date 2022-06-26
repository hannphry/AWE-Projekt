import { Controller, Get, Param, Body } from "@nestjs/common";
import { AxiosResponse } from "axios";
import { Observable, Subject, tap } from "rxjs";

import { RouteService } from "./route.service";

@Controller('routes')
export class RouteController{
    constructor(
        private routeService: RouteService
    ){}
    
    @Get('getRoutesFromStation/:id/:date')
    getRoutesFromStation( 
        @Param('id') id: string,
        @Param('date') date: Date 
        ){
        return this.routeService.getArrivalBoardById(id,date);
    }

    

    @Get('searchForStation/:input')
    searchForStation(
        @Param('input') input: string
    ){
        //console.log(input);
        return this.routeService.searchForStation(input);
    }

    // GET /journeyDetails/{id}
    @Get('details/:id')
    getSelectedDetailsId( @Param('id') id: string ){
        //console.log(id);
        return this.routeService.getTrackByDetailsId(id);
    }
}