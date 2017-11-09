import { Component } from '@angular/core';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html'
})
export class ArticlesComponent
{
  ngOnInit()
  {
    (<any>window).visualize.Main.renderVisualFromConfig('{"type":"donut","dataSet":"ponti","attributes":{"width":260,"height":260,"font_size":"19","color":{"mode":"interpolate","colorspace":"hcl","range":[0,359]},"label_mode":"hover","category_order":"","group_by":"Material of Summit Pavement","title":""}}',
     'visual1');
    (<any>window).visualize.Main.renderVisualFromConfig(`{
      "type": "bar",
      "dataSet": "ponti",
      "attributes": {"width":600,"height":400,"font_size":"8","x_font_rotation":"0","x_font_x_offset":"17","x_font_y_offset":0,"colors":{"mode":"list","colorspace":"hcl","list":["264"]},"hide_empty":"","category_order":"","group_by_main":"Description of Step Face Conditions","group_by_stack":"Address Letter"}
    }`,
     'visual2');
  }
}
