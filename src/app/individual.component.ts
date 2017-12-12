import { Component, OnInit } from '@angular/core';
import { FirebaseHelper } from './firebasehelper';
import { ActivatedRoute, ParamMap } from '@angular/router';

declare var $:any;

@Component({
  selector: 'app-individual',
  templateUrl: './individual.component.html'
})
export class IndividualComponent implements OnInit
{
  firebaseData = {};
  dataset : string;
  visualId : string;
  
  constructor (
    private route: ActivatedRoute
  ){}
  
  ngOnInit()
  {
    this.route.params.subscribe(val => {
      this.dataset = val.dataset;
      this.visualId = val.visualid;
    });
    
    this.getFirebaseData((visual) => {
      (<any>window).visualize.renderVisualFromConfig(visual, 'visual-container');
      
      this.createEmbedCode(visual);
    });
  }
  
  createEmbedCode(config) {
    let id = config.id;
    let strConfig = JSON.stringify(config);
    $('#embed-text').text(`
      <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
      <script src="https://www.gstatic.com/firebasejs/4.6.0/firebase.js"></script>
      <script src="https://www.gstatic.com/firebasejs/4.6.0/firebase-firestore.js"></script>
      <script src="https://d3js.org/d3.v4.min.js"></script>
      <script src="https://d3js.org/d3-selection-multi.v1.min.js"></script>
      <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDIWqV-QwqZnTNmvw7v89usuReSZOMzoKo"></script>

      <script src="https://sandbox.veniceprojectcenter.org/assets/prod/js/external.bundle.js"></script>
      <link rel="stylesheet" href="https://sandbox.veniceprojectcenter.org/assets/prod/css/external.css"/>
      <div id="${id}" style="text-align: center;"></div>
      <script>
        window.visualize.Firebase.initFirebase();
        window.visualize.renderVisualFromConfig(${strConfig}, '${id}');
      </script>
      `.trim())
    .focus(() => {
      $('#embed-text').select();
    });
    
    $('#copy-embed').click(() => {
      $('#embed-text').select();
      document.execCommand("Copy");
      $('#copy-embed').text('Copied!')
    });
  }

  async getFirebaseData(callback=undefined)
  {
    let result = await FirebaseHelper.getFirebaseData(this.dataset, this.visualId);
    
    this.firebaseData = result;
    if(callback !== undefined) {
      callback(result);
    }
  }
}
