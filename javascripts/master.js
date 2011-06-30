$(document).ready(function() {
    var sectionTemplateSource = $('#section-template').html(),
        sectionTemplate = Handlebars.compile(sectionTemplateSource),
        footerTemplateSource = $('#footer-template').html(),
        footerTemplate = Handlebars.compile(footerTemplateSource),
        features = "";
    
    $.getJSON('capabilities.json', function(capabilities) {
        $(capabilities.sections).each(function(i, section) {
            $('#features').append(sectionTemplate(section));
            
            $(section.features).each(function(i, feat) {
                features += feat.name + ", ";
            });
        });
    });
    
    $('#footer').html(footerTemplate({'useragent': navigator.userAgent}));
});
