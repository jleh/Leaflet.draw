describe("L.Edit", function () {
	var map;

	beforeEach(function () {
		map = new L.Map(document.createElement('div')).setView([0, 0], 15);
	});

	describe("L.Edit.Marker", function () {
		var marker;

		beforeEach(function () {
			marker = new L.Marker(new L.LatLng(1, 2)).addTo(map);
			marker.editing.enable();
		});

		it("Has the leaflet-edit-marker-selected class applied when enabled.", function () {
			var editingClass = 'leaflet-edit-marker-selected';

			expect(marker.editing.enabled()).to.equal(true);
			expect(L.DomUtil.hasClass(marker._icon, editingClass)).to.equal(true);
		});

		it("Lacks the leaflet-edit-marker-selected class when disabled.", function () {
			var editingClass = 'leaflet-edit-marker-selected';

			marker.editing.disable();

			expect(marker.editing.enabled()).to.equal(false);
			expect(L.DomUtil.hasClass(marker._icon, editingClass)).to.equal(false);
		});
	});

	describe("L.Edit.Circle", function () {
		var circle;

		beforeEach(function () {
			circle = new L.Circle(new L.LatLng(1, 2), 5).addTo(map);
			circle.editing.enable();
		});

		it("Is activated correctly when editing.enable() is called.", function () {});

		it("Moves the circle to the correct latlng", function () {
			var newLatLng = new L.LatLng(3, 5);

			circle.editing._move(newLatLng);
			expect(circle.getLatLng()).to.eql(newLatLng);
		});
	});

	describe("L.Edit.Poly", function () {
		var edit,
			drawnItems,
			poly;

		beforeEach(function () {
			drawnItems = new L.FeatureGroup().addTo(map);
			edit = new L.EditToolbar.Edit(map, {
				featureGroup: drawnItems,
				poly: {
					allowIntersection : false
				},
				selectedPathOptions: L.EditToolbar.prototype.options.edit.selectedPathOptions
			});
			poly = new L.Polyline(L.latLng(41, -87), L.latLng(42, -88));
		});

		it("Should change the style of the polyline during editing mode.", function () {
			var originalOptions = L.extend({}, poly.options);

			drawnItems.addLayer(poly);
			edit.enable();

			expect(poly.editing.enabled()).to.equal(true);
			expect(poly.options).not.to.eql(originalOptions);
		});

		it("Should revert to original styles when editing is toggled.", function () {
			var originalOptions = L.extend({maintainColor: false, poly : {allowIntersection: false} }, poly.options);

			console.log(JSON.stringify(originalOptions));
			drawnItems.addLayer(poly);
			edit.enable();
			edit.disable();
			console.log(JSON.stringify(poly.options));
			expect(poly.options).to.eql(originalOptions);
		});

		it("Should set allowIntersection to be false when setting is set", function () {

			drawnItems.addLayer(poly);
			edit.enable();

			expect(poly.editing.enabled()).to.equal(true);
			expect(poly.options.poly.allowIntersection).to.equal(false);

		});
/*
		it("Should allow to edit holes in polygon.", function () {
			var coords = [
	            [ [0, 0], [0, 1], [1, 1], [1, 0], [0, 0] ],
	            [ [0.25, 0.25], [0.25, 0.75], [0.75, 0.75], [0.75, 0.25], [0.25, 0.25] ]
	        ];
			var polygonWithHole = new L.Polygon(coords).addTo(map);

			polygonWithHole.editing.enable();

			var markerCount = map.getContainer().getElementsByClassName("leaflet-marker-icon").length;

			expect(markerCount).to.eql(16);
		}); */
	});
});
