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
  firebaseData = [];
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
    const db = firebase.firestore();
    await db.collection('configs').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const entry = doc.data();
          entry.id = doc.id;
          entry.attributes = JSON.parse(entry.attributes);
          this.firebaseData.push({
            type: entry.type,
            dataSet: entry.dataSet,
            attributes: entry.attributes
          });
          // this.visuals.push({id: entry.id, name: entry.attributes.type});
        });
    });
    
    let groupedData = {};
    for(let i = 0; i < this.firebaseData.length; i++)
    {
      if(!groupedData.hasOwnProperty(this.firebaseData[i].dataSet))
      {
        //Make a new key in the grouped data dictionary
        groupedData[this.firebaseData[i].dataSet] = [];
        
        //Add this option to the datasets dropdown
        this.datasets.push({id:this.firebaseData[i].dataSet, name:this.firebaseData[i].dataSet});
      }
      
      // Add this visual to the grouped data dictionary
      groupedData[this.firebaseData[i].dataSet].push(this.firebaseData[i]);
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
    (<any>window).visualize.Main.renderVisualFromConfig(this.firebaseData[this.currentSelectedDataset][newVisual],
      'content');
  }
  
  ngOnInit()
  {
    (<any>window).visualize.Main.renderVisualFromConfig('{"type":"donut","dataSet":"ponti","attributes":{"width":500,"height":500,"font_size":"19","color":{"mode":"interpolate","colorspace":"hcl","range":[0,359]},"label_mode":"hover","category_order":"","group_by":"Material of Summit Pavement","title":""}}', 'content');
    this.getFirebaseData();
  }
  
  ngAfterViewInit()
  {
    $(document).ready(function()
    {
      $('.site-title>h1').css('transform', 'scale(1)');
    });
  }
}
