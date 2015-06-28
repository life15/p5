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
	}

	// Initialize marker of the place
	self.createMarker = function() {
		self.marker = new google.maps.Marker({
			map: googleMap,
			position: self.position
		});

		google.maps.event.addListener(self.marker, 'click', self.select);
	}

	// Add marker to the view
	self.addMarker = function() {
		self.marker.setMap(googleMap);
	}

	// Remove marker from the view
	self.removeMarker = function() {
		self.marker.setMap(null);
	}

	// Initialize infowindow of the place
	self.createInfowindow = function() {
		var button = '<input type="button" id="streetview-button" value="Street View">'
		self.infowindow = new google.maps.InfoWindow();
		self.infowindow.setContent('<h3>' + self.name + '</h3>' + button);
	}

	// Add infowindow to the view
	self.addInfowindow = function() {
		self.infowindow.open(googleMap, self.marker);
		var button = document.getElementById('streetview-button');
		google.maps.event.addDomListener(button, 'click', self.openStreetView);
	}

	self.closeInfowindow = function() {
		self.infowindow.close();
	}

	// Open google street view
	self.openStreetView = function() {
		self.panorama = googleMap.getStreetView();
		self.panorama.setPosition(self.position);
		self.panorama.setPov({
			heading:265,
			pitch:0
		});
		self.panorama.setVisible(true);
	}

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
	}
	self.init();
}

// Initialize google map
var googleMap;
function mapInit () {
	var initialCenter = new google.maps.LatLng(35.529792, 139.698568);
	var mapOptions = {
		center: initialCenter,
		zoom: 8,
		zoomControl: true,
		zoomControlOptions: {
			position: google.maps.ControlPosition.RIGHT_BOTTOM
		},
		scaleControl: true,
		panControl: false
	};
	googleMap = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}

var ViewModel = function() {
	var self = this;
	self.filterText = ko.observable();
	self.filterList = ko.observableArray();
	self.currentPlace = ko.observable();
	self.panorama = '';

	// neighbourhood places
	self.places = ko.observableArray([
		new Place({name: "Kanagawa", latLng: new google.maps.LatLng(35.529792, 139.698568)}),
		new Place({name: "Shibuya", latLng: new google.maps.LatLng(35.664035, 139.698212)}),
		new Place({name: "Tokyo Tower", latLng: new google.maps.LatLng(35.65858, 139.745433)}),
		new Place({name: "Fuji Mountain", latLng: new google.maps.LatLng(35.360556, 138.727778)})
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
	}

	self.removeMarkerAll = function() {
		for (var i = 0; i < self.places().length; i++) {
			self.places()[i].removeMarker();
		}
	}

	self.init = function() {
		mapInit();
		self.search(self.filterText);
	}
}