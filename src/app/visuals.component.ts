import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';

import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { FirebaseHelper } from './firebasehelper';

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

@Component({
  selector: 'app-visuals',
  templateUrl: './visuals.component.html'
})
export class VisualsComponent implements OnInit
{
  currentSelectedDataset = '';
  datasetNames = [];
  realNames = [];
  visuals = [];
  
  constructor (
    private route: ActivatedRoute,
    private router: Router
  ){}
  
  async getFirebaseInfo(callback=undefined)
  {
    let results = await FirebaseHelper.getDatasetNames();
    
    this.realNames = results.realNames
    this.datasetNames = results.datasets;
    console.log("Results: ", results);
    if(callback !== undefined) {
      callback();
    }
  }
  
  async getFirebaseData(datasetName, id=undefined, callback=undefined)
  {
    let results = await FirebaseHelper.getFirebaseData(datasetName, id);
    callback(results);
  }
  
  renderData(data) {
    try {
      this.disableSlick();
    } catch(err){}
    $('#content').html("");
    for(let i = 0; i < data.length; i++) {
      let id = data[i].id;
      let dataSet = data[i].dataSet;
      let wrapper = $('<div>', {class: 'visual-wrapper'});
      wrapper.append(`<div id=${id} class='visual-inner'></div>`);
      wrapper.append(`<a href="/visuals/${dataSet}/${id}" class="view-more">View Details</a>`);
      $("#content").append(wrapper);
      (<any>window).visualize.renderVisualFromConfig(data[i], id);
    }
    this.enableSlick();
  }
  
  ngOnInit()
  {
    let classThis = this;
    
    let val = this.route.snapshot.params
    if(val.dataset != undefined)
    {
      this.currentSelectedDataset = val.dataset;
      $('.site-title>h2').hide();
      this.getFirebaseData(val.dataset, null, (results) => {
        console.log("Firebase Results", results);
        this.renderData(results.firebaseData);
        let title = val.dataset;
        let temp = results.realNames.filter((x) => x.id === val.dataset);
        if(temp.length > 0) title = temp[0].name;
        
        $('.site-title>h2').show().text(title + " Data");
      });
      $('#dataset-grid').hide();
      $('#temp-stuff').hide();
      
    }
    else
    {
      (<any>window).visualize.renderVisualFromConfig(`{"type":"Bubble-Map-Chart","dataSet":"Bell-Tower-Page-Final","attributes":{"title":"","size_by":"Tower height_m","color_by":"Tower height_m","bubble_size":{"range":[1,100]},"color":{"mode":"interpolate","colorspace":"hcl","range":["#000080","#CD0000"]},"mapStyles":[{"elementType":"geometry","stylers":[{"color":"#f9f5ed"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#b0e1f4"}]},{"elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"poi","stylers":[{"visibility":"off"}]},{"featureType":"road","stylers":[{"visibility":"off"}]},{"featureType":"transit","stylers":[{"visibility":"off"}]}]}}`, 'content');
      this.getFirebaseInfo(() =>
      {
        let container = $('#dataset-grid');
        for (let i = 0; i < this.datasetNames.length; i++) {
          let datasetName = this.datasetNames[i];
          let newBlock = $('<div>', {class: 'col-12 col-sm-6 col-md-4 col-lg-3 block dataset-block'});
          let link = $('<a>', {href: `/visuals/${datasetName}`});
          let imgWrapper = $('<div>', {class: 'image-wrapper'});
          let img = $('<img>', {src: `/assets/${datasetName}.png`});
          imgWrapper.append(img);
          link.append(imgWrapper);
          
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
      });
      
    }
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
      
      // visualThis.enableSlick();
    });
  }
}
