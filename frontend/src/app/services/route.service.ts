import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Station } from "../interfaces/station";
import { environment } from "src/environments/environment";
import { Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class RouteService{
    constructor(private httpClient: HttpClient){}

    getRoutes(id: string){
        return this.httpClient.get<any[]>(`${environment.apiUrl}/routes/${id}`);
    }

    getDetailsId(id: string){
        return this.httpClient.get<any[]>(`${environment.apiUrl}/routes/details/${id}`);
    }

}