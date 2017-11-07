import { Component } from '@angular/core';
import {FormControl} from '@angular/forms';


@Component({
  selector: 'app-visuals',
  templateUrl: './visuals.component.html'
})
export class VisualsComponent
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
}
