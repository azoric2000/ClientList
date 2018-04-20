var LIST = {
	env: "SIT",
    init: function() {      // first functions needed when a browser session begins
    	console.log('initaizing');
    	$('#target').load('client.html');
        $('#year').html(new Date().getFullYear());
        LIST.loadPage();
        LIST.changeEnv();
    },  // end init

    loadPage: function() {  // function to activate tab-based navigation
    	$('.nav li').click(function(){
    		$('.nav li').removeClass('active');
    		$(this).addClass('active');
    		$('#target').load($(this).attr('data-target'));
    	});
    },  // end loadPage

    loadFeatures: function(){   // loads the content list from the json endpoint into the left column of features.html. Intitializes a click event that activates targetFeature()
        $.getJSON("/ACClientList/services/properties/features", function(json) {

            var obj = json.response.features.values;

            var tx="<ul id='features'>";
            $.each( obj, function( key, value ) {
                 tx = tx + "<li data-value='" + key + "' data-label='" + value + "'> " + value + "</li>";
            });

            tx = tx + "</ul>";
            $('.listWrapper').html(tx);

            $('#features li').click(function(){
                var feat_c = $(this).attr('data-value');
                var feat_h = $(this).attr('data-label');
                LIST.targetFeature(feat_c, feat_h);
            });
        });
    },  // end loadFeatures

    targetFeature: function(feat_c, feat_h){    // from loadFeatures takes the metadata from the list and loads a list of clients based on feature.
        var txf="<h3>" + feat_h + "</h3><p id='count'></p>";
         $.getJSON("/ACClientList/services/properties/feature/" + feat_c + "/" + LIST.env, function(json) {
            for (var i = 0; i < json.response.featureInfo.clients.length; i++){
                txf = txf + "<div class='col-sm-4'> " + json.response.featureInfo.clients[i] + "</div>";
            }
              $('#results').html(txf);
              $('#count').html(json.response.featureInfo.clients.length + " Clients found");
         });
    },  // end targetFeature

    loadClients: function(){    // loads a full list of clients with both tridion name and DivPro name with checkbox

        //$.getJSON("/ACClientList/services/properties/clients/" + LIST.env, function(json) {
        $.getJSON("json/clients.json" , function(json) {  // for local dev purposes
            var tx="<ul id='list' class='list-group'>";
            var obj = json.response.clientList.values.entry;
            console.log(obj.length + " object length ");
            $.each( obj, function( idx, entry ) {
                tx = tx + "<li><label for='cb-" +  entry.key + "'>"
                tx = tx + "<input value='" +  entry.key + "' data-label='" + entry.key + "'  id='cb-" + entry.key + "'   type='checkbox' />";

                if (entry.value.indexOf('null') >=0){
                   tx = tx + entry.key
                }
                else{
                    tx = tx + entry.value ;
                }
                  tx = tx + "</label>";

                });

                setTimeout(function(){
                    var clientCount = $('#list li').length;
                    $('#clientMetaData').html(clientCount + ' clients loaded. ');
                },100);

            tx = tx + "</ul>";
            $('.listWrapper').html(tx);
            LIST.listFilter();
            LIST.listClientFeatures();
        });
    },  // end loadClients


    listFilter: function(){   // Filters the list of clients by text search.
        // custom css expression for a case-insensitive contains()
        jQuery.expr[':'].Contains = function(a,i,m){
            return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase())>=0;
        };

        $('.filterinput').change(function(){
            var filter = $(this).val();
            if(filter) {
                $('#list').find("label:not(:Contains(" + filter + "))").parent().addClass('hide');
                $('#list').find("label:Contains(" + filter + ")").parent().removeClass('hide');

            } else {
                $(list).find("li").removeClass('hide');
            }
            $('#clientMetaData').html($('#list li').length-$('#list li.hide').length + " clients loaded");
            return false;
        });

        $('.filterinput').keyup( function () {
           $(this).change();
        });

        $('#xbutton').click(function(){
            $('#list li').removeClass('hide');
            setTimeout(function(){
                $('.filterinput').change();
            },100 );

        });
    }, // end listFilter

    resetButton: function(){    // removes all client information from the main column.
    	$('#reset').click(function(){
    		$('input:checkbox').removeAttr('checked');
    		$('#featureList').html('');
    	});
    },

    listClientFeatures: function(){ //adds the client informaton into the main column based on checkbox values in the left column.
    	$('input:checkbox').change(function(){
    		if ($(this).prop('checked')){

                arrBrandColors = ['D95C05', 'F1AB00', 'B8B308', '7F8E2B', '006598','A21984'];
                i = Math.floor(Math.random()*arrBrandColors.length);

    			$('#featureList').append('<div class="clientBlock" id="' + $(this).val() + '"  style="border-left: solid 10px #' + arrBrandColors[i] + '"><img src="images/ban.gif"><p>Loading....</p> </div>');
                LIST.loadClientFeature($(this).attr('data-label'));
    		}
    		else{
    			$('#' + $(this).val()).remove();
    		}
    	});
    },

    minimize: function() {  // removes one selected client feature box from the screen.
        $('.min').click(function(){
            console.log('Minimizing...');
           var client = $(this).parent().attr('id');
           $('#' + client).remove();
           $('#cb-' + client).attr('checked', false);
        });
    },

    loadClientFeature: function(clientName){    //  Loads and displays all features available for a particular client.
        console.log('client name: ' + clientName);
        $.getJSON("json/abercrombie.json", function(json) { // for dev purposes
        //$.getJSON("/ACClientList/services/properties/client/" + clientName + "/" + LIST.env, function(json) {

            var obj1 = json.response.clientInfo.stringProperties;
            var obj2 = json.response.clientInfo.toggleProperties;
            var featureTable = "";
            var displayName;
            var env = $('#env').val()
            var envUrl = null;

            switch(env) {
                case "CERT":
                    envUrl = "https://comenity.net/"
                    break;
                case "UAT":
                    envUrl = "https:w2uat/"
                    break;
                case "SIT":
                    envUrl = "https://scolvmdac45.corp.alldata.net:7006/"
                    break;
                case "DEV":
                    envUrl = "https://scolvmdac45.corp.alldata.net:7004/"
                    break;

            }

            if (json.response.clientInfo.displayName.indexOf('null') >=0){
                displayName=clientName;
            }
            else{
                displayName= json.response.clientInfo.displayName + " (<a href='" + envUrl + clientName + "' target='blank'>" + clientName + "</a>)";
            }

            featureTable = featureTable + "<div class='min'></div><h3> " + displayName + "</h4><div class='featureheader'>";

/*            if (clientName.slice(-2) == 'er' ){
                featureTable = featureTable + "<p>" + clientName + "? I hardly know 'er!</p>";   // easter egg! :)
            }
*/
            $.each( obj1, function( key, value ) {
                featureTable = featureTable + "<span>" + key +  ": <b>" + value + "</b></span>";
            });

            $.each( obj2, function( key, value ) {
                featureTable = featureTable + "<span>";

                if((value == "yes")||(value == "no")){
                    featureTable = featureTable + "<div class='" + value + "'></div> <div class='key'><b>"+ key+"</b></div>";
                }
                else{
                 featureTable = featureTable + key + ": " + value;
                }
                featureTable = featureTable  + " </span>";
            });
            $('#' + clientName).html(featureTable);
            LIST.minimize();
         });
    },
    changeEnv: function() {
    	$('#env').on("change", function(){
    		LIST.env = this.value;
    		LIST.loadClients();
    		$('#reset').trigger("click");
    	});
    }
};

$(document).ready(function(){
	LIST.init();
});
