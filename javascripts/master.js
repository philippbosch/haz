$(document).ready(function() {
    var sectionTemplateSource = $('#section-template').html(),
        sectionTemplate = Handlebars.compile(sectionTemplateSource),
        useragentTemplateSource = $('#useragent-template').html(),
        useragentTemplate = Handlebars.compile(useragentTemplateSource),
        features = "";
    
    $.each(Modernizr.inputtypes, function(type, support) {
        $('html').addClass((!support?'no-':'')+'inputtypes-'+type);
    });
    
    $.getJSON('capabilities.json', function(capabilities) {
        $(capabilities.sections).each(function(i, section) {
            $('#features').append(sectionTemplate(section));
            
            $(section.features).each(function(i, feat) {
                features += feat.name + ", ";
            });
        });
        if (typeof(JSON) != 'undefined') $('#jdrop').show();
    });
    
    $('#useragent').html(useragentTemplate({'useragent': navigator.userAgent}));
    
    $('#jdrop').click(function(e) {
        $(this).attr('disabled', true);
        var data = {},
            yep = 0,
            nope = 0;
        $('#features section').each(function(i, section) {
            var title = $('header h1', section).text();
            data[title] = {};
            $('.feature', section).each(function(i, feature) {
                var name = $(feature).attr('class').replace(/\s?feature\s?/, ""),
                    isSupported = $('html').is('.' + name);
                data[title][name] = isSupported;
                if (isSupported) yep++;
                else nope++;
            });
        });
        data['user-agent'] = navigator.userAgent;
        SaveToJdrop('haz.io', navigator.userAgent, data, '1.0', yep + ' features supported, ' + nope + ' unsupported.');
        $(this).attr('disabled', false);
    });
});


/*
Copyright 2011 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

See the source code here:
     http://code.google.com/p/jdrop/
*/

// Code to embed in your bookmarklet to make it work with Jdrop.
// See http://jdrop.org/devdocs

function SaveToJdrop(appname, title, myDataObj, version, summary) {
    // create object of parameters to pass to Jdrop
    var params = { "appname": appname,
                   "title": title, 
                   "version": version,
                   "summary": summary,
                   "json": JSON.stringify(myDataObj) };

    // hidden iframe to use as target of form submit
    var jdropif = document.createElement("iframe");
    jdropif.style.display = "none";
    jdropif.name = "jdropiframe";
    jdropif.id = "jdropiframe";
    document.body.appendChild(jdropif);

    // form for posting data
    var jdropform = document.createElement("form");
    jdropform.method = "post";
    jdropform.action = "http://jdrop.org/save";
    jdropform.target = "jdropiframe";
    jdropform.style.display = "none";

    // add each param to the form as an input field
    for (var key in params) {
        var pInput = document.createElement("input");
        pInput.setAttribute("name", key);
        pInput.setAttribute("value", params[key]);
        jdropform.appendChild(pInput);
    }

    // submit the form and cleanup
    document.body.appendChild(jdropform);
    jdropif.onload = function() { document.body.removeChild(jdropform); document.body.removeChild(jdropif); };
    jdropif.onerror = function() { document.body.removeChild(jdropform); document.body.removeChild(jdropif); };
    jdropform.submit();
}
