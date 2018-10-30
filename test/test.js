// My API key:
// 2cK1XYfoKd3Fl3ZYysflTtbDA

$.ajax({
    url: "https://data.seattle.gov/resource/5src-czff.json?itemtype=acdvd",
    type: "GET",
    data: {
      "$limit" : 5000,
      "$$app_token" : "2cK1XYfoKd3Fl3ZYysflTtbDA"
    }
}).done(function(data) {
  alert("Retrieved " + data.length + " records from the dataset!");
  console.log(data);

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
            return book['itemtitle'];
        });

    trBook.append('td')
        .text(function(book){
            return book['collection'];
        });

    trBook.append('td')
        .style('text-align','center')
        .text(function(book){
            return book['subjects'];
        });

});
