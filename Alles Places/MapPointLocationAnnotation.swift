//
//  MapPointLocationAnnotation.swift
//  Alles Maps
//
//  Created by Adrian Baumgart on 28.11.20.
//

import UIKit
import MapKit

class MapPointLocationAnnotation: MKPointAnnotation {
	
	/*let title: String?
	var subtitle: String?*/
	//let locationName: String
	//let coordinate: CLLocationCoordinate2D
	var point: MapPoint!
	
	func setValues() {
		self.title = point.name
		//self.locationName = ""
		self.subtitle = "XP available: \(point.xp)"
		self.coordinate = .init(latitude: point.latitude, longitude: point.longitude)
	}
	
	init(point: MapPoint) {
		self.point = point
	}
	
	/*init(point: MapPoint) {
		//super.init()
		self.point = point
		self.title = point.name
		//self.locationName = ""
		self.subtitle = "XP available: \(point.xp)"
		self.coordinate = .init(latitude: point.latitude, longitude: point.longitude)
	}*/
}
