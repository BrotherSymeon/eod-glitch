

module.exports.fixData = function(jsonpFuncName, data){
    
  //replace the fucntion name part
    var retVal = data.replace(jsonpFuncName+"(", "");
    retVal = retVal.replace(");", "");
        
    //fix the coordinates by replacing number in between double quotes with just the number
    var quote = /"(.[0-9.]+)"/g;
    retVal = retVal.replace(quote, "$1"); 
    
    return retVal;
}