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
    
    
    function setSupport($feature, supported) {
        if (supported == 'yes' || supported == 'probably') {
            $feature.addClass('support-yes').find('> .support').text('Y').attr('title', 'yes');
        } else if (supported == 'no' || supported === '') {
            $feature.addClass('support-no').find('> .support').text('N').attr('title', 'no');
        } else if (supported == 'maybe') {
            $feature.addClass('support-maybe').find('> .support').text('M').attr('title', 'maybe');
        }
    }
    $.getJSON('capabilities.json?v=1.3.1', function(capabilities) {
        $(capabilities.sections).each(function(i, section) {
            $('#features').append(sectionTemplate(section));
            $(section.features).each(function(i, feature) {
                var supported,
                    $feature = $('.feature.' + section.name + '-' + feature.name);
                if (!(section.name in Modernizr)) {
                    supported = !!Modernizr[feature.name] ? 'yes' : 'no';
                } else {
                    supported = !!Modernizr[section.name][feature.name] ? 'yes' : 'no';
                }
                setSupport($feature, supported);
                
                if(feature.subfeatures) {
                    $(feature.subfeatures).each(function(i, subfeature) {
                        var supported = !!Modernizr[feature.name] && Modernizr[feature.name][subfeature.name.substr(subfeature.name.indexOf('-')+1)] || 'no',
                            $subfeature = $('.feature.' + subfeature.name);
                        setSupport($subfeature, supported);
                    });
                }
            });
        });
    });
    
    $('#useragent').html(useragentTemplate({'useragent': navigator.userAgent}));
});
