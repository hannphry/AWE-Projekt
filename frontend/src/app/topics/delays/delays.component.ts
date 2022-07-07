import { Component, OnInit } from '@angular/core';
import { DelayService } from 'src/app/services/delay.service';
import { Delay } from 'src/app/interfaces/delay';
import { Chart } from 'src/app/interfaces/chart';
import { ChartType } from 'angular-google-charts';
import { delay, ReplaySubject, Subject } from 'rxjs';

@Component({
  selector: 'app-delays',
  templateUrl: './delays.component.html',
  styleUrls: ['./delays.component.scss']
})
export class DelaysComponent implements OnInit {

  searchValue: string = ""

  searchStations: {
    name: string,
    id: number
  }[] = [];

  hasSearched: boolean = false;

  selectedStations: {
    name: string,
    id: number
  }[] = [];

  differrenceDelays: number = 0;

  announcementsPerDelay: number = 0;

  delaysAbove30min: number = 0;

  amountChangedPaths: number = 0;

  delaysPerStation: Delay[] = [];

  sumDelays: number = 0;

  displayMessage: string = "Station auswählen";

  //CHARTS:
  viewColumnChart: boolean = false;
  columnChartValues: any[] = [];
  columnChart: Chart = {
    title: 'Anzahl Änderungen',
    type: ChartType.ColumnChart,
    columns: ['Bahnhof', 'Änderungen', 'Verspätungen'],
    values: [
    ],
    options: {
      colors: [
        //'#badcf7',
        //'#a6c8e3'
        '#dbcffb',
        '#c7bbe7',
        '#b3a7d3'
      ]
    }
  }

  viewBarChart: boolean = false;
  barChartValues: any[] = [];
  barChart: Chart = {
    title: 'Anzahl Meldungen',
    type: ChartType.BarChart,
    columns:['Attribut', 'Menge'],
    values: [
    ],
    options: {
      colors: [
        '#c5ccf9',
        '#b1b8e5',
        '#9da4d1'
      ]
    }
  }
  viewSteppedAreaChart: boolean = false;
  steppedAreaChartValues: any[] = [];
  steppedAreaChart: Chart = {
    title: 'Verspätungen',
    type: ChartType.SteppedAreaChart,
    columns: ['Station','> 30 min', '< 5 min', '< 30 min'],
    values: [
      //['Düsseldorf', 50, 20, 5]
    ],
    options: {
      colors: [
        '#c5ccf9',
        '#b1b8e5',
        '#9da4d1'
      ]
    }
  }

  viewTable: boolean = false;
  table: Chart = {
    title: 'Übersicht',
    type: ChartType.Table,
    columns: ['Ankunft','Abfahrt','Ankunft neu', 'Abfahrt neu', 'Geplanter Weg', 'Geänderter Weg'],
    values: [
      //['10.20','10.25', '10.30', '10.35', 'Düsseldorf, Düsseldorf Ost, West, Berlin', 'Düsseldorf, West, Berlin']
    ],
    options: {
    }
  }

  constructor(
    private delayService: DelayService
  ) { }



  ngOnInit(): void {
  }


  searchForStation(input: string){
    //console.log(input);
    input = this.formatUmlaut(input)
    //console.log(input)
    if(input != ""){
      this.delayService.searchForStation(input).subscribe(
        data=>{
        if(data[0]){
          this.searchStations = data[0];
          //console.log(this.searchStations);
          this.hasSearched = true;
        }else console.log("empty")
      },
      (error) => console.log("Error")
      );
    }
  }

  selectStation(station: {name: string, id: number}){
    if( this.isStationSelected(station.id) == true){
      let findIndex = this.selectedStations.findIndex(stat => stat.id == station.id);
      //console.log(findIndex);
      if(findIndex >= 0){
       this.selectedStations.splice(findIndex, 1);
      }
    }else{
      if(this.selectedStations.length < 1){
        this.selectedStations.push(station);
      }else if(this.selectedStations.length == 1){
        this.selectedStations.shift();
        this.selectedStations.push(station);
      }
      //console.log(station);
    }
    
  }

  isStationSelected(id: number): boolean{
    //findIndex
    let findIndex = this.selectedStations.findIndex(station => station.id == id);
    if(findIndex >= 0){
      return true
    }
    else{
      return false
    }
  }

  isStationSelectedButNotInSearchStations(id: number): boolean{
    let searchIndex = this.searchStations.findIndex(station=> station.id == id)
    if(searchIndex < 0 && this.isStationSelected(id) == true){
      return true;
    }else{
      return false;
    }
  }

  //Kennzahl passt noch nicht, die Verschiebung steht da noch nicht

  compareStations(stations: {name: string, id: number}[]){
    //console.log(stations);
    if(stations.length > 0){
      this.displayMessage = "Station wird ausgewählt...";
      this.hasSearched = false;
      let values: any[] = [];
      var subject = new ReplaySubject(1);
      this.delaysPerStation = [];
      
      let ids: number[] = [];
      stations.forEach(station => ids.push(station.id))

      this.delayService.getDelays(ids).subscribe(
        obj =>{
        this.displayMessage = "Daten werden ausgewertet."
        //let delaysPerStation: any[] = [];

        const parser = new DOMParser();

        for(let objCounter = 0; objCounter < obj.length; objCounter++){
          const xml = parser.parseFromString(obj[objCounter], 'text/xml');
          
          let name: string = ""+xml.children[0].attributes.getNamedItem('station')?.value
          let amountDelays: number = xml.children[0].childElementCount
          
          //console.log(xml);

          //als erstes prüfen, ob trip gecancelt, in delaysObject schmeißen

          let delaysObject : {
            apiInformation: {
              hour: string, //auslesen aus ct des ar
              delays: {
                stopId: string,
                plannedArrival: string,
                changedArrival: string,
                plannedDeparture: string,
                changedDeparture: string,
                plannedPath: string, 
                changedPath: string
              }[]
            }[],
            stops: {
              stopId: string,
              messages: {
                id: string,
                from: string,
                to: string,
                category: string,
                priority: string
              }[],
              arrival: {
                planned: string,
                changed: string,
                plannedPath: string,
                changedPath: string,
                messages: {
                  id: string,
                  from: string,
                  to: string
                }[]
              },
              departure: {
                planned: string,
                changed: string,
                plannedPath: string, 
                changedPath: string,
                messages: {
                  id: string,
                  from: string,
                  to: string
                }[]
              }
            }[],
            evaId: string
          } = {
            apiInformation: [],
            stops : [],
            evaId: `${xml.children[0].getAttribute('eva')}`
          };

          
          
          let delayMessages : {id: string,category: string,priority: string,from: string,to: string}[] = []
  
          let elems = xml.children[0].children;

          //console.log(elems)
          for(let i = 0; i < elems.length; i++){
            let childElem = elems[i].children
            //console.log(childElem);

            //messages nicht vergessen
            
            let tmpStop : {
              stopId: string,
              messages: {
                id: string,
                from: string,
                to: string,
                category: string,
                priority: string
              }[],
              arrival : {
                planned: string,
                changed: string,
                plannedPath: string,
                changedPath: string,
                messages: {
                  id: string,
                  from: string,
                  to: string
                }[]
              },
              departure : {
                planned: string,
                changed: string,
                plannedPath: string, 
                changedPath: string,
                messages: {
                  id: string,
                  from: string,
                  to: string
                }[]
              }
            } = {
              stopId: `${elems[i].getAttribute('id')}`,
              messages : [],
              arrival: {
                changed: '',
                changedPath: '',
                planned: '',
                plannedPath: '',
                messages : []
              },
              departure: {
                changed: '',
                planned : '',
                changedPath: '',
                plannedPath: '',
                messages : []
              }
            };

            for(let j = 0; j < childElem.length; j++){
              //console.log(childElem)

              let tmpAPIInformation: {
                stopId: string,
                plannedArrival: string,
                changedArrival: string,
                plannedDeparture: string,
                changedDeparture: string,
                plannedPath: string, 
                changedPath: string
              } = {
                stopId : tmpStop.stopId,
                plannedArrival: '',
                changedArrival: '',
                plannedDeparture: '',
                changedDeparture: '',
                plannedPath: '',
                changedPath: ''
              }
              if(childElem[j].tagName == "m"){
                //console.log('Message:')
                //console.log(childElem[j])
                let tmpMessage : {
                  id: string,
                  from: string,
                  to: string,
                  category: string,
                  priority: string
                } = {
                  id : `${childElem[j].getAttribute('id')}`,
                  priority : `${childElem[j].getAttribute('pr')}`,
                  category : `${childElem[j].getAttribute('cat')}`,
                  from : `${childElem[j].getAttribute('from')}`,
                  to : `${childElem[j].getAttribute('to')}`
                };
                tmpStop.messages.push(tmpMessage);
              }
              else if(childElem[j].tagName == "ar") {
                //console.log('Arrival:')
                //console.log(childElem[j])
                let tmpArrival : {
                  planned: string,
                  changed: string,
                  plannedPath: string,
                  changedPath: string,
                  messages: {
                    id: string,
                    from: string,
                    to: string
                }[]} = {
                  planned : '',
                  changed: '',
                  plannedPath : '',
                  changedPath : '',
                  messages: []
                };
                //Nur API anfragen, wenn pt bei ar nicht angegeben ist

                let arMessageElements = childElem[j].children;
                // Alle Messages dazu
                for(let k = 0; k < arMessageElements.length; k++){
                  let tmpMessage : {
                    id: string,
                    from: string,
                    to: string,
                    category: string,
                    priority: string
                  } = {
                    id : `${arMessageElements[k].getAttribute('id')}`,
                    priority : `${arMessageElements[k].getAttribute('pr')}`,
                    category : `${arMessageElements[k].getAttribute('cat')}`,
                    from : `${arMessageElements[k].getAttribute('from')}`,
                    to : `${arMessageElements[k].getAttribute('to')}`
                  };
                  tmpArrival.messages.push(tmpMessage);
                }
                // Wenn keine PlannedTime existiert (somit keine Verspätungsberechnung möglich)
                if( !(childElem[j].getAttribute('pt')) || childElem[j].getAttribute('pt') == ""){
                  //API anfragen
                  //console.log("call API")
                  if(childElem[j].getAttribute('ct') != "" && childElem[j].getAttribute('ct') != undefined){
                    let tmpCT = childElem[j].getAttribute('ct')?.substring(6,8);
                    tmpAPIInformation.changedArrival = `${childElem[j].getAttribute('ct')}`;
  
                    let index = delaysObject.apiInformation.findIndex(info => info.hour == tmpCT);
                    if(index >= 0){
                      delaysObject.apiInformation[index].delays.push(tmpAPIInformation)
                    }else{
                      delaysObject.apiInformation.push({
                        hour: `${tmpCT}`,
                        delays : [tmpAPIInformation]
                      });
                    }
                  }
                }
                //Wenn PlannedTime existiert (somit Verspätungsberechnung möglich)
                else if (childElem[j].getAttribute('pt') != ""){
                  //Infos direkt auslesen in tmpArrival schreiben und dann tmpStop hinzufügen
                  //console.log("Don't call API")
                  tmpArrival = {
                    planned: `${childElem[j].getAttribute('pt')}`,
                    changed: `${childElem[j].getAttribute('ct')}`,
                    plannedPath: `${childElem[j].getAttribute('ppth')}`,
                    changedPath: `${childElem[j].getAttribute('cpth')}`,
                    messages: []
                  };
                  tmpStop.arrival = tmpArrival;
                }

                
              }
              else if(childElem[j].tagName == "dp") {
                //console.log('Departure:')
                //console.log(childElem[j])
                let tmpDeparture : {
                  planned: string,
                  changed: string,
                  plannedPath: string,
                  changedPath: string,
                  messages: {
                    id: string,
                    from: string,
                    to: string
                  }[]} = {
                    planned : '',
                    changed: '',
                    plannedPath : '',
                    changedPath : '',
                    messages: []
                  };
                //Nur API anfragen, wenn pt bei ar nicht angegeben ist
                if( !(childElem[j].getAttribute('pt')) || childElem[j].getAttribute('pt') == ""){
                  //API anfragen
                  //nach index mit hour suchen
                  
                  if(childElem[j].getAttribute('ct') != "" && childElem[j].getAttribute('ct') != undefined){
                    let tmpCT = childElem[j].getAttribute('ct')?.substring(6,8);
                    
                    tmpAPIInformation.changedDeparture = `${childElem[j].getAttribute('ct')}`;
                    
                    let index = delaysObject.apiInformation.findIndex(info => info.hour == tmpCT);
                    
                    if(index >= 0){
                      let stopIndex = delaysObject.apiInformation[index].delays.findIndex(delay => delay.stopId == tmpAPIInformation.stopId)
                      if(stopIndex < 0){
                        delaysObject.apiInformation[index].delays.push(tmpAPIInformation)
                      }

                    }else{
                      delaysObject.apiInformation.push({
                        hour: `${tmpCT}`,
                        delays : [tmpAPIInformation]
                      });
                    }
                    
                  }
                  //delaysObject.stops.push()
                  /*
                  hour: string, //auslesen aus ct des ar
                  delays: {
                    stopId: string,
                    plannedArrival: string,
                    changedArrival: string,
                    plannedDeparture: string,
                    changedDeparture: string,
                    plannedPath: string, 
                    changedPath: string
                  }[]
                  */
                }else if (childElem[j].getAttribute('pt') != ""){
                  //Infos direkt auslesen in tmpArrival schreiben und dann tmpStop hinzufügen
                  tmpDeparture = {
                    planned: `${childElem[j].getAttribute('pt')}`,
                    changed: `${childElem[j].getAttribute('ct')}`,
                    plannedPath: `${childElem[j].getAttribute('ppth')}`,
                    changedPath: `${childElem[j].getAttribute('cpth')}`,
                    messages: []
                  };
                }

                let arMessageElements = childElem[j].children;

                for(let k = 0; k < arMessageElements.length; k++){
                  let tmpMessage : {
                    id: string,
                    from: string,
                    to: string,
                    category: string,
                    priority: string
                  } = {
                    id : `${arMessageElements[k].getAttribute('id')}`,
                    priority : `${arMessageElements[k].getAttribute('pr')}`,
                    category : `${arMessageElements[k].getAttribute('cat')}`,
                    from : `${arMessageElements[k].getAttribute('from')}`,
                    to : `${arMessageElements[k].getAttribute('to')}`
                  };
                  tmpDeparture.messages.push(tmpMessage);
                }

                tmpStop.departure = tmpDeparture;
              } 
            }
            delaysObject.stops.push(tmpStop);
          }

          this.displayMessage = "Daten werden ausgewertet.."
          //console.log(delaysObject);

          let hours: string[] = [];
          let tmpHour = new Date().getHours()
          delaysObject.apiInformation.forEach(apiInfo =>{
            if(Number(apiInfo.hour) >= tmpHour){
              hours.push(apiInfo.hour)
            }
          })
          //console.log(hours);
          /*
          for(let hour = new Date().getHours(); hour < (new Date().getHours()+10); hour ++){
            if(hour < 10){
              hours.push("0"+hour);
            }else hours.push(""+hour);
          }
          */
          
          this.delayService.getTimeTables(hours, delaysObject.evaId).subscribe(obj=>{
            //console.log(obj);
            this.displayMessage = "Daten werden ausgewertet..."
            obj.forEach(elem=>{
              const timetable = parser.parseFromString(elem, 'text/xml');
              let stops = timetable.children[0].children;
              //console.log(stops)
              delaysObject.apiInformation.forEach(hourElem =>{
                hourElem.delays.forEach(tDelay =>{
                  let stopId = tDelay.stopId
                  //console.log(stopId);
                  for(let i = 0; i < stops.length; i++){//stop finden
                    if(stops[i].getAttribute('id') == stopId){
                      //console.log(stops[i]);
                      let stopIndex = delaysObject.stops.findIndex(stop => stop.stopId == stopId);
                      let childElems = stops[i].children
                      for(let j = 0; j < childElems.length; j++){
                        if(childElems[j].tagName == 'ar'){
                          delaysObject.stops[stopIndex].arrival.planned = ''+childElems[j].getAttribute('pt');
                          delaysObject.stops[stopIndex].arrival.plannedPath = ''+childElems[j].getAttribute('ppth');
                          //console.log(childElems[j])
                        }
                        if(childElems[j].tagName == 'dp'){
                          delaysObject.stops[stopIndex].departure.planned = ''+childElems[j].getAttribute('pt');
                          delaysObject.stops[stopIndex].departure.plannedPath = ''+childElems[j].getAttribute('ppth');
                          //console.log(childElems[j])
                        }
                      }
                    }
                  }
                })
              })
            })
            
          },
          (err) => {
            console.log(err)
            this.formatGraphData(delaysObject);
          },
          () => {
            this.displayMessage = "Daten werden ausgewertet..."
            //console.log(delaysObject);
            this.formatGraphData(delaysObject)
            this.columnChart.values = this.columnChartValues;
            this.viewColumnChart = true;
          }
          )
          
          let delay: Delay = {
            name: name,
            amount: amountDelays,
            delays: delayMessages
          }
  
          //console.log(delay);

          //this.delaysPerStation.push(delay);
        }

        //console.log(this.delaysPerStation);

        //xml.children[0].childNodes
        
        //console.log(this.delaysPerStation);
        
      });
    }
  }

  //(mouseenter)="this.clickOnInfo(0)" (mouseleave)="this.resetInfo(0)"

  clickOnInfo(index: number){
    let elem = document.getElementById(`graph${index}`);

    if(elem){
      elem.style.boxShadow = '0px 0px 61px -25px #caca03';
    }
  }

  resetInfo(index: number){
    let elem = document.getElementById(`graph${index}`);
    if(elem){
      elem.style.boxShadow = '0px 0px 61px -49px black';
    }
  }

  formatUmlaut(input: string): string{
    input = input.toLowerCase()
    input = input.replace('ä','ae').replace('ö','oe').replace('ü','ue').replace('ß','ss')
    return input;
  }

  formatGraphData(delaysObject: {
    apiInformation: {
      hour: string, //auslesen aus ct des ar
      delays: {
        stopId: string,
        plannedArrival: string,
        changedArrival: string,
        plannedDeparture: string,
        changedDeparture: string,
        plannedPath: string, 
        changedPath: string
      }[]
    }[],
    stops: {
      stopId: string,
      messages: {
        id: string,
        from: string,
        to: string,
        category: string,
        priority: string
      }[],
      arrival: {
        planned: string,
        changed: string,
        plannedPath: string,
        changedPath: string,
        messages: {
          id: string,
          from: string,
          to: string
        }[]
      },
      departure: {
        planned: string,
        changed: string,
        plannedPath: string, 
        changedPath: string,
        messages: {
          id: string,
          from: string,
          to: string
        }[]
      }
    }[],
    evaId: string
  }){
    //console.log("Different function")
    //console.log(delaysObject);
    let amountDelays = 0;
    let amountRealDelays = 0; //changed in Arrival und Departure gepflegt
    let amountEmptyDelays = 0;

    let amountAnnouncements = 0;
    //AmountDelays
    let amountAnnouncementsPerDelay = 0;

    let amountDelaysBelow5 = 0;
    let amountDelaysBelow30 = 0;
    let amountDelaysOver30 = 0;
    this.sumDelays = 0;
    delaysObject.stops.forEach(stop =>{
      amountDelays++;
      if(stop.arrival.changed != "" && stop.departure.changed != ""){
        amountRealDelays++
      }else amountEmptyDelays++

      amountAnnouncements += stop.messages.length;
      amountAnnouncementsPerDelay += stop.messages.length + stop.arrival.messages.length + stop.departure.messages.length

      let diffHours = 0;
      
      let arrHoursChanged = Number(stop.arrival.changed.substring(6,8))
      let arrHoursPlanned = Number(stop.arrival.planned.substring(6,8))
      let arrMinChanged = Number(stop.arrival.changed.substring(8,10))
      let arrMinPlanned = Number(stop.arrival.planned.substring(8,10))

      let depHoursChanged = Number(stop.departure.changed.substring(6,8))
      let depHoursPlanned = Number(stop.departure.changed.substring(6,8))
      let depMinChanged = Number(stop.departure.changed.substring(8,10))
      let depMinPlanned = Number(stop.arrival.changed.substring(8,10))

      if(arrHoursChanged < arrHoursPlanned) /* => 01 < 23 */ {
        arrHoursChanged+= 24;
      }
      if(depHoursChanged < depHoursPlanned){
        depHoursChanged += 24;
      }
      let diffHoursArr = arrHoursChanged - arrHoursPlanned;
      let diffHoursDep = depHoursChanged - depHoursPlanned;

      if(arrMinChanged < arrMinPlanned){ // => :20 < :50
        arrMinChanged += 60;
      }
      if(depMinChanged < depMinPlanned){ // => :20 < :50
        depMinChanged += 60;
      }

      let diffMinArr = arrMinChanged - arrMinPlanned;
      let diffMinDep = depMinChanged - depMinPlanned;

      let diffArr = (diffHoursArr*60)+ diffMinArr  //Unterschied Stunden in Minuten + Minuten //Number(stop.arrival.changed) - Number(stop.arrival.planned)
      let diffDep = (diffHoursDep*60)+ diffMinDep  // Number(stop.departure.changed) - Number(stop.departure.planned)

      if((diffArr < 5|| diffDep < 5) && (diffArr > 0|| diffDep > 0)) amountDelaysBelow5++
      else if((diffArr < 30|| diffDep < 30) && (diffArr >= 5|| diffDep >= 5)) amountDelaysBelow30++
      else if(diffArr >= 30|| diffDep >= 30) amountDelaysOver30++
      if(diffArr > 0) {
        if( 
          stop.arrival.planned != "" && stop.arrival.planned != "null" &&
          stop.arrival.changed != "" && stop.arrival.changed != "null" && 
          stop.departure.planned != "" && stop.departure.planned != "null" &&
          stop.departure.changed != "" && stop.departure.changed != "null"
          ){
            console.log(stop.arrival, stop.departure)
            console.log(diffArr);
            this.sumDelays += diffArr
          }
      }
    
      amountAnnouncements += stop.messages.length
      //amountDelays
      amountAnnouncementsPerDelay += (stop.arrival.messages.length + stop.departure.messages.length)


      if(
        stop.arrival.changed != "" && stop.arrival.planned != "" && stop.departure.planned != "" && stop.departure.changed != "" &&
        stop.arrival.changed != "null" && stop.arrival.planned != "null" && stop.departure.planned != "null" && stop.departure.changed != "null"
        
      ){
        //console.log(stop)
        //['Ankunft','Abfahrt','Ankunft neu', 'Abfahrt neu', 'Geplanter Weg', 'Geänderter Weg'],
        let plannedArrival = ""+stop.arrival.planned.substring(6,8)+":"+stop.arrival.planned.substring(8,10)
        let plannedDeparture = ""+stop.departure.planned.substring(6,8)+":"+stop.departure.planned.substring(8,10)
        let changedArrival = ""+stop.arrival.changed.substring(6,8)+":"+stop.arrival.changed.substring(8,10)
        let changedDeparture = ""+stop.departure.changed.substring(6,8)+":"+stop.departure.changed.substring(8,10)

        let plannedPath = ""
        if(stop.arrival.plannedPath != "null" && stop.departure.plannedPath != "null") {
          plannedPath = stop.arrival.plannedPath + stop.departure.plannedPath
          plannedPath = plannedPath.substring(0,40)+"..."
        }

        let changedPath = ""
        if(stop.arrival.changedPath != "null" && stop.departure.changedPath != "null") {
          changedPath = stop.arrival.changedPath + stop.departure.changedPath
          changedPath = changedPath.substring(0,40)+"..."
          this.amountChangedPaths++
        }
        
        let values = [
          plannedArrival,
          plannedDeparture,
          changedArrival,
          changedDeparture,
          plannedPath,
          changedPath
        ]
        this.table.values.push(values);
        //console.log(values);
    }
    this.viewTable = true;

    })
    let name = this.selectedStations[this.selectedStations.findIndex(stat => ""+stat.id == delaysObject.evaId)].name;
    if(name != "" && name != undefined){
      let values = [name, amountDelays, amountRealDelays]
      
      this.columnChartValues.push(values);
      
      if(this.differrenceDelays == 0){
        this.differrenceDelays = Math.round((amountRealDelays / amountDelays) * 100) / 100 
      }else{
        this.differrenceDelays = Math.round(((this.differrenceDelays + (amountRealDelays / amountDelays)) / 2) * 100) / 100 
      }
      this.steppedAreaChartValues = [name, amountDelaysOver30, amountDelaysBelow5, amountDelaysBelow30]
      //console.log(this.steppedAreaChartValues)
      this.steppedAreaChart.values.push(this.steppedAreaChartValues);
      this.delaysAbove30min = amountDelaysOver30;
      
      this.viewSteppedAreaChart = true;

    }
    if(this.announcementsPerDelay == 0){
      this.announcementsPerDelay = Math.round(((amountAnnouncementsPerDelay/ amountDelays)) * 100) / 100 
    }else{
      this.announcementsPerDelay = Math.round((((amountAnnouncementsPerDelay/ amountDelays) + (amountAnnouncementsPerDelay/ amountDelays))/2) * 100) / 100 
    }

    this.barChartValues = [
      ['Meldungen', amountAnnouncements],
      ['Verspätungen', amountDelays],
      ['Meldungen pro Verspätung', amountAnnouncementsPerDelay]
    ];
    //console.log(this.barChartValues);
    this.barChart.values = this.barChartValues;
    this.viewBarChart = true

    //console.log(values);
  }

}
