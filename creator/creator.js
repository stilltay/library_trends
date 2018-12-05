

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
    
  
});
    
}
                