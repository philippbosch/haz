$(document).ready(function() {
    var sectionTemplateSource = $('#section-template').html(),
        sectionTemplate = Handlebars.compile(sectionTemplateSource),
        useragentTemplateSource = $('#useragent-template').html(),
        useragentTemplate = Handlebars.compile(useragentTemplateSource),
        features = "";
    
    $.each(Modernizr.input, function(attr, support) {
        $('html').addClass((!support?'no-':'')+'input-'+attr);
    });
    
    $.each(Modernizr.inputtypes, function(type, support) {
        $('html').addClass((!support?'no-':'')+'inputtypes-'+type);
    });
    
    $.each(Modernizr.video, function(type, support) {
        $('html').addClass((support===''?'no-':(support=='maybe'?'maybe-':''))+'video-'+type);
    });
    
    $.each(Modernizr.audio, function(type, support) {
        $('html').addClass((support===''?'no-':(support=='maybe'?'maybe-':''))+'audio-'+type);
    });
    
    $.getJSON('capabilities.json?v=1.2', function(capabilities) {
        $(capabilities.sections).each(function(i, section) {
            $('#features').append(sectionTemplate(section));
            
            $(section.features).each(function(i, feat) {
                features += feat.name + ", ";
            });
        });
        if (typeof(JSON) != 'undefined') $('#jdrop').show();
    });
    
    $('#useragent').html(useragentTemplate({'useragent': navigator.userAgent}));
});
