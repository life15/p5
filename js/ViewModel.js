var Place = function(data) {
	var self = this;
	self.name = data.name;
	self.position = data.latLng;
	self.marker = '';
	self.infowindow = '';
	self.selected = ko.observable(false);
	self.panorama = '';

	// Initialize the place object
	self.init = function() {
		self.createMarker();
		self.createInfowindow();
	};

	// Initialize marker of the place
	self.createMarker = function() {
		self.marker = new google.maps.Marker({
			map: googleMap,
			position: self.position
		});

		google.maps.event.addListener(self.marker, 'click', self.select);
	};

	// Add marker to the view
	self.addMarker = function() {
		self.marker.setMap(googleMap);
	};

	// Remove marker from the view
	self.removeMarker = function() {
		self.marker.setMap(null);
	};

	// Initialize infowindow of the place
	self.createInfowindow = function() {
		var button = '<input type="button" id="streetview-button" value="Show Street View!">';
		var foursquareTitle = '<h4>Foursquare Explore</h4>';
		var foursquareVenuesList = '<ul>' +
		'<li class="foursquare-venues-list" id="1">: )</li>' +
		'<li class="foursquare-venues-list" id="2">: )</li>' +
		'<li class="foursquare-venues-list" id="3">: )</li>' +
		'<li class="foursquare-venues-list" id="4">: )</li>' +
		'<li class="foursquare-venues-list" id="5">: )</li>' +
		'</ul>';
		var foursquareDiv = foursquareTitle + foursquareVenuesList;

		self.infowindow = new google.maps.InfoWindow();
		self.infowindow.setContent('<h3>' + self.name + '</h3>' + button + foursquareDiv);
	};

	// Add infowindow to the view
	self.addInfowindow = function() {
		self.infowindow.open(googleMap, self.marker);

		// Click streetview button to open street view
		var button = document.getElementById('streetview-button');
		google.maps.event.addDomListener(button, 'click', self.openStreetView);

		// Add foursquare explore to the info window
		self.foursquare();
	};

	self.closeInfowindow = function() {
		self.infowindow.close();
	};

	// Open google street view
	self.openStreetView = function() {
		self.panorama = googleMap.getStreetView();
		self.panorama.setPosition(self.position);
		self.panorama.setPov({
			heading:265,
			pitch:0
		});
		self.panorama.setVisible(true);
	};

	// Change view to selected place
	self.select = function() {
		if (appView.currentPlace() != undefined) {
			appView.currentPlace().closeInfowindow();
			appView.currentPlace().selected(false);
		}

		appView.currentPlace(self);
		self.selected(true);
		appView.currentPlace().addInfowindow();

		// Close streetview when selected other placesv
		var streetview = googleMap.getStreetView();
		streetview.setVisible(false);
	};

	// Foursquare
	self.foursquare = function() {
		var requestURL = 'https://api.foursquare.com/v2/venues/search?client_id=30I2B2LAU5IZAOFV0MGRNAYRRX4TGX2VA0J3AF4IGHT41WBM&client_secret=PZUEZLKCH4WYXXFDI0F343K4VA1DC5T0UCTK4JWDSXOLPNZB&v=20130815&limit=5&near=' + self.name;
		$.getJSON(requestURL, function(data) {
			for (var i = 0; i < data.response.venues.length; i++) {
				var listID = '.foursquare-venues-list' + '#' + i;
				// $('#foursquare-venues-list').append(listItem);
				if(data.response.venues[i].name) {
					$(listID).html(data.response.venues[i].name);
				}
			}
		}).fail( function() {
			alert('Cannot get Foursquare explores!');
		});
	};

	self.init();
}

// Initialize google map
var googleMap;
function mapInit () {
	var initialCenter = new google.maps.LatLng(22.246404, 114.176574);
	var mapOptions = {
		center: initialCenter,
		zoom: 12,
		zoomControl: true,
		zoomControlOptions: {
			position: google.maps.ControlPosition.RIGHT_BOTTOM
		},
		scaleControl: true,
		panControl: false
	};
	googleMap = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
};

var ViewModel = function() {
	var self = this;
	self.filterText = ko.observable();
	self.filterList = ko.observableArray();
	self.currentPlace = ko.observable();
	self.panorama = '';

	// neighbourhood places
	self.places = ko.observableArray([
		new Place({name: "Hong Kong Coliseum", latLng: new google.maps.LatLng(22.301592, 114.182005)}),
		new Place({name: "Ocean Park", latLng: new google.maps.LatLng(22.246404, 114.176574)}),
		new Place({name: "Tsim Sha Tsui", latLng: new google.maps.LatLng(22.297602, 114.172156)}),
		new Place({name: "Union Square", latLng: new google.maps.LatLng(22.304322, 114.161577)})
	]);

	// Search and filter
	self.search = function(data) {
		var filter = data();
		self.filterList.removeAll();
		self.removeMarkerAll();

		// Display all places when no input in search box
		if(!filter) {filter = "";}
		for (var i = 0; i < self.places().length; i++) {
			if(self.places()[i].name.toLowerCase().indexOf(filter.toLowerCase()) >= 0) {
				self.places()[i].addMarker();
				self.filterList.push(self.places()[i]);
			}
		}
	};

	// Removce all markers
	self.removeMarkerAll = function() {
		for (var i = 0; i < self.places().length; i++) {
			self.places()[i].removeMarker();
		}
	};

	// Initialize view model
	self.init = function() {
		mapInit();
		self.search(self.filterText);
	};
};