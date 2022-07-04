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

  delaysPerStation: Delay[] = [];

  //CHARTS:
  viewColumnChart: boolean = false;
  columnChart: Chart = {
    title: 'Test',
    type: ChartType.ColumnChart,
    columns: ['Bahnhof', 'Meldungen', 'Echte Menge'],
    values: [
    ],
    options: {
      colors: [
        '#badcf7',
        '#a6c8e3'
      ]
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
      if(this.selectedStations.length < 4){
        this.selectedStations.push(station);
      }else if(this.selectedStations.length == 4){
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
      this.hasSearched = false;
      let values: any[] = [];
      var subject = new ReplaySubject(1);
      this.delaysPerStation = [];
      
      let ids: number[] = [];
      stations.forEach(station => ids.push(station.id))

      this.delayService.getDelays(ids).subscribe(
        obj =>{
        
        //let delaysPerStation: any[] = [];

        const parser = new DOMParser();

        for(let objCounter = 0; objCounter < obj.length; objCounter++){
          const xml = parser.parseFromString(obj[objCounter], 'text/xml');
          
          let name: string = ""+xml.children[0].attributes.getNamedItem('station')?.value
          let amountDelays: number = xml.children[0].childElementCount
          
          console.log(xml);

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
          console.log(delaysObject);

          let hours: string[] = [];
          delaysObject.apiInformation.forEach(apiInfo =>{
            hours.push(apiInfo.hour)
          })
          
          this.delayService.getTimeTables(['21','22'], delaysObject.evaId).subscribe(obj=>{
            console.log(obj);

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
                        }
                        if(childElems[j].tagName == 'dp'){
                          delaysObject.stops[stopIndex].departure.planned = ''+childElems[j].getAttribute('pt');
                          delaysObject.stops[stopIndex].departure.plannedPath = ''+childElems[j].getAttribute('ppth');
                        }
                      }
                    }
                  }
                })
              })
            })
            console.log(delaysObject);
          })
          
          let delay: Delay = {
            name: name,
            amount: amountDelays,
            delays: delayMessages
          }
  
          //console.log(delay);

          this.delaysPerStation.push(delay);
        }

        //console.log(this.delaysPerStation);

        //xml.children[0].childNodes

        let columnChartValues : any[] = []

        this.delaysPerStation.forEach(station =>{
          columnChartValues.push([station.name, station.amount, station.delays.length])
          let ratio = station.delays.length / station.amount;
          if(this.differrenceDelays == 0){
            this.differrenceDelays = Number((Math.round(ratio * 100) / 100).toFixed(2));
          }else{
            this.differrenceDelays = Number((Math.round((this.differrenceDelays + ratio) * 100) / 100).toFixed(2))/2;
          }

          /*
          let tmpStations5Min = station.delays.filter(delays =>{
            //Month:
            (Number(delays.to.substring(2,4)) - Number(delays.from.substring(2,4)) == 0) &&
            //Day:
            (Number(delays.to.substring(4,6)) - Number(delays.from.substring(4,6)) == 0) &&
            //Hour:
            (Number(delays.to.substring(6,8)) - Number(delays.from.substring(6,8)) == 0) &&
            //Minute:
            (Number(delays.to.substring(8,10)) - Number(delays.from.substring(8,10)) <= 50)
          })*/

          //Wieviele sind unter 24h, 7t, 1M, 6M, Rest min? Kennzahl: Durchschnittsdauer? Immer aktualisieren
          
          let oneDayDelays = station.delays.filter(delays =>
            //Year:
            (Number(delays.to.substring(0,2)) - Number(delays.from.substring(0,2)) == 0)
            //Month:
            &&(Number(delays.to.substring(2,4)) - Number(delays.from.substring(2,4)) == 0)
            //Day:
            && (Number(delays.to.substring(4,6)) - Number(delays.from.substring(4,6)) == 0)
          );
          
          //console.log("One Day")
          //console.log(oneDayDelays)

          let weekDelays = station.delays.filter(delays =>
            //Year:
            (Number(delays.to.substring(0,2)) - Number(delays.from.substring(0,2)) == 0)
            //Month:
            && (Number(delays.to.substring(2,4)) - Number(delays.from.substring(2,4)) == 0)
            //Day:
            && (Number(delays.to.substring(4,6)) - Number(delays.from.substring(4,6)) <= 7)
          );
          //console.log("One Week")
          //console.log(weekDelays)

          let monthDelays = station.delays.filter(delays =>
            //Year:
            (Number(delays.to.substring(0,2)) - Number(delays.from.substring(0,2)) == 0)
            //Month:
            && (Number(delays.to.substring(2,4)) - Number(delays.from.substring(2,4)) == 1)
          );

          //console.log("One Month")
          //console.log(monthDelays)

          let sixMonthDelays = station.delays.filter(delays =>
            //Year:
            (Number(delays.to.substring(0,2)) - Number(delays.from.substring(0,2)) == 0)
            //Month:
            && (Number(delays.to.substring(2,4)) - Number(delays.from.substring(2,4)) <= 6)
            && (Number(delays.to.substring(2,4)) - Number(delays.from.substring(2,4)) > 1)
          );

          //console.log("Six Months")
          //console.log(sixMonthDelays)

          let elseDelays = station.delays.filter(delays =>
            //Year:
            (Number(delays.to.substring(0,2)) - Number(delays.from.substring(0,2)) != 0)
            //Month:
            || (Number(delays.to.substring(2,4)) - Number(delays.from.substring(2,4)) > 6)
          );
          //console.log("Everything else")
          //console.log(elseDelays);

            //Geringste Verzögerung der drei Stationen oben in DropDown
            //Längste Verzögerung der drei Stationen oben in DropDown
        })

        //console.log(columnChartValues);
        this.viewColumnChart = true; 
        this.columnChart.values = columnChartValues;

        //console.log(this.delaysPerStation);

      });
    }
  }

  //(mouseenter)="this.clickOnInfo(0)" (mouseleave)="this.resetInfo(0)"

  clickOnInfo(index: number){
    console.log("Highlight graph" +index);
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
}
