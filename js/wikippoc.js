function wikippoc(url, callback) {

  function clean(s) {
    return s.replace(/ ?[.;:]$/, '');
  }

  // fetch json view for the ppoc item
  var jsonUrl = url + "?fo=json";
  $.ajax({url: jsonUrl, dataType: "jsonp", success: function(data) {
    var item = data.item;

    // get the id, but strip off uncessary text
    var id = item.reproduction_number.split(" ")[0];

    // squash the creators down
    var creators = item.creators.map(function(c) {return c.title}).join(", ");

    // the repository
    var repository = item.repository || "Library of Congress Prints and Photographs Division";
    
    // generate wikitext from the ppoc metadata
    item.wikitext = '<ref group="image">{{User:Dominic/Cite|title=' + item.title + '|creator=' + creators + '|medium=' + clean(item.medium_brief) + '|id=' + id + '|url=' + item.link + '|repository=' + repository + '|date=' + clean(item.date) + '}}</ref>';
    callback(item);
  }});
}
