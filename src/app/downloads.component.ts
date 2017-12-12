import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { FirebaseHelper } from './firebasehelper';
import { TranslateService } from '@ngx-translate/core';

declare var $:any;
declare var visualize:any;

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.component.html'
})
export class DownloadsComponent implements OnInit, AfterViewChecked
{
  datasetNames = [];
  realNames = {};
  showLoader = false;
  
  constructor(private translate : TranslateService){}
  
  async getFirebaseInfo(callback=undefined)
  {
    let results = await FirebaseHelper.getDatasetNames();
    
    this.realNames = {};
    for(let i = 0; i < results.realNames.length; i++)
    {
      this.realNames[results.realNames[i].id] = results.realNames[i].name;
    }
    
    this.datasetNames = results.datasets;
    if(callback !== undefined) {
      callback();
    }
  }
  
  ngOnInit()
  {
    (<any>window).visualize.Data.fetchDataSets((datasets) => {
      this.realNames = {};
      this.datasetNames = [];
      for(let i = 0; i < datasets.length; i++)
      {
        this.datasetNames.push(datasets[i].id);
        this.translate.get(datasets[i].id).subscribe((res : string) => {
          this.realNames[datasets[i].id] = res;
        })
      }
    });
  }
  
  ngAfterViewChecked()
  {
    let outerThis = this;
    $(".download-link").each(function(index)
    {
      $(this).off('click').on('click', function() {
        $('.dataset-block').attr('disabled', 'true');
        outerThis.showLoader = true;
        let dataset = $(this).data('dataset');
        (<any>window).visualize.Data.fetchData(dataset, (data) => {
          $('.dataset-block').removeAttr('disabled');
          outerThis.showLoader = false;
          if(data.length == 0)
          {
            alert(`There was an error downloading the ${dataset} dataset.`);
          }
          else
          {
            outerThis.downloadObjectAsJson(data, outerThis.realNames[dataset]);
          }
        });
      })
    });
  }
  
  downloadObjectAsJson(exportObj, exportName){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
}
