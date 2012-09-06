/*
 * Get JSON metadata for a PPOC item
 * @hint {String} either a PPOC url, handle or identifier
 * @callback {Function} callback that receives the JavaScript object
 * @fileNameOnCommons {String} optional; file name of image on Commons
 */

function wikippoc(url, callback, fileNameOnCommons) {

  function clean(s) {
    return s.replace(/ ?[.;:]$/, '');
  }

  // figure out the json view URL for the ppoc item
  var jsonUrl = null;
  if (url.match(/^http:\/\/(www\.)?loc.gov\/pictures\//)) {
    jsonUrl = url + "?fo=json";
  } else if (url.match(/^http:\/\/hdl.loc.gov\/loc.pnp\//)) {
    jsonUrl = "http://www.loc.gov/pictures/resource/" + url.match(/loc.pnp\/(.+)\/?$/)[1] + "/?fo=json";
  } else {
    jsonUrl = "http://www.loc.gov/pictures/resource/" + url + "/?fo=json";
  }

  $.ajax({url: jsonUrl, dataType: "jsonp", success: function(data) {
    var item = data.item;

    // get the id, but strip off unnecessary text
    var id = item.reproduction_number.split(" ")[0];

    // get the handle url
    var url = item.resource_links[0]; 

    // squash the creators down
    var creators = item.creators.map(function(c) {return c.title}).join(", ");

    // the repository, trim off address if present
    var repository = item.repository || "Library of Congress Prints and Photographs Division";
    var match = repository.match(/(.+) Washington/);
    if (match) repository = match[1];
    
    // get medium, but strip off numbers and capitalize for citation style
    var medium = clean(item.medium_brief.replace(/^\d+\s/,"")).charAt(0).toUpperCase() + clean(item.medium_brief.replace(/^\d+\s/,"")).slice(1);

    // generate wikitext from the ppoc metadata
    item.wikitext = ('<ref group="image">{{User:Dominic/Cite|title=' +
                     item.title +
                     '|creator=' + creators +
                     '|medium=' + medium +
                     '|id=' + id +
                     '|url=' + url +
                     '|repository=' + repository +
                     '|date=' + clean(item.date) +
                     (typeof fileNameOnCommons !== 'undefined' && fileNameOnCommons !== ''
                      ? '|file=' + fileNameOnCommons
                      : '') +
                     '}}</ref>');
    callback(item);
  }});
}
