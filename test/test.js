// My API key:
// 2cK1XYfoKd3Fl3ZYysflTtbDA


//https://data.seattle.gov/resource/tjb6-zsmc.json?$select=materialtype,count(checkouts)&$group=materialtype
//https://data.seattle.gov/resource/tjb6-zsmc.json?$select=title,count(checkouts),avg(checkouts)&$group=title&$where= (checkouts > 400)AND(checkoutyear=2016)
//top 10 book checkouts for a month and year
//https://data.seattle.gov/resource/tjb6-zsmc.json?$select=title&$order=checkouts DESC&$where=(checkoutyear=2014)AND(checkoutmonth=10)AND(materialtype='BOOK')
//https://data.seattle.gov/resource/tjb6-zsmc.json?$select=title,checkoutmonth,checkouts&$order=checkouts DESC&$where=(checkoutyear=2014)AND(materialtype='BOOK')

$.ajax({
    url: "https://data.seattle.gov/resource/tjb6-zsmc.json?$select=subjects,count(checkouts)&$group=subjects&$where=subjects like '%25FANTASY%25'",
    type: "GET",
    data: {
      "$limit" : 120,
      "$$app_token" : "gj5klMMMFIV45YA3S1Qkk8Ssd"
    }
}).done(function(data) {
  alert("Retrieved " + data.length + " records from the dataset!");

    /*
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
  });*/

    /*
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

*/

  // console.log(subjectsList.sort());
    
    console.log(data);

    /*
  var books = d3.select('#book-titles');

 books.selectAll('.book')
       .data(data)
       .enter()
       .append('p')
       .attr('class', 'bookr')
       .text(function(book){
          return book['title'] + '. ' + book['checkoutyear'] + ' about ' + book['checkouts'];
       });

    
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

    
*/
});
