import { Controller, Get, Param } from "@nestjs/common";
import { AxiosResponse } from "axios";
import { Observable, Subject, tap } from "rxjs";

import { RouteService } from "./route.service";

@Controller('routes')
export class RouteController{
    constructor(
        private routeService: RouteService
    ){}
    
    @Get(':id')
    getRoutesFromStation( @Param('id') id: string ){
        console.log(id);
        return this.routeService.getArrivalBoardById(id);
    }

    @Get('/details/:id')
    getSelectedDetailsId( @Param('id') id: string ){
        console.log(id);
        this.routeService.getTrackByDetailsId(id);
    }
}