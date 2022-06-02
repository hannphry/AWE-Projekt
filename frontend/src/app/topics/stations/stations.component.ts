import { Component, OnInit } from '@angular/core';
import { ChartType } from 'angular-google-charts';
import { Chart } from 'src/app/interfaces/chart';
import { Station } from 'src/app/interfaces/station';
import { StationService } from 'src/app/services/station.service';

@Component({
  selector: 'app-stations',
  templateUrl: './stations.component.html',
  styleUrls: ['./stations.component.scss']
})
export class StationsComponent implements OnInit {

  /*
    1. Zusammenhang zwischen Anzahl an Stationen pro Bundesland und ÖPNV-Anschlüssen an den Stationen
    2. Preisklassen und Taxi-Ranks und 24/7 Service
    3. Taxi Ranks vs Mietautos Klassierung nach type (z.B. Knotenbahnhof) (vielleicht nach Fotos von Typen suchen, dann Schnee finden und überleitung zu Klimaschutz und Fahrradfahren)
    4. Parkplätze und Fahrradparkplätze (im Zusammenhang mit stationManagement, oder anderen Attributen) 
    5. Behindertengerechte Stationen, lässt sich ein Muster erkennen? Vielleicht Statistiken mit Bundesland vergleichen, Anzahl Personen, die was benötigen vs. was es gibt
  */

  stations: Station[] = [];

  federalStates: string[] = [
    "Bayern", 
    "Baden-Württemberg", 
    "Berlin", 
    "Brandenburg", 
    "Bremen", 
    "Hamburg", 
    "Hessen", 
    "Mecklenburg-Vorpommern", 
    "Niedersachsen", 
    "Nordrhein-Westfalen",
    "Rheinland-Pfalz", 
    "Saarland", 
    "Sachsen", 
    "Sachsen-Anhalt", 
    "Schleswig-Holstein",
    "Thüringen"
  ]

  priceCategories: number[] = [
     1, 2, 3, 4, 5, 6, 7 
    ];

  stationTypes: string[] = [
    "Knotenbahnhof",
    "Zubringerbahnhof",
    "S-Bahnhof",
    "Metropolbahnhof"
  ];

  stationsByFederalState :[{
    federalState: string,
    stations: Station[]
  }] = [{
    federalState: "",
    stations: []
  }];

  stationManagement: string[] = [
    "Augsburg",
    "Bamberg",
    "Berlin Fernbahnhöfe",
    "Berlin Regional- und S-Bahnhöfe",
    "Bielefeld",
    "Braunschweig / Göttingen",
    "Bremen / Osnabrück",
    "Chemnitz",
    "Cottbus",
    "Darmstadt",
    "Dortmund",
    "Dresden",
    "Duisburg",
    "Düsseldorf",
    "Erfurt",
    "Essen",
    "Frankfurt a. M.",
    "Freiburg",
    "Friedrichshafen",
    "Gießen",
    "Hagen",
    "Halle (Saale)",
    "Hamburg",
    "Hannover",
    "Kaiserslautern",
    "Karlsruhe",
    "Kassel",
    "Koblenz",
    "Köln",
    "Leipzig",
    "Magdeburg",
    "Mainz",
    "Mannheim",
    "München",
    "Münster (Westf)",
    "Nürnberg",
    "Potsdam",
    "Regensburg",
    "Rosenheim",
    "Rostock",
    "Saarbrücken",
    "Schleswig-Holstein",
    "Schwerin",
    "Stuttgart",
    "Ulm",
    "Würzburg"
  ]

  comboChart: Chart = {
    title: 'Bundesländer',
    type: ChartType.ComboChart,
    options: {
      title : 'Anzahl Stationen mit ÖPNV-Anschluss',
      //vAxis: {title: 'Anzahl'},
      //hAxis: {title: 'Bundesländer'},
      seriesType: 'bars',
      series: {
        //2: {type: 'line'}
      },
      colors: [
        '#aaecdc',
        //'#aedcfc',
        //'#aeeafc',
        '#a7dde8',
        //'#aefcf4',
        //'#aefce1',
        '#9dc1eb'
      ],
      vAxis: {
        gridlines: {
            color: 'transparent'
        }
    }
      
    },
    columns: ['Bundesland','Stationen','ÖPNV' ],//, 'Differenz'],
    values: []
  }

  steppedAreaChart: Chart= {
    title: 'Anzahl Stationen mit Taxi und 24/7 Service nach Preisklasse',
    type: ChartType.SteppedAreaChart,
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
    columns: ['Preisklasse','Anzahl Stationen','Mit Taxi','24/7-Service'],
    values: []
  }

  areaChart: Chart = {
    title: 'Mit Taxi und Mietwagen nach Bahnhofstypen',
    type: ChartType.AreaChart,
    options: {
      //isStacked: true,
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
    },
    columns: ['Anzahl','Typ', 'Anzahl Mit Taxi','Anzahl mit Mietwagen'],
    values: [] //Blöcke aufeinander addieren
  }

  bubbleChart: Chart = {
    title: '(Fahrrad-)Parkplätze', //X = 0 - 45 Gruppen,Y = Stationen mit P / Anzahl Stationen,Bubble Size = Anzahl Stationen ,Bubble Color = 0-25% 25-50 usw.
    type: ChartType.BubbleChart,
    options: {},
    columns: ['Klasse', 'Prozentanteil', 'Prozentgruppe', 'Anzahl Stationen'],
    values: []
  };

  constructor(
    private stationService: StationService
  ) { }

  ngOnInit(): void {
    //Erstmal über das subscribe an die Daten vom Service kommen
    this.stationService.getStations().subscribe(data =>{
      this.stations = data; //Unsere Bahnhofsstationen für die Komponente setzen
      
      this.stationsByFederalState.splice(0,1); //Das erste Element für die Bundesländer und Stationen leeren, weil das erste nicht gebraucht wird
      
      let stateStations: any[] = [];

      //console.log(this.stations);

      this.federalStates.forEach(state=>{ //Jedes Bundesland im Bundesland-Array durchgehen
        let tmpStations = this.stations.filter(obj=> obj.federalState == state ); //Die Stationen rausfiltern, die im richtigen Bundesland liegen
        this.stationsByFederalState.push({ // Zu dem Objekt hinzufügen
          federalState: state,
          stations : tmpStations
        });
        
        //Wieviele davon haben ÖPNV-Anschluss?
        
        let publicTransportStations = tmpStations.filter(obj => obj.hasLocalPublicTransport == true);
        
        stateStations.push([state, tmpStations.length, publicTransportStations.length]); // , (tmpStations.length - publicTransportStations.length)]);
        

      });
      this.comboChart.values = stateStations;

      //console.log(this.comboChart);

      let priceCategoryStations: any[] = [];

      this.priceCategories.forEach(category =>{
        let tmpStations = this.stations.filter(station => station.priceCategory == category);
        let taxiRankStations = tmpStations.filter(station => station.hasTaxiRank == true);
        let stations247 = tmpStations.filter(station => station.has247service == true);
        
        priceCategoryStations.push([category, tmpStations.length, taxiRankStations.length, stations247.length]);
      })
      this.steppedAreaChart.values = priceCategoryStations;

      let stationTypeStations: any[] = [];

      this.stationTypes.forEach(type =>{
        let tmpStations = this.stations.filter(obj => obj.type == type);
        let taxiRankStations = tmpStations.filter(station => station.hasTaxiRank == true);
        let carRentalStations = tmpStations.filter(station => station.hasCarRental == true);

        stationTypeStations.push([type, tmpStations.length, taxiRankStations.length, carRentalStations.length])
      });
      this.areaChart.values = stationTypeStations
    
      let stationsByStationManagement: any[] = [];
      let counter = 0;
      this.stationManagement.forEach(type => {
        let tmpStations = this.stations.filter(obj=> obj.stationManagement == type);
        let tmpStationsWithP = tmpStations.filter(obj => obj.hasParking == true && obj.hasBicycleParking == true)

        let bubbleColour = (tmpStationsWithP.length/tmpStations.length);
        /*let cmp = (tmpStationsWithP.length/tmpStations.length)
        if(cmp > 0 && cmp < 0.25) bubbleColour = 0;
        if(cmp >= 0.25 && cmp < 0.5) bubbleColour = 0.25;
        if(cmp >= 0.5 && cmp < 0.75) bubbleColour = 0.5;
        if(cmp >= 0.75) bubbleColour = 0.75;*/
        
        //console.log('Klasse, Stationen Mit Parkplätzen / Anzahl Stationen,Prozentgruppe, Anzahl Stationen')
        stationsByStationManagement.push([type,(tmpStationsWithP.length/tmpStations.length),bubbleColour,tmpStations.length])
        counter++;
      });
      this.bubbleChart.values = stationsByStationManagement
      //console.log(this.bubbleChart)
    });
  }

}
