//
//  MapUserAnnotation.swift
//  Alles Maps
//
//  Created by Adrian Baumgart on 28.11.20.
//

import UIKit
import MapKit

class MapUserAnnotation: NSObject, MKAnnotation {
	
	let title: String?
	var subtitle: String?
	let locationName: String
	let coordinate: CLLocationCoordinate2D
	let user: MapUser
	
	init(user: MapUser) {
		self.user = user
		self.title = "\(user.name)"
		self.locationName = ""
		self.subtitle = "\(user.name)#\(user.tag)"
		self.coordinate = .init(latitude: user.latitude, longitude: user.longitude)
	}
}
