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


  nextStationsWordTree: Chart= {
    title: 'Naheliegende Stationen',
    type: ChartType.LineChart,
    options: {
      colors: [
        '#aecbfc',
        //'#aedcfc',
        //'#aeeafc',
        '#aef2fc',
        //'#aefcf4',
        //'#aefce1',
        '#aefcc3'
      ],
      vAxis: {
        gridlines: {
            color: 'transparent'
        }
      },
      hAxis: {
        gridlines: {
          color: 'transparent'
      }
      }
    },
    
    columns: [],
    
    values: []

  }

  lineChart: Chart= {
    title: 'Zurückgelegte Streck der Verbindung',
    type: ChartType.LineChart,
    options: {
      colors: [
        '#aecbfc',
        //'#aedcfc',
        //'#aeeafc',
        '#aef2fc',
        //'#aefcf4',
        //'#aefce1',
        '#aefcc3'
      ],
      vAxis: {
        gridlines: {
            color: 'transparent'
        }
      },
      hAxis: {
        gridlines: {
          color: 'transparent'
      }
      }
    },
    
    columns: [],
    
    values: []

  }

  departureTable: Chart= {
    title: 'Abfahrtsplan der ausgewählten Station',
    type: ChartType.Table,
    options: {
      colors: [
        '#aecbfc',
        //'#aedcfc',
        //'#aeeafc',
        '#aef2fc',
        //'#aefcf4',
        //'#aefce1',
        '#aefcc3'
      ],
      vAxis: {
        gridlines: {
            color: 'transparent'
        }
      },
      hAxis: {
        gridlines: {
          color: 'transparent'
      }
      }
    },
    
    columns: ["Uhrzeit","Zug","über Station", "Richtung", "Gleis"],
    
    values: [["13:45", "ICE 14", "Weiter 01", "Nach 01", "1"], ["13:56", "RE 15", "Weiter 02", "Nach 02", "6"]]

  }

  timelineChart: Chart= {
    title: 'Fahrplan der ausgewählten Verbindung',
    type: ChartType.Timeline,
    options: {
      colors: [
        '#aecbfc',
        //'#aedcfc',
        //'#aeeafc',
        '#aef2fc',
        //'#aefcf4',
        //'#aefce1',
        '#aefcc3'
      ],
      vAxis: {
        gridlines: {
            color: 'transparent'
        }
      },
      hAxis: {
        gridlines: {
          color: 'transparent'
      }
      }
    },
    
    columns: ["Abfahrt von","Wohin gehts", "Start", "End"],
    
    values: []

  }

  getWithDetailsId(input: string, name: string){
    console.log("DetailsId: " + input);
    this.detailsIdLabel = name;
    this.routeService.getDetailsId(input).subscribe(data=>{
      this.track = data;
      console.log("Data of getWithDetailsId:")
      console.log(data);

      let stops: any[] = [];
      let depTimes: any[] = [];
      let arrTimes: any[] = [];
      let rows: any[] = [];
      
  
      this.track.forEach( stop =>{
        stops.push( stop.stopName)
        depTimes.push( stop.depTime)
        arrTimes.push( stop.arrTime)
      })

      for (let i = 0; i < stops.length - 1; i++){

        if ( i == 0){
          let tempHourDep = depTimes[i].substring(0,2)
          let tempMinDep = depTimes[i].substring(3,5)
          let tempHourArr = arrTimes[i+1].substring(0,2)
          let tempMinArr = arrTimes[i+1].substring(3,5)
          rows.push([stops[i], "nach " + stops[i+1], new Date(2022, 6, 1, tempHourDep, tempMinDep ), new Date(2022, 6, 1, tempHourArr, tempMinArr ) ])
        } else if( i  == stops.length - 1 ){
          let tempHourDep = depTimes[i].substring(0,2)
          let tempMinDep = depTimes[i].substring(3,5)
          let tempHourArr = arrTimes[i+1].substring(0,2)
          let tempMinArr = arrTimes[i+1].substring(3,5)
          rows.push([stops[i], "nach " + stops[i+1], new Date(2022, 6, 1, tempHourDep, tempMinDep ), new Date(2022, 6, 1, tempHourArr, tempMinArr ) ])
        } else{
          let tempHourDep = depTimes[i].substring(0,2)
          let tempMinDep = depTimes[i].substring(3,5)
          let tempHourArr = arrTimes[i+1].substring(0,2)
          let tempMinArr = arrTimes[i+1].substring(3,5)
          rows.push([stops[i], "nach " + stops[i+1], new Date(2022, 6, 1, tempHourDep, tempMinDep ), new Date(2022, 6, 1, tempHourArr, tempMinArr ) ])
        };
        
        //[ 'Aachen',  'nach Köln', new Date(2022, 6, 16, 12, 40), new Date(2022, 6, 16, 12, 50) ],
      }

      // Errechene die Gesamte Fahrtdauer
      let tempHourDep = depTimes[0].substring(0,2)
      let tempMinDep = depTimes[0].substring(3,5)
      let tempHourArr = arrTimes[arrTimes.length-1].substring(0,2)
      let tempMinArr = arrTimes[arrTimes.length-1].substring(3,5)

      let startDate = new Date(2022, 6, 12, tempHourDep, tempMinDep);
      let endDate = new Date(2022, 6, 12, tempHourArr, tempMinArr);
      
      this.timelineChart.values = rows;

      console.log( "values:")
      console.log(this.timelineChart.values)
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
      console.log("Data of interactWithSearchStation")
      console.log(data)
    });
    this.hasSearched = false;
  }


}
