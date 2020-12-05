//
//  SceneDelegate.swift
//  Alles Maps
//
//  Created by Adrian Baumgart on 22.11.20.
//

import UIKit
import CoreLocation

class SceneDelegate: UIResponder, UIWindowSceneDelegate {

	var window: UIWindow?
	let locationManager = CLLocationManager()
	var locationTimer: Timer!

	func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
		if let windowScene = scene as? UIWindowScene {
			let window = UIWindow(windowScene: windowScene)
			window.rootViewController = TabBarController()
			self.window = window
			window.makeKeyAndVisible()
			
			
			locationManager.requestAlwaysAuthorization()
			locationManager.requestWhenInUseAuthorization()
			
			if CLLocationManager.locationServicesEnabled() {
				locationManager.desiredAccuracy = kCLLocationAccuracyHundredMeters
				locationManager.startUpdatingLocation()
			}
			locationTimer = Timer.scheduledTimer(timeInterval: 5, target: self, selector: #selector(sendLocation), userInfo: nil, repeats: true)
			
		}
	}
	
	@objc func sendLocation() {
		if let location = locationManager.location {
			let latitude = location.coordinate.latitude
			let longitude = location.coordinate.longitude
			print(latitude)
			print(longitude)
			print("--------------------------")
		}
	}

	func sceneDidDisconnect(_ scene: UIScene) {
		// Called as the scene is being released by the system.
		// This occurs shortly after the scene enters the background, or when its session is discarded.
		// Release any resources associated with this scene that can be re-created the next time the scene connects.
		// The scene may re-connect later, as its session was not necessarily discarded (see `application:didDiscardSceneSessions` instead).
	}

	func sceneDidBecomeActive(_ scene: UIScene) {
		// Called when the scene has moved from an inactive state to an active state.
		// Use this method to restart any tasks that were paused (or not yet started) when the scene was inactive.
	}

	func sceneWillResignActive(_ scene: UIScene) {
		// Called when the scene will move from an active state to an inactive state.
		// This may occur due to temporary interruptions (ex. an incoming phone call).
	}

	func sceneWillEnterForeground(_ scene: UIScene) {
		// Called as the scene transitions from the background to the foreground.
		// Use this method to undo the changes made on entering the background.
	}

	func sceneDidEnterBackground(_ scene: UIScene) {
		// Called as the scene transitions from the foreground to the background.
		// Use this method to save data, release shared resources, and store enough scene-specific state information
		// to restore the scene back to its current state.
	}


}

