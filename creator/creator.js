

function updateCreatorChart(type, name) {

    

d3.csv('../scatterplot_begins/library.csv', function(error, dataset) {

  if (error) throw error;
    
    var filteredData;
    
    if(type == "creator"){
        filteredData = dataset.filter(function(d) {
           if(d.creator == name) {
               return d;
           } 
        });
    } else if(type == "publisher"){
        filteredData = dataset.filter(function(d) {
            if(d.publisher == name) {
                return d;
            }
        });
    }
    

    console.log("filtered data");
    console.log(filteredData);
    
    var nestedFilteredData = d3.nest()
        .key(function(d) {
            return d.title;
        }).rollup(function(v) {
            return d3.sum(v, function(d) {
                return d.checkouts;
            });
        })
        .entries(filteredData);
    
    console.log("nested filtered data");
    console.log(nestedFilteredData);
    
    var newData=[];
    console.log(nestedFilteredData[0].key);
        
    for(var i =0 ; i < nestedFilteredData.length; i++){
        
        newData.push({
            title: nestedFilteredData[0].key,
            total_checkouts: nestedFilteredData[i].value
        });
    
    }
    
    console.log("newData");
    console.log(newData);
    
   
    
});
    
}
                