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

  hasSearched: boolean = false;

  constructor( private routeService: RouteService ) { }

  ngOnInit(): void {
    this.routeService.getRoutes('8000001').subscribe(data=>{
      this.stations = data;
      
    })
  }

  getWithDetailsId(input: string){
    console.log("DetailsId: " + input);

    this.routeService.getDetailsId(input).subscribe(data=>{
      this.track = data;
      console.log("Obj: " + data)
    })

    
  }

}
