import { Component } from '@angular/core';
import {HeaderComponent} from './header.component';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Venice Data Portal';
  supported_languages = ['en', 'it'];
  constructor(translate: TranslateService) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');
    let lang = localStorage['vpc-language-pref'];
    if(lang != undefined && this.supported_languages.includes(lang))
    {
      translate.use(lang);
    }
    else
    {
      translate.use('en');
    }
  }
}
