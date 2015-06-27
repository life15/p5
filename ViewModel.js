var Place = function(data) {
	var self = this;
	self.name = data.name;
	self.position = data.latLng;
	self.marker = '';
	// self.infowindow = '';

	// Initialize the place object
	self.init = function() {
		self.createMarker();
		// self.createInfowindow();
	}

	// Initialize marker of the place
	self.createMarker = function() {
		self.marker = new google.maps.Marker({
			map: googleMap,
			position: self.position
		});

		// google.maps.event.addListener(self.marker, 'click', self.addInfowindow);
	}

	// Add marker to the view
	self.addMarker = function() {
		self.marker.setMap(googleMap);
	}

	// Remove marker from the view
	self.removeMarker = function() {
		self.marker.setMap(null);
	}

	// Initialzie infowindow of the place
	// self.createInfowindow = function() {
	// 	self.infowindow = new google.maps.InfoWindow();
	// 	self.infowindow.setContent('hello world');
	// }

	// Add infowindow to the view
	// self.addInfowindow = function() {
	// 	self.infowindow.open(googleMap, self.marker);
	// }

	self.init();
}

var googleMap;
function mapInit () {
	var initialCenter = new google.maps.LatLng(35.529792, 139.698568);
	googleMap = new google.maps.Map(document.getElementById('map-canvas'), {
		center: initialCenter,
		zoom: 12
	});
}
google.maps.event.addDomListener(window, 'load', mapInit);



var ViewModel = function() {
	var self = this;
	self.fiterText = ko.observable();
	self.filterList = ko.observableArray();

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
}