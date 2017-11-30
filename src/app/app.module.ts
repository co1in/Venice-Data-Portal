import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { MatSelectModule } from '@angular/material';
import { RouterModule }   from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header.component';
import { VisualsComponent } from './visuals.component';
import { ArticlesComponent } from './articles.component';
import { DownloadsComponent } from './downloads.component';
import { IndividualComponent } from './individual.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    VisualsComponent,
    ArticlesComponent,
    DownloadsComponent,
    IndividualComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {
        path: "",
        redirectTo: '/visuals',
        pathMatch: 'full'
      },
      {
        path: 'visuals/:dataset/:visualid',
        component: IndividualComponent,
        pathMatch: 'full'
      },
      {
        path: 'visuals/:dataset',
        component: VisualsComponent,
        pathMatch: 'full'
      },
      {
        path: 'visuals',
        component: VisualsComponent,
        pathMatch: 'full'
      },
      {
        path: 'articles',
        component: ArticlesComponent
      },
      {
        path: 'downloads',
        component: DownloadsComponent
      }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
