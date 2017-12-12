import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';

import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { FirebaseHelper } from './firebasehelper';
import { TranslateService } from '@ngx-translate/core';

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
  title = "";
  showLoading = false;
  
  constructor (
    private route: ActivatedRoute,
    private router: Router,
    private translate : TranslateService
  ){}
  
  async getFirebaseInfo(callback=undefined)
  {
    let results = await FirebaseHelper.getDatasetNames();
    
    this.realNames = results.realNames
    this.datasetNames = results.datasets;
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
      this.translate.get('VIEW_DETAILS').subscribe((res : string) => {
        wrapper.append(`<a href="/visuals/${dataSet}/${id}" class="view-more">${res}</a>`);
      });
      
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
      this.getFirebaseData(val.dataset, null, (results) => {
        this.renderData(results.firebaseData);
      });
      let tempTitle = classThis.translate.get(val.dataset).subscribe((res: string) => {
        classThis.translate.get('DATASET_DATA', {value: res}).subscribe((res2: string) => {
          this.title = res2;
        });
      });
      
      $('#dataset-grid').hide();
      $('#temp-stuff').hide();
    }
    else
    {
      classThis.translate.get('WELCOME').subscribe((res: string) => {
          this.title = res;
      });
      
      (<any>window).visualize.renderVisualFromConfig(`{"type":"Filter-Map","dataSet":"MERGE-Ponti","attributes":{"title":"Passable Bridges at High Tide","mapStyles":[{"elementType":"geometry","stylers":[{"color":"#f5f5f5"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#c9c9c9"}]},{"elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"poi","stylers":[{"visibility":"off"}]},{"featureType":"road","stylers":[{"visibility":"off"}]},{"featureType":"transit","stylers":[{"visibility":"off"}]}],"colors":["#ff0000","#0000ff"],"shapes":["circle","circle"],"images":[],"areaSelections":[],"filters":[{"dataSet":"MERGE-Ponti","numeric":[{"column":"Height 1m North (m)","operation":"<","value":"2.2"}],"categorical":[]},{"dataSet":"MERGE-Ponti","numeric":[{"column":"Height 1m North (m)","operation":">","value":"2.2"}],"categorical":[]},null],"sliders":{"0":{"name":"Bridges","attributes":{}},"1":{"name":"Bridges","attributes":{}}}}}`, 'content');
      this.showLoading = true;
      this.getFirebaseInfo(() =>
      {
        this.showLoading = false;
        let container = $('#dataset-grid');
        for (let i = 0; i < this.datasetNames.length; i++) {
          let datasetName = this.datasetNames[i];
          let newBlock = $('<div>', {id: `${datasetName}-block`, class: 'col-12 col-sm-6 col-md-4 col-lg-3 block dataset-block'});
          let link = $('<a>', {href: `/visuals/${datasetName}`});
          let imgWrapper = $('<div>', {class: 'image-wrapper'});
          let img = $('<img>', {src: `/assets/datasets2/${datasetName}.svg`});
          imgWrapper.append(img);
          link.append(imgWrapper);
          
          this.translate.get(datasetName).subscribe((res: string) => {
            link.append(`<span>${res}</span>`);
          });
          
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
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: false,
      autoplaySpeed: 2000,
      swipe: false
    });
  }
  
  ngAfterViewInit()
  {
    let visualThis = this;
    $(document).ready(function()
    {
      $('.site-title>h2').css('transform', 'scale(1)');
      
      // visualThis.enableSlick();
    });
  }
}
