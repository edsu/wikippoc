function wikippoc(url, callback) {

  function clean(s) {
    return s.replace(/ ?[.;:]$/, '');
  }

  // fetch json view for the ppoc item
  var jsonUrl = url + "?fo=json";
  $.ajax({url: jsonUrl, dataType: "jsonp", success: function(data) {
    var item = data.item;
    var creators = item.creators.join(", ") || "";
    var repository = item.repository || "Library of Congress Prints and Photographs Division";
    
    // generate wikitext from the ppoc metadata
    item.wikitext = '<includeonly>{{#if:{{{creator|}}}|{{{' + creators + '}}}, |}}"{{#if:{{{file|}}}|[[commons:File:{{{file}}}|{{{title}}}]]|{{{' + item.title + '}}}}}". {{{' + clean(item.medium_brief) + '}}}, {{{' + clean(item.date) + '}}}. {{{' + repository + '}}}, [{{{' + item.link + '}}} {{{' + item.reproduction_number + '}}}].</includeonly>';

    callback(item);
  }});
}
