import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent
{
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
}
