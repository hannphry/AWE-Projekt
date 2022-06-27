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
  departure: any[] = [];

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
    this.routeService.getArrivalRoutes(`${input}`, apiDate).subscribe(data=>{
      this.stations = data;
      console.log("Data of interactWithSearchStation")
      console.log(data)
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
        console.log(train.detailsId)
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

  fillDepartureTable(input: number, dateTime:any, name: any, track:any, detailsId:any ){
      
     
      let nextStation: any[] = [];
      let endStation: any[] = [];
     
      

      let rows: any[] = [];
      /*
      this.routeService.getDepartureRoutes(`${input}`, date).subscribe(data=>{
      this.departure = data;
          

      this.departure.forEach( train =>{
        console.log(train.detailsId)
        name.push( train.name)
        let time = new Date(train.dateTime);
        console.log("Time:")
        console.log(time)
        let hours = time.getHours();
        let minutes = time.getMinutes();
        console.log("TEST")
        console.log( minutes )
        dateTime.push( hours + ":" + minutes )
        track.push( train.track)
        detailsId.push( train.detailsId)
      })
      */
      for (let i = 0; i < detailsId.length; i++){
        
          // die nächste und letzte Station der Route holen
        this.routeService.getDetailsId(detailsId[i]).subscribe(data=>{
      
          let stopId: any[] = [];
          let stopName: any[] = [];
    
          data.forEach( route=>{
            stopId.push( route.stopId )
            stopName.push( route.stopName )
          })
    
          endStation.push(stopName[stopName.length]);
    
          for (let i = 0; i < stopId.length; i++){
            if (stopId[i] == input ){
              if ( i == stopId.length -1 ){
                nextStation.push(stopName[stopName.length]);
              }
              nextStation.push(stopName[i+1]);
            }
          }
    
          
          })
      }

      for (let j = 0; j < dateTime.length; j++){
        rows.push([dateTime[j], name[j], nextStation[j], endStation[j], track[j]])
      }
  
      this.departureTable.values = rows;
      console.log( "values:")
      console.log(this.departureTable.values)
    
    
  }


}


