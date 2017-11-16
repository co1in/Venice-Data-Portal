import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import anime from 'animejs';

declare var $:any;
declare var visualize:any;
declare var firebase:any;

@Component({
  selector: 'app-visuals',
  templateUrl: './visuals.component.html'
})
export class VisualsComponent implements OnInit
{
  currentSelectedDataset = '';
  dataSelectDisabled=true;
  firebaseData = {};
  selected = '';
  datasets = [
    // {id: 1, name: "Ponti"},
    // {id: 2, name: "Rive"},
  ];
  visuals = [
    // {id: 1, name: "Donut Chart"},
    // {id: 2, name: "Map"},
    // {id: 3, name: "Bar Chart"},
    // {id: 4, name: "3D Explosion"}
  ];
  
  async getFirebaseData()
  {
    const db = firebase.database();
    const tempFirebaseData = [];
    await db.ref('/viz').once('value').then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const entry = doc.val();
          entry.id = doc.key;
          entry.attributes = JSON.parse(entry.attributes);
          tempFirebaseData.push({
            type: entry.type,
            dataSet: entry.dataSet,
            attributes: entry.attributes
          });
        });
    });
    
    let groupedData = {};
    for(let i = 0; i < tempFirebaseData.length; i++)
    {
      if(!groupedData.hasOwnProperty(tempFirebaseData[i].dataSet))
      {
        //Make a new key in the grouped data dictionary
        groupedData[tempFirebaseData[i].dataSet] = [];
        
        //Add this option to the datasets dropdown
        this.datasets.push({id:tempFirebaseData[i].dataSet, name:tempFirebaseData[i].dataSet});
      }
      
      // Add this visual to the grouped data dictionary
      groupedData[tempFirebaseData[i].dataSet].push(tempFirebaseData[i]);
    }
    
    this.firebaseData = groupedData;
    this.dataSelectDisabled = false;
    console.log(this.firebaseData);
  }
  
  onDatasetChange(newDataset)
  {
    this.currentSelectedDataset = newDataset;
    
    this.visuals = [];
    for(let i = 0; i < this.firebaseData[newDataset].length; i++)
    {
      this.visuals.push({id: i, name: this.firebaseData[newDataset][i].type});
    }
  }
  
  onVisualChange(newVisual)
  {
    console.log("New Visual", newVisual);
    (<any>window).visualize.renderVisualFromConfig(this.firebaseData[this.currentSelectedDataset][newVisual],
      'content');
  }
  
  ngOnInit()
  {
    (<any>window).visualize.renderVisualFromConfig(
      '{"type":"Bubble-Chart","dataSet":"Venice-Convents","attributes":{"width":500,"height":500,"dontDefineDimensions":false,"font_size":"12","label_mode":"always","hide_empty":true,"category_order":"","group_by":"Sestiere","font_color":"#000000","title":"Convents by Sestiere","color":{"mode":"manual","colors":[],"single_color":"#3d3e80"}}}',
      'visual1'
    );
    (<any>window).visualize.renderVisualFromConfig(
      '{"type":"Donut-Chart","dataSet":"MERGE-Ponti","attributes":{"width":500,"height":500,"dontDefineDimensions":false,"font_size":20,"hide_empty":true,"show_legend":true,"color":{"mode":"manual"},"items":{"1.71-2.71":{"weight":0,"color":"#ff3333"},"2.71-3.71":{"weight":1,"color":"#d6ff33"},"98.71-99.71":{"weight":2,"color":"#33ff85"},"0.71-1.71":{"weight":3,"color":"#3385ff"},"3.71-4.71":{"weight":3,"color":"#d633ff"},"2-3":{"weight":0,"color":"#c92d2f"},"1-2":{"weight":1,"color":"#ea3c32"},"3-4":{"weight":2,"color":"#141a31"},"99-100":{"weight":5,"color":"#a22229"},"4-5":{"weight":4,"color":"#333380"},"0-1":{"weight":4,"color":"#a50c3a"}},"label_mode":"hover","group_by":"Height Center (m)","title":"Center Height of Venetian Bridges","binSize":1,"binStart":"0","order":[]}}',
      'visual2'
    );
    this.getFirebaseData();
  }
  
  ngAfterViewInit()
  {
    $(document).ready(function()
    {
      $('.site-title>h1').css('transform', 'scale(1)');
      $('#content').slick({
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 2000,
      });
    });
  }
}
