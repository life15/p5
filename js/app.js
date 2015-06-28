// Global variable to communicate with the ViewModel
var appView;

// Initialize the map, as soon as the document is ready
$(document).ready(function() {
  appView = new ViewModel();
  ko.applyBindings(appView);
});