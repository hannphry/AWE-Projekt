import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { RouteController } from "./route.controller";
import { RouteService } from "./route.service";

@Module({
    imports: [HttpModule],
    controllers: [RouteController],
    providers: [RouteService]
})
export class RouteModule{
    constructor(){}
}