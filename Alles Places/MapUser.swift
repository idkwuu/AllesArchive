//
//  MapUser.swift
//  Alles Maps
//
//  Created by Adrian Baumgart on 28.11.20.
//

import Foundation
import CoreLocation

struct MapUser: Identifiable {
	var id: String
	var name: String
	var tag: String
	var xp: Int
	var level: Int
	var latitude: Double
	var longitude: Double
	var isSignedInUser: Bool = false
}
