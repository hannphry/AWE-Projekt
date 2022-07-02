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

    // GET /location/{name}
    searchForStation(input: string){
        return this.httpClient.get<any[]>(`${environment.apiUrl}/routes/searchForStation/${input}`);
    }

    // GET /arrivalBoard/{id}
    getArrivalRoutes(id: string, date: string){
        return this.httpClient.get<any[]>(`${environment.apiUrl}/routes/getArrivalRoutesFromStation/${id}/${date}`);
    }

    // GET /departureBoard/{id}
    getDepartureRoutes(id: string, date: string){
        return this.httpClient.get<any[]>(`${environment.apiUrl}/routes/getDepartureRoutesFromStation/${id}/${date}`);
    }

    // GET /journeyDetails/{id}
    getDetailsId(id: string){
        return this.httpClient.get<any[]>(`${environment.apiUrl}/routes/details/${id}`);
    }

    getDataWithDetailsIds(ids: string[], evaId: string){
        return this.httpClient.get<any[]>(`${environment.apiUrl}/routes/getDataWithDetailsIds/${ids}/${evaId}`);
    }

}