/**
 * Created by davidmoody on 3/7/15.
 */

function cleanFeatures(features){
    var cleanedFeatures = [];

    features.forEach(function(feature){
        //console.log("testing lat:" + feature.geometry.coordinates[0] + " and lon:" +  feature.geometry.coordinates[1] );

        if(!feature.geometry.coordinates[0] || !feature.geometry.coordinates[1]){
            console.log('bogus coordinate found');
        }else{
            cleanedFeatures.push(feature);
        }

    });

    return cleanedFeatures;
}