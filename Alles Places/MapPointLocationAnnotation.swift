//
//  MapPointLocationAnnotation.swift
//  Alles Maps
//
//  Created by Adrian Baumgart on 28.11.20.
//

import UIKit
import MapKit

class MapPointLocationAnnotation: MKPointAnnotation {
	var point: MapPoint!
	
	init(point: MapPoint) {
		super.init()
		self.point = point
		self.title = point.name
		self.subtitle = "XP available: \(point.xp)"
		self.coordinate = .init(latitude: point.latitude, longitude: point.longitude)
	}
}
