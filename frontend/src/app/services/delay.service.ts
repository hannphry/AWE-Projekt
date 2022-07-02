import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Delay } from "../interfaces/delay";

@Injectable({
    providedIn: 'root'
})
export class DelayService{
    constructor(private httpClient: HttpClient){}

    // GET /location/{name}
    searchForStation(input: string){
        return this.httpClient.get<any[]>(`${environment.apiUrl}/delays/searchForStation/${input}`);
    }

    getDelays(input: number[]){
        //console.log(input);
        return this.httpClient.get<any[]>(`${environment.apiUrl}/delays/getDelays/${input}`);
    }

}