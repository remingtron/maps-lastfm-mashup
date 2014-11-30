var InfoWindowContentGenerator = {

    generate: function(event) {
        var content = '<p>'+event.title+'</p>';
        if (event.website) {
            content = content + '<p><a href="'+event.website+'">Event website</a></p>';
        }
        return content;
    }

};