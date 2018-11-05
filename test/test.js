// My API key:
// 2cK1XYfoKd3Fl3ZYysflTtbDA

$.ajax({
    url: "https://data.seattle.gov/resource/5src-czff.json?checkoutyear=2018",
    type: "GET",
    data: {
      "$limit" : 5000,
      "$$app_token" : "2cK1XYfoKd3Fl3ZYysflTtbDA"
    }
}).done(function(data) {
  alert("Retrieved " + data.length + " records from the dataset!");

  //experiment
  var subjectsList = [];
  data.forEach(function(checkout) {
    if (checkout.subjects != null) {
      var temp = checkout.subjects.split(',');
      temp.forEach(function(subject) {
        // console.log("This is subjects list now", subjectsList);
        // if (subjectsList[subject] != null) {
        //   subjectsList[subject] += 1;
        // } else {
        //   subjectsList[subject] = 1;
        // }
        if(subject != null) {
          subjectsList.push(subject);
        }
      });
    }
  });

  var frequencyCounts = {};
  var dictionary = [];
  for (var i = 0; i < subjectsList.length; i++) {
    var num = subjectsList[i];
    frequencyCounts[num] = (frequencyCounts[num] || 0) + 1;
  }

  for (var i = 0; i < Object.keys(frequencyCounts).length; i++) {
    var key = Object.keys(frequencyCounts)[i];
    var value = Object.values(frequencyCounts)[i];
    dictionary.push({"subject": key, "frequency": value })
  }

  dictionary.sort(function(a, b) {
    return b.frequency - a.frequency;
  });

  console.log(dictionary);



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
