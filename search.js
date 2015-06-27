var ViewModel =function() {
	var self = this;
	self.list = ko.observableArray([
		{name: "Guangzhou"},
		{name: "Beijing"},
		{name: "Shenzhen"},
		{name: "Shanghai"},
		{name: "Hangzhou"},
		{name: "Chengdu"},
		{name: "Hongkong"}
	]);
	self.filterList = ko.observableArray();
	self.filterText = ko.observable();
	self.text = ko.observable('');

	self.search = function(data) {
		var filter = data();
		self.filterList.removeAll();

		for (var i = 0; i < self.list().length; i++) {
			if(self.list()[i].name.toLowerCase().indexOf(filter.toLowerCase()) >= 0) {
				self.filterList.push(self.list()[i]);
			}
		}
	}
}



ko.applyBindings(new ViewModel());