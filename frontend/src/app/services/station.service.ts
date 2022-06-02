import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Station } from "../interfaces/station";
import { environment } from "src/environments/environment";
import { Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class StationService{
    constructor(private httpClient: HttpClient){}

    getStations(): Observable<Station[]>{
        return this.httpClient.get<Station[]>(`${environment.apiUrl}/stations`);

    }
}


/*result.subscribe({
            error: (e) => alert(e.message),
            next: (data) => {
                let res: Station[] = [];
                data.forEach(obj=>{
                    if(obj.name.includes("Hbf")){
                        res.push(obj);
                    }
                    //return result;
                });
                //console.log(res);
                return res;
            },
            complete: () => console.log("ey")
        }
        )*/