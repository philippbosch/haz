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
            $feature.addClass('support-yes').find('> .support').text('yes');
        } else if (supported == 'no' || supported === '') {
            $feature.addClass('support-no').find('> .support').text('no');
        } else if (supported == 'maybe') {
            $feature.addClass('support-maybe').find('> .support').text('maybe');
        }
    }
    $.getJSON('capabilities.json?v=2.0', function(capabilities) {
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
    
    
    /* BrowserDetect,
       by PPK, http://www.quirksmode.org/js/detect.html */
    var BrowserDetect = {
        init: function () {
            this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
            this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version";
            this.OS = this.searchString(this.dataOS) || "an unknown OS";
        },
        searchString: function (data) {
            for (var i=0;i<data.length;i++) {
                var dataString = data[i].string;
                var dataProp = data[i].prop;
                this.versionSearchString = data[i].versionSearch || data[i].identity;
                if (dataString) {
                    if (dataString.indexOf(data[i].subString) != -1)
                        return data[i].identity;
                }
                else if (dataProp)
                    return data[i].identity;
            }
        },
        searchVersion: function (dataString) {
            var index = dataString.indexOf(this.versionSearchString);
            if (index == -1) return;
            return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
        },
        dataBrowser: [
            {
                string: navigator.userAgent,
                subString: "Chrome",
                identity: "Chrome"
            },
            {   string: navigator.userAgent,
                subString: "OmniWeb",
                versionSearch: "OmniWeb/",
                identity: "OmniWeb"
            },
            {
                string: navigator.vendor,
                subString: "Apple",
                identity: "Safari",
                versionSearch: "Version"
            },
            {
                prop: window.opera,
                identity: "Opera"
            },
            {
                string: navigator.vendor,
                subString: "iCab",
                identity: "iCab"
            },
            {
                string: navigator.vendor,
                subString: "KDE",
                identity: "Konqueror"
            },
            {
                string: navigator.userAgent,
                subString: "Firefox",
                identity: "Firefox"
            },
            {
                string: navigator.vendor,
                subString: "Camino",
                identity: "Camino"
            },
            {       // for newer Netscapes (6+)
                string: navigator.userAgent,
                subString: "Netscape",
                identity: "Netscape"
            },
            {
                string: navigator.userAgent,
                subString: "MSIE",
                identity: "Explorer",
                versionSearch: "MSIE"
            },
            {
                string: navigator.userAgent,
                subString: "Gecko",
                identity: "Mozilla",
                versionSearch: "rv"
            },
            {       // for older Netscapes (4-)
                string: navigator.userAgent,
                subString: "Mozilla",
                identity: "Netscape",
                versionSearch: "Mozilla"
            }
        ],
        dataOS : [
            {
                string: navigator.platform,
                subString: "Win",
                identity: "Windows"
            },
            {
                string: navigator.platform,
                subString: "Mac",
                identity: "Mac"
            },
            {
                   string: navigator.userAgent,
                   subString: "iPhone",
                   identity: "iPhone/iPod"
            },
            {
                string: navigator.platform,
                subString: "Linux",
                identity: "Linux"
            }
        ]

    };
    BrowserDetect.init();
    
    $('#useragent').html(useragentTemplate({'useragent': BrowserDetect.browser + ' ' + BrowserDetect.version + ' on ' + BrowserDetect.OS}));
});
