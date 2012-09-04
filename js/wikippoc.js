function wikippoc(url, callback) {

  function clean(s) {
    return s.replace(/ ?[.;:]$/, '');
  }

  // fetch json view for the ppoc item
  var jsonUrl = url + "?fo=json";
  $.ajax({url: jsonUrl, dataType: "jsonp", success: function(data) {
    var item = data.item;

    // get the id, but strip off unnecessary text
    var id = item.reproduction_number.split(" ")[0];

    // squash the creators down
    var creators = item.creators.map(function(c) {return c.title}).join(", ");

    // the repository
    var repository = item.repository || "Library of Congress Prints and Photographs Division";
    
    // get medium, but strip off numbers and capitalize for citation style
    var medium = clean(item.medium_brief.replace(/^\d+\s/,"")).charAt(0).toUpperCase() + clean(item.medium_brief.replace(/^\d+\s/,"")).slice(1);

    // generate wikitext from the ppoc metadata
    item.wikitext = '<ref group="image">{{User:Dominic/Cite|title=' + item.title + '|creator=' + creators + '|medium=' + medium + '|id=' + id + '|url=' + item.link + '|repository=' + repository + '|date=' + clean(item.date) + '}}</ref>';
    callback(item);
  }});
}
