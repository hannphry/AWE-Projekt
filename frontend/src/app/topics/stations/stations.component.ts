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

    - Übersicht über alle Bahnhöfe mit Preisklassen
    - Dann DropDown und Auswahl einer Preisklasse (Hover über Info i was sind Preisklassen?)

    - Dann für eine Preisklasse Verteilung auf Bundesländer anzeigen
    - Ein Bundesland auswählen

    - Dann in letzter Suchfunktion über alle Bahnhöfe
    - Station auswählen
    - nach StationManagement gehen
    
    - anhand von 4 Klassen Menge an Stationen im Umfeld der ausgewählten Station

    - Infos einer Station anzeigen Eine Station
      - Hier kann ich parken, wieviel % der Stationen kann ich Fahrrad und Auto parken
      - Hier ist 24h Service
      - Hier kriege ich ein Taxi
      - Dies gehört zu dieser Preiskategorie (wieviele sind's insgesamt)

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

  chooseStations: Station[] = [];

  chosenStationManagement: string[] = [];

  comboChart: Chart = {
    title: 'Preisklassen',
    type: ChartType.ComboChart,
    options: {
      title : 'Anzahl Stationen der Preisklassen',
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
    columns: ['Preisklasse','Stationen'],//, 'Differenz'],
    values: []
  }

  steppedAreaChart: Chart= {
    title: 'Preisklassen in Bundesländern',
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
    columns: ['Bundesland','Anzahl Stationen', 'Rest'],
    values: [
      ['', 0 , 0],
    ]
  }

  comboChart2: Chart = {
    title: 'Stationsmanagement',
    type: ChartType.ComboChart,
    options: {
      title : 'Management der Stationen',
      //vAxis: {title: 'Anzahl'},
      //hAxis: {title: 'Bundesländer'},
      seriesType: 'bars',
      series: {
        1: {type: 'line'}
      },
      colors: [
        //'#aedcfc',
        //'#aeeafc',
        //'#aefcf4',
        '#aefce1',
        '#9dc1eb'
      ],
      vAxis: {
        gridlines: {
            color: 'transparent'
        }
    }
      
    },
    columns: ['Management','Stationen','Wichtige Stationen'],//, 'Differenz'],
    values: [
      ['',0,0]
    ]
  }

  barChart: Chart = {
    title: 'Preisklassen',
    type: ChartType.BarChart,
    options: {
      title : 'Stationsübersicht im Umkreis',
      //vAxis: {title: 'Anzahl'},
      //hAxis: {title: 'Bundesländer'},
      seriesType: 'bars',
      series: {
        //1: {type: 'line'}
      },
      colors: [
        //'#aedcfc',
        //'#aeeafc',
        //'#aefcf4',
        '#aefce1',
        '#9dc1eb'
      ],
      vAxis: {
        gridlines: {
            color: 'transparent'
        }
      },
      hAxis: {
        viewWindow: {
        },
        gridlines: {
          color: 'transparent'
      }
      }
    },
    columns: ['Eigenschaft','Menge','Gegenteil'], //,'Preiskategorie','Parkplatz','ÖPNV-Anschluss','Taxistand','Autovermietung','WLAN'],//, 'Differenz'],
    values: [
      ['',0,0]
    ]
  }

  priceCategoryTitle: string = "Preisklasse";
  federalStateTitle: string = "Bundesland";
  stationTitle: string = "Station";



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

      let priceCategoryStations: any[] = [];

      this.priceCategories.forEach(category =>{
        let tmpStations = this.stations.filter(station => station.priceCategory == category);
        
        priceCategoryStations.push([category, tmpStations.length]);
      })

      this.comboChart.values = priceCategoryStations;

      //console.log(this.comboChart);
/*
      priceCategoryStations = [];

      this.priceCategories.forEach(category =>{

        let tmpStations = this.stations.filter(station => station.priceCategory == category);
        let taxiRankStations = tmpStations.filter(station => station.hasTaxiRank == true);
        let stations247 = tmpStations.filter(station => station.has247service == true);
        
        priceCategoryStations.push([category, tmpStations.length, taxiRankStations.length, stations247.length]);
      })
      this.steppedAreaChart.values = priceCategoryStations;*/
    });
  }

  selectPriceCategoryFromGraph(input: number | undefined){
    if(input){
      //console.log(input +1);
      this.choosePriceCategory(input +1);
    }
  }

  choosePriceCategory(num: number){
    //console.log(num);

    this.priceCategoryTitle = `Preisklasse ${num}`;

    let federalStateStations: any[] = [];

      this.federalStates.forEach(state=>{
        let tmpStations = this.stations.filter(station => station.federalState == state);
        //console.log(tmpStations);
        
        let tmpStationsInCategory = tmpStations.filter(station => station.priceCategory == num);
        
        let length = 0;

        if(tmpStationsInCategory) length = tmpStationsInCategory.length
        
        federalStateStations.push([state, length, tmpStations.length])

      })
      //console.log(federalStateStations)
      this.steppedAreaChart.values = federalStateStations;
  }

  selectFederalStateFromGraph(input: any){
    //console.log(input);
    if(input.row){
      //console.log(this.federalStates[input.row])
      this.chooseFederalState(this.federalStates[input.row]);
    }
  }


  chooseFederalState(state: string){
    this.federalStateTitle = state;
    let managementStations: any[] = [];

    this.stationManagement.forEach(management=>{
      let tmpStations = this.stations.filter(station => station.federalState == state);
      let stationsFromManagement = tmpStations.filter(station => station.stationManagement == management);

      if(stationsFromManagement.length > 0){
        let importantStationsFromManagement = stationsFromManagement.filter(station => station.type == "Knotenbahnhof" || station.type == "Metropolbahnhof");
        managementStations.push([management, stationsFromManagement.length, importantStationsFromManagement.length]);
        this.chosenStationManagement.push(management);
      }

    });
    this.comboChart2.values = managementStations;
    
  }

  selectStationManagement(input: any){
    //console.log(input);
    if(input.row && this.chosenStationManagement){
      this.filterStations(this.chosenStationManagement[input.row]);
    }
    //this.chosenStationManagement[input.selection[0].row]
  }

  filterStations(management: string){
    this.chooseStations = this.stations.filter(station => station.stationManagement == management && (station.type == "Knotenbahnhof" || station.type == "Metropolbahnhof"));
  }

  chooseStation(id: string){
    this.barChart.values = [];
    let tmpStation: Station = this.stations.filter(station => station.id == id)[0];
    this.stationTitle = tmpStation.name;
    console.log(tmpStation);
    //ca. 65 km
    let filterStations = this.stations.filter(station => (station.lon <= (tmpStation.lon +0.1)) && (station.lon >= (tmpStation.lat -0.1)) && (station.lat <= (tmpStation.lat +0.1)) && (station.lat >= (tmpStation.lat -0.1)));
    
    this.barChart.options.hAxis.viewWindow.max = (Math.round(filterStations.length/10)*10);

    let priceCategory = `Preiskategorie ${tmpStation.priceCategory}`
    let amount = filterStations.filter(station => station.priceCategory == tmpStation.priceCategory).length;
    let negAmount = filterStations.filter(station => station.priceCategory != tmpStation.priceCategory).length;
    this.barChart.values.push([priceCategory, amount, negAmount]);

    if(tmpStation.hasBicycleParking == true && tmpStation.hasParking == true){
      let parkingLot = 'Parkplätze'
      amount = filterStations.filter(station => station.hasBicycleParking == true && station.hasParking == true).length;
      negAmount = filterStations.filter(station => station.hasBicycleParking != true && station.hasParking != true).length;
      this.barChart.values.push([parkingLot, amount, negAmount]);
    }else{
      let parkingLot = 'Keine Parkplätze'
      amount = filterStations.filter(station => station.hasBicycleParking != true && station.hasParking != true).length;
      negAmount = filterStations.filter(station => station.hasBicycleParking == true && station.hasParking == true).length;
      this.barChart.values.push([parkingLot, amount, negAmount]);
    }

    if(tmpStation.hasLocalPublicTransport == true){
      let localPublicTransport = 'ÖPNV';
      amount = filterStations.filter(station => station.hasLocalPublicTransport == true).length;
      negAmount = filterStations.filter(station => station.hasLocalPublicTransport != true).length;
      this.barChart.values.push([localPublicTransport, amount, negAmount]);
    }else{
      let localPublicTransport = 'Kein ÖPNV';
      amount = filterStations.filter(station => station.hasLocalPublicTransport != true).length;
      negAmount = filterStations.filter(station => station.hasLocalPublicTransport == true).length;
      this.barChart.values.push([localPublicTransport, amount, negAmount]);
    }

    if(tmpStation.hasTaxiRank == true){
      let taxiRank = 'Taxistand';
      amount = filterStations.filter(station => station.hasTaxiRank == true).length;
      negAmount = filterStations.filter(station => station.hasTaxiRank != true).length;
      this.barChart.values.push([taxiRank, amount, negAmount]);
    }else{
      let taxiRank = 'Kein Taxistand';
      amount = filterStations.filter(station => station.hasTaxiRank != true).length;
      negAmount = filterStations.filter(station => station.hasTaxiRank == true).length;
      this.barChart.values.push([taxiRank, amount, negAmount]);
    }

    if(tmpStation.hasCarRental == true){
      let carRental = 'Autovermietung';
      amount = filterStations.filter(station => station.hasCarRental == true).length;
      negAmount = filterStations.filter(station => station.hasCarRental != true).length;
      this.barChart.values.push([carRental, amount, negAmount]);
    }else{
      let carRental = 'Keine Vermietung';
      amount = filterStations.filter(station => station.hasCarRental != true).length;
      negAmount = filterStations.filter(station => station.hasCarRental == true).length;
      this.barChart.values.push([carRental, amount, negAmount]);
    }

    if(tmpStation.hasWiFi == true){
      let hasWiFi = 'WLAN';
      amount = filterStations.filter(station => station.hasWiFi == true).length;
      negAmount = filterStations.filter(station => station.hasWiFi != true).length;
      this.barChart.values.push([hasWiFi, amount, negAmount]);
    }else{
      let hasWiFi = 'Kein WLAN';
      amount = filterStations.filter(station => station.hasWiFi != true).length;
      negAmount = filterStations.filter(station => station.hasWiFi == true).length;
      this.barChart.values.push([hasWiFi, amount, negAmount]);
    }
  }


}
