import { coerceStringArray } from '@angular/cdk/coercion';
import { formatDate, getLocaleDateFormat } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChartType } from 'angular-google-charts';
import { map, ReplaySubject } from 'rxjs';
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
  departure: any[] = [];

  departureTableValues: any[] = [];

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

  tableRowValues: string[] = ["Uhrzeit","Zug","über Station", "Richtung", "Gleis"];

  constructor( private routeService: RouteService ) { }

  ngOnInit(): void {
    //this.searchForStation("Berlin");
  }

  nextStationsWordTree: Chart= {
    title: 'Naheliegende Stationen',
    type:  "WordTree" as ChartType,
    options: {
      colors: ['black', 'black', 'black'],
          wordtree: {
            format: 'explicit',
            type: 'suffix'
          }
    },
    columns: ['id', 'childLabel', 'parent', 'size'],
    values: [
      [0, 'Life', -1, 1],
      [1, 'Archaea', 0, 1],
      [2, 'Eukarya', 0, 5],
      [3, 'Bacteria', 0, 1]
  ]

  }

  lineChart: Chart= {
    title: 'Zurückgelegte Strecke der Verbindung',
    //subtitle: 'in Km',
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
    
    columns: ["StationsReihenfolge", "Gefahrene Kilometer"],
    
    values: []

  }

  viewDepartureTable : boolean = true;

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
    
    columns: [],
    values: []

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

  deg2rad(deg:number) {
    return deg * (Math.PI/180)
  }

  calculateDistance(lat1: number,lon1: number,lat2: number,lon2: number){
    let R = 6371; // Radius of the earth in km
    let dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    let dLon = this.deg2rad(lon2-lon1); 
    let a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    let d = R * c; // Distance in km
    return d;
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

      let lat: any[] = [];
      let lon: any[] = [];
      
  
      this.track.forEach( stop =>{
        stops.push( stop.stopName)
        depTimes.push( stop.depTime)
        arrTimes.push( stop.arrTime)
        lat.push( stop.lat)
        lon.push( stop.lon)
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
      /*
      let tempHourDep = depTimes[0].substring(0,2)
      let tempMinDep = depTimes[0].substring(3,5)
      let tempHourArr = arrTimes[arrTimes.length-1].substring(0,2)
      let tempMinArr = arrTimes[arrTimes.length-1].substring(3,5)

      let startDate = new Date(2022, 6, 12, tempHourDep, tempMinDep);
      let endDate = new Date(2022, 6, 12, tempHourArr, tempMinArr);
      */
      this.timelineChart.values = rows;

      console.log( "values:")
      console.log(this.timelineChart.values)

      let rowslineChart: any[] = [];
      let countKm = 0;
      for (let j = 0; j < (lat.length - 1); j++){
        console.log( stops[j] + " - " + countKm)
        rowslineChart.push( [ stops[j], countKm ])
        let tempKm = this.calculateDistance(lat[j], lon[j], lat[j+1], lon[j+1]);
        countKm += tempKm;
      }
      console.log(rowslineChart)
      this.lineChart.values = rowslineChart;
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
    this.routeService.getArrivalRoutes(`${input}`, apiDate).subscribe(data=>{
      this.stations = data;
      //console.log("Data of interactWithSearchStation")
      //console.log(data)
    });
    this.hasSearched = false;

    
    this.getDepartureBoardWithDetailsId(input, apiDate);
  }

  getDepartureBoardWithDetailsId(input:number, date: string){
      let dateTime: any[] = [];
      let name: any[] = [];
      let nextStation: any[] = [];
      let endStation: any[] = [];
      let track: any[] = [];
      let detailsId: any[] = [];

      let rows: any[] = [];
      this.routeService.getDepartureRoutes(`${input}`, date).subscribe(data=>{
      this.departure = data;
          

      this.departure.forEach( train =>{
        //console.log(train.detailsId)
        name.push( train.name)
        let time = new Date(train.dateTime);
        let hours = time.getHours();
        let minutes = time.getMinutes();
        dateTime.push( hours + ":" + minutes )
        track.push( train.track)
        detailsId.push( train.detailsId)
      })

    this.fillDepartureTable(input, dateTime, name, track, detailsId) 

    });     
    
  }

  fillDepartureTable(input: number, dateTime:any, name: any, track:any, detailsIds:any ){
      this.departureTable.values = [];
     
      let nextStation: any[] = [];
      let endStation: any[] = [];
      let rows: any[] = [];

      let counter = 0;
      var subject = new ReplaySubject(1);
      let arr: any[] = [];
      detailsIds.forEach((detailsId: string) =>{
        this.routeService.getDetailsId(detailsId).subscribe((data: {
          depTime: string,
          lat: string,
          lon: string,
          operator: string,
          stopId: number,
          stopName: string,
          train: string,
          type: string,
        }[])=>{
          let tDateTime: string = dateTime[counter];
          let tName: string = name[counter];
          let nextStation: string = data[data.findIndex(obj=> obj.stopId == input) +1].stopName;
          let lastStation: string = data[data.length -1].stopName;
          let tTrack: string = track[counter];
          
          this.departureTableValues.push([tDateTime, tName, nextStation, lastStation, tTrack]);
        })
        if((detailsIds.length -1) == detailsIds.findIndex((id: any) => id == detailsId)){
          console.log("last id");
          subject.next(this.departureTableValues);
        }
        //counter++
      });
      subject.subscribe((obj) =>{
        //console.log(obj);
        this.departureTable.values = [];
        let helper: any[] = [];
        helper.push(obj);
        console.log(helper[0]);
        this.departureTableValues = [];
        this.departureTable.values = helper[0];
        this.departureTable.columns = ["Uhrzeit","Zug","über Station", "Richtung", "Gleis"];
        console.log(this.departureTable.values);
        //this.viewDepartureTable = true;
      })
  }


}


