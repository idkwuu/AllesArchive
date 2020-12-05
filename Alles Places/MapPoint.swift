//
//  MapPoints.swift
//  Alles Maps
//
//  Created by Adrian Baumgart on 28.11.20.
//

import Foundation

struct MapPoint {
	var id: String
	var name: String
	var xp: Int
	var latitude: Double
	var longitude: Double
	var tag: Int
	var isNear: Bool
	
	init(id: String, name: String, xp: Int, latitude: Double, longitude: Double, isNear: Bool) {
		self.id = id
		self.name = name
		self.xp = xp
		self.latitude = latitude
		self.longitude = longitude
		self.tag = Int.random(in: 0...9999999)
		self.isNear = isNear
	}
}
