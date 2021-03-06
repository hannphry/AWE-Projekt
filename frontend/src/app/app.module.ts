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

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule} from '@angular/material/button';
import { MatToolbarModule} from '@angular/material/toolbar'

import { MatSidenavModule} from '@angular/material/sidenav';
import { MatListModule} from '@angular/material/list';
import { MatSelectModule} from '@angular/material/select';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OurDataComponent } from './our-data/our-data.component';
import { OurAPIsComponent } from './our-apis/our-apis.component';
import { WikiComponent } from './wiki/wiki.component';


import { MarkdownModule } from 'ngx-markdown';

//Datepicker:
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


import { MatTableModule } from '@angular/material/table';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AnnouncementsComponent,
    DelaysComponent,
    RoutesComponent,
    StationsComponent,
    OurDataComponent,
    OurAPIsComponent,
    WikiComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GoogleChartsModule.forRoot({mapsApiKey: 'AIzaSyAU1cni_NEb7OBu5lCkMTsdSOGMYRcRMnU'}),
    HttpClientModule,
    MatIconModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    //DatePicker
    MatDatepickerModule,
    MatNativeDateModule,
    //End DatePicker
    MarkdownModule.forRoot(),
  ],
  providers: [
    MatDatepickerModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
