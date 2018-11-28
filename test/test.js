// My API key:
// 2cK1XYfoKd3Fl3ZYysflTtbDA

$.ajax({
    url: "https://data.seattle.gov/resource/tjb6-zsmc.json?$where=checkouts > 400",
    type: "GET",
    data: {
      "$limit" : 10000,
      "$$app_token" : "2cK1XYfoKd3Fl3ZYysflTtbDA"
    }
}).done(function(data) {
  alert("Retrieved " + data.length + " records from the dataset!");

  //experiment
  var titlewordsList = [];
  data.forEach(function(checkout) {
    if (checkout.itemtitle != null) {
      var temp = checkout.itemtitle.split(" ");
      temp.forEach(function(title) {
        // console.log("This is subjects list now", subjectsList);
        // if (subjectsList[subject] != null) {
        //   subjectsList[subject] += 1;
        // } else {
        //   subjectsList[subject] = 1;
        // }
        if(title != null) {
          titlewordsList.push(title);
        }
      });
    }
  });

  // var frequencyCounts = {};
  // var dictionary = [];
  // for (var i = 0; i < titlewordsList.length; i++) {
  //   var num = titlewordsList[i];
  //   frequencyCounts[num] = (frequencyCounts[num] || 0) + 1;
  // }
  //
  // for (var i = 0; i < Object.keys(titlewordsList).length; i++) {
  //   var key = Object.keys(frequencyCounts)[i];
  //   var value = Object.values(frequencyCounts)[i];
  //   dictionary.push({"subject": key, "frequency": value })
  // }
  //
  // dictionary.sort(function(a, b) {
  //   return b.frequency - a.frequency;
  // });
  //
  // console.log(dictionary);



  // console.log(subjectsList.sort());

  var books = d3.select('#book-titles');

  // books.selectAll('.book')
  //     .data(data)
  //     .enter()
  //     .append('p')
  //     .attr('class', 'bookr')
  //     .text(function(book){
  //         return book['itemtitle'] + '. ' + book['collection'] + ' about ' + book['subjects'];
  //     });

    var bkTableBody = d3.select('#book-table tbody');

    var trBook = bkTableBody.selectAll('tr')
        .data(data)
        .enter()
        .append('tr');

    trBook.append('td')
        .style('text-align','center')
        .text(function(book){
            return book['title'];
        });

    trBook.append('td')
        .text(function(book){
            return book['checkoutyear'];
        });

    trBook.append('td')
        .style('text-align','center')
        .text(function(book){
            return book['checkouts'];
        });

});
