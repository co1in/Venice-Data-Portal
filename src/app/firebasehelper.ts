declare var firebase:any;

export class FirebaseHelper
{
  static async getFirebaseData(datasetName, id = undefined)
  {
    const db = firebase.database();
    const tempFirebaseData = [];
    let ref;
    let result = {};
    if(id != undefined){
      ref = db.ref(`/viz/configs/${datasetName}`).child(id);
      await ref.once('value').then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if(doc.key === 'attributes')
          {
            result[doc.key] = JSON.parse(doc.val());
          }
          else
          {
            result[doc.key] = doc.val();
          }
          
        });
      });
      return result;
    }
    else {
      ref = db.ref(`/viz/configs/${datasetName}`);
      await ref.once('value').then((querySnapshot) => {
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
      
      let realNames = await (<any>window).visualize.getDataSetList();
      
      let results = {firebaseData: tempFirebaseData,
              realNames};
              
      return results;
    }
  }
  
  static async getDatasetNames()
  {
    let results = await this._internalGetFirebaseInfo();
    let datasets = [];
    for(let i = 0; i < results.info.length; i++) {
      if(!datasets.includes(results.info[i].dataSet)) {
        datasets.push(results.info[i].dataSet);
      }
    }
    
    return {datasets, realNames: results.realNames};
  }
  
  static async _internalGetFirebaseInfo(dataset = undefined) {
    const db = firebase.database();
    let results = [];
    let ref = await db.ref('/viz/info').once('value').then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const entry = doc.val();
        if(dataset === undefined || (dataset !== undefined && entry.dataSet === dataset)) {
          results.push(entry);
          console.log("Pushing: ", entry);
        }
      });
    });
    
    let realNames = await (<any>window).visualize.getDataSetList();
    return {info: results, realNames: realNames};
  }
}
