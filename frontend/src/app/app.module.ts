import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { GoogleChartsModule } from 'angular-google-charts';
import { HttpClientModule } from '@angular/common/http';
import { AnnouncementsComponent } from './topics/announcements/announcements.component';
import { DelaysComponent } from './topics/delays/delays.component';
import { RoutesComponent } from './topics/routes/routes.component';
import { StationsComponent } from './topics/stations/stations.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AnnouncementsComponent,
    DelaysComponent,
    RoutesComponent,
    StationsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GoogleChartsModule.forRoot({mapsApiKey: 'AIzaSyAU1cni_NEb7OBu5lCkMTsdSOGMYRcRMnU'}),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
