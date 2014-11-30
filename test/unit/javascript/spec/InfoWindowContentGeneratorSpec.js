describe("InfoWindowContentGenerator", function() {

    var title = "CD1025 Holiday Show";
    var website = "http://cd1025.com/event/cd1025-holiday-show-1";

    var eventJson;

    beforeEach(function() {
        eventJson = {
                        "title": title,
                        "artists":{
                           "artist":[
                              "Cage the Elephant",
                              "alt-J",
                              "Future Islands",
                              "Glass Animals"
                           ],
                           "headliner":"Cage the Elephant"
                        },
                        "venue":{
                           "name":"Lifestyle Communities Pavilion",
                           "location":{
                              "city":"Columbus",
                              "country":"United States",
                              "street":"405 Neil Ave.",
                              "postalcode":"43215"
                           },
                           "phonenumber":"(614) 461-5483",
                        },
                        "startDate":"Mon, 01 Dec 2014 18:00:00",
                        "url":"http://www.last.fm/event/3975004+CD1025+Holiday+Show",
                        "website": website
                     };
    });

    it("generates correct content", function() {
        var result = InfoWindowContentGenerator.generate(eventJson);
        expect(result).toBe('<p>'+title+'</p><p><a href="'+website+'">Event website</a></p>');
    });

    it("generates content without event website link if not available", function() {
        delete eventJson.website;
        var result = InfoWindowContentGenerator.generate(eventJson);
        expect(result).toBe('<p>'+title+'</p>');
    });

});
