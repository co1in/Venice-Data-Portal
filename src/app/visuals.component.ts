import { Component } from '@angular/core';
import {FormControl} from '@angular/forms';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import anime from 'animejs';

@Component({
  selector: 'app-visuals',
  templateUrl: './visuals.component.html'
})
export class VisualsComponent implements OnInit
{
  selected = '';
  datasets = [
    {id: 1, name: "Ponti"},
    {id: 2, name: "Rive"},
  ];
  visuals = [
    {id: 1, name: "Donut Chart"},
    {id: 2, name: "Map"},
    {id: 3, name: "Bar Chart"},
    {id: 4, name: "3D Explosion"}
  ];
  
  onDatasetChange(newDataset)
  {
    
  }
  
  ngOnInit()
  {
    window.visualize.Main.renderVisualFromConfig('{"type":"donut","dataSet":"ponti","attributes":{"width":500,"height":500,"font_size":"19","color":{"mode":"interpolate","colorspace":"hcl","range":[0,359]},"label_mode":"hover","category_order":"","group_by":"Material of Summit Pavement","title":""}}', 'content');
  }
  
  ngAfterViewInit()
  {
    $(document).ready(function()
    {
      $('.site-title>h1').css('transform', 'scale(1)');
    });
  }
  
  async getFirebaseData()
  {
    const db = firebase.firestore();
    await db.collection('datasets').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const entry = doc.data();
          entry.id = doc.id;
          dataSets.push(entry);
        });
  }
}
