import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

declare var $:any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit
{
  supported_languages = ['en', 'it'];
  translate : TranslateService;
  
  constructor(translate: TranslateService)
  {
    this.translate = translate;
  }
  
  ngOnInit()
  {
    let outerThis = this;
    $(document).ready(() =>
    {
      if(localStorage['vpc-language-pref'] != undefined)
      {
        $('#language-selector').val(localStorage['vpc-language-pref']);
      }
      $('#language-selector').change(function() {
        let newLang = $(this).val();
        if(outerThis.supported_languages.includes(newLang))
        {
          localStorage['vpc-language-pref'] = newLang;
          location.reload();
        }
      });
    });
    
  }
}
