import { formatDate, getLocaleDateFormat } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChartType } from 'angular-google-charts';
import { Chart } from 'src/app/interfaces/chart';
import { RouteService } from 'src/app/services/route.service';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.scss']
})
export class RoutesComponent implements OnInit {

  stations :any[] = [];
  track :any[] = [];

  searchValue: string = "";
  dateValue: Date = new Date();

  detailsIdLabel: string = "Zugverbindung"

  searchStations: {
    name: string, 
    lon: number, 
    lat: number, 
    id: number
  }[] = [];

  hasSearched: boolean = false;

  constructor( private routeService: RouteService ) { }

  ngOnInit(): void {
    
    //this.searchForStation("Berlin");
  }

  getWithDetailsId(input: string, name: string){
    console.log("DetailsId: " + input);
    this.detailsIdLabel = name;
    this.routeService.getDetailsId(input).subscribe(data=>{
      this.track = data;
      console.log(data);
    })
  }

  searchForStation(input: string){
    //Suche durch Eingabe
    //Suchbegriff an API übergeben
    //ersten 5 Ergebnisse der API anzeigen
    if(input != ""){
      this.routeService.searchForStation(input).subscribe(data=>{
        if(data[0]){
          this.searchStations = data[0];
          //console.log(this.searchStations);
          this.hasSearched = true;
        }else console.log("empty")
      });
    }
  }

  interactWithSearchStation(input:number, date: Date){
    //Dann hier die API mit der ID anfragen, oder?
    //this.getWithDetailsId(`${input}`);)
    let apiDate = date.toISOString().split('T')[0]
    this.routeService.getRoutes(`${input}`, apiDate).subscribe(data=>{
      this.stations = data;
    });
    this.hasSearched = false;
  }


}
