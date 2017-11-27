import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';

import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';

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
  realNames = [];
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
  
  constructor (
    private route: ActivatedRoute,
    private router: Router
  ){}
  
  async getFirebaseData(callback=undefined)
  {
    const db = firebase.database();
    const tempFirebaseData = [];
    await db.ref('/viz').once('value').then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const entry = doc.val();
          entry.id = doc.key;
          entry.attributes = JSON.parse(entry.attributes);
          tempFirebaseData.push({
            id: entry.id,
            type: entry.type,
            dataSet: entry.dataSet,
            attributes: entry.attributes
          });
        });
    });
    
    let groupedData = {};
    this.realNames = await (<any>window).visualize.getDataSetList();
    // console.log("Real Names", realNames);
    for(let i = 0; i < tempFirebaseData.length; i++)
    {
      if(!groupedData.hasOwnProperty(tempFirebaseData[i].dataSet))
      {
        //Make a new key in the grouped data dictionary
        groupedData[tempFirebaseData[i].dataSet] = [];
        
        // Try to get a better name for the dataset
        let name = tempFirebaseData[i].dataSet;
        for(let p = 0; p < this.realNames.length; p++) {
          if(this.realNames[p].id === tempFirebaseData[i].dataSet) {
            name = this.realNames[p].name;
          }
        }
        
        //Add this option to the datasets dropdown
        this.datasets.push({id:tempFirebaseData[i].dataSet, name});
      }
      
      // Add this visual to the grouped data dictionary
      groupedData[tempFirebaseData[i].dataSet].push(tempFirebaseData[i]);
    }
    
    this.firebaseData = groupedData;
    this.dataSelectDisabled = false;
    if(callback !== undefined) {
      callback();
    }
    console.log(this.firebaseData);
  }
  
  onDatasetChange(newDataset)
  {
    window.location.href = "/visuals/" + newDataset;
  }
  
  grabAndRenderData() {
    console.log(this.firebaseData);
    
    if(this.firebaseData[this.currentSelectedDataset] == undefined) {
      // window.location.href = '/';
    }
    
    this.visuals = [];
    for(let i = 0; i < this.firebaseData[this.currentSelectedDataset].length; i++)
    {
      this.visuals.push({id: i, name: this.firebaseData[this.currentSelectedDataset][i].type});
    }
    
    this.renderSliderContent();
  }
  
  renderSliderContent()
  {
    this.disableSlick();
    $('#content').html("");
    for(let i = 0; i < this.visuals.length; i++) {
      let id = this.firebaseData[this.currentSelectedDataset][i].id;
      let wrapper = $('<div>', {class: 'visual-wrapper'});
      wrapper.append(`<div id=${id}></div>`);
      wrapper.append(`<a href="/visuals/${this.currentSelectedDataset}/${id}" class="view-more">View Details</a>`);
      $("#content").append(wrapper);
      (<any>window).visualize.renderVisualFromConfig(this.firebaseData[this.currentSelectedDataset][i], id);
    }
    this.enableSlick();
  }
  
  ngOnInit()
  {
    let classThis = this;
    this.route.params.subscribe(val => {
      console.log("Val", val);
      if(val.dataset != undefined)
      {
        this.currentSelectedDataset = val.dataset;
        this.getFirebaseData(() => {
          this.grabAndRenderData();
        });
        $('#dataset-grid').hide();
      }
      else {
        this.getFirebaseData(() => {
          let datasetKeys = Object.keys(this.firebaseData);
          
          let container = $('#dataset-grid');
          for (let i = 0; i < datasetKeys.length; i++) {
            let datasetName = datasetKeys[i];
            let newBlock = $('<div>', {class: 'col-12 col-sm-6 col-md-4 col-lg-3 block dataset-block'});
            let link = $('<a>', {href: `/visuals/${datasetName}`})
            let img = $('<img>', {src: `/assets/${datasetName}.png`});
            link.append(img);
            
            for(let p = 0; p < this.realNames.length; p++)
            {
              if(this.realNames[p].id === datasetName)
              {
                datasetName = this.realNames[p].name;
                break;
              }
            }
            
            link.append(`<span>${datasetName}</span>`);
            newBlock.append(link);
            container.append(newBlock);
          }
          //
        });
        
        console.log("Loading default visuals");
        (<any>window).visualize.renderVisualFromConfig(
          '{"type":"Bubble-Chart","dataSet":"MERGE-Ponti","attributes":{"width":500,"height":500,"dontDefineDimensions":false,"font_size":"13","label_mode":"always","hide_empty":true,"category_order":"","group_by":"Name of Southern Sestiere","font_color":"#000000","title":"Bridges Southern Sestiere","color":{"mode":"palette","colors":[],"single_color":"#d34242"}}}',
          'visual1'
        );
        
        (<any>window).visualize.renderVisualFromConfig(
          '{"type":"Donut-Chart","dataSet":"MERGE-Ponti","attributes":{"width":500,"height":500,"dontDefineDimensions":false,"font_size":20,"hide_empty":true,"show_legend":true,"color":{"mode":"manual"},"items":{"1.71-2.71":{"weight":0,"color":"#ff3333"},"2.71-3.71":{"weight":1,"color":"#d6ff33"},"98.71-99.71":{"weight":2,"color":"#33ff85"},"0.71-1.71":{"weight":3,"color":"#3385ff"},"3.71-4.71":{"weight":3,"color":"#d633ff"},"2-3":{"weight":0,"color":"#c92d2f"},"1-2":{"weight":1,"color":"#ea3c32"},"3-4":{"weight":2,"color":"#141a31"},"99-100":{"weight":5,"color":"#a22229"},"4-5":{"weight":4,"color":"#333380"},"0-1":{"weight":4,"color":"#a50c3a"}},"label_mode":"hover","group_by":"Height Center (m)","title":"Center Height of Venetian Bridges","binSize":1,"binStart":"0","order":[]}}',
          'visual2'
        );
        (<any>window).visualize.renderVisualFromConfig(
          '{"type":"Bar-Chart","dataSet":"Venice-Convents","attributes":{"aspect_ratio":1.5,"font_size":"8","x_font_rotation":"40","x_font_x_offset":"0","x_font_y_offset":0,"color":{"mode":"list","colorspace":"hcl","list":["232",45,90,135,180,225,270,315,120,165,210,255,300,345,30,75,240,285,330,15,60,105,150,195],"range":[0,359]},"hide_empty":"","category_order":"","group_by_main":"Sestiere","group_by_stack":"No Column","title":"Convents by Sestiere"}}',
          'visual3'
        );
        (<any>window).visualize.renderVisualFromConfig(
          '{"type":"Filter-Map","dataSet":"MERGE-Ponti","attributes":{"columnOptions":["Additional Handrail?","Address","Address Letter","Arch Style","Arch Style Code","Average Height (m)","Average Height of Railing (m)","Average railing width (cm)","Bridge Code","Bridge Name","Bridge Number According to Zucchetta","Canal Crossed","Canal Width (m)","Central Thickness (m)","Code for Material of Step Face","Code for railing type","Code for the material of the rail","Conditions of the Step Face","Construction Material","Construction Material Code","Crooked Bridge?","Date of Last Restoration","Date of Survey","Decorations","Description of Step Face Conditions","Estimated Surface Area","Face Material","Full Width Including Railings (m)","H-C","H-N2","H-S2","Handicapped Accessible?","Height 1m North (m)","Height 1m South (m)","Height Center (m)","Height of Step (cm)","History","Hypotenuse North (deg)","Hypotenuse South (deg)","ID","Inclination North (deg)","Inclination South (deg)","Latitude","Length of Summit (m)","Longitude","Material Code of Summit Pavement","Material of Summit Pavement","Maximum Inclination (deg)","Minimum Height (m)","Minimum Step Width (m)","Minimum Thickness (m)","N Cathetus (deg)","Name of Northern Sestiere","Name of Southern Sestiere","Net Width of Bridge (m)","Northern Island Number","Northern Sestiere Code","Notes","Number of Arches","Number of Northern Steps","Number of Ramps","Number of Southern Steps","Number of Street Address On Bridge","Numerical Condition of Bridge","Numerical Condition of Decorations","Numerical Condition of Step Pavement Material","Numerical Condition of Summit Pavement","Photo Number of Arch","Photo Number of Ramp","Photo Number of Reference Elevation Point","Photo of Bridge","Private Bridge?","Protrusion North (m)","Protrusion South (m)","Qualitative Condition of Bridge","Qualitative Condition of Decorations","Qualitative Condition of Step Pavement Material","Qualitative Condition of Summit Pavement","Qualitative condition of Railing","Railing Material","Railing condition","Ratio of Span to Height","Reference to CAD Drawings","S Cathetus (deg)","SE-C","SE-N1","SE-N2","SE-S1","SE-S2","SI-C","SI-N1","SI-N2","SI-S1","SI-S2","Segment Code","Southern Island Number","Southern Sestiere Code","Span (m)","Step Depth (cm)","Step Pavement Material","Step Surface (Min)","Street Addresses on Bridge","Surface Area From Map","Surface Area of Summit (m^2)","Survey Incomplete?","Thickness 1m North Of Center (m)","Thickness 1m South of Center (m)","Thickness 2m North Of Center (m)","Thickness 2m South of Center (m)","Tide Level (m)","Time of Survey (24:00)","Total Number of Steps","Total Surface Area of Pavement (m^2)","Total Surface Area of Steps (m^2) ","Tread Material","Type of Railing","Water level (cm)","Width of Eastern Railing (cm)","Width of Summit (m)","Width of Western Railing (cm)","Year Constructed","Year of Last Restoration","id"],"displayColumns":[],"dataFilters":[{"column":"Handicapped Accessible?","categories":["FALSE"]}],"numericFilters":[{"column":null,"operation":null,"value":""}]}}',
          'visual4'
        );
      }
    });
  }
  
  disableSlick()
  {
    $('#content').slick("unslick");
  }
  
  enableSlick()
  {
    $('#content').slick({
      infinite: false,
      slidesToShow: 2,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000,
    });
  }
  
  ngAfterViewInit()
  {
    let visualThis = this;
    $(document).ready(function()
    {
      $('.site-title>h1').css('transform', 'scale(1)');
      // $('#visual3 > svg').attr('viewBox', '200 0 500 700');
      
      visualThis.enableSlick();
    });
  }
}
