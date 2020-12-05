//
//  TabBarController.swift
//  Alles Maps
//
//  Created by Adrian Baumgart on 28.11.20.
//

import UIKit

class TabBarController: UITabBarController {
	
	private lazy var mapViewController = makeMapViewController()

	var mentionsTimer = Timer()

	override func viewDidLoad() {
		super.viewDidLoad()
		viewControllers = [mapViewController]
		selectedIndex = 0
	}

	override func viewWillAppear(_ animated: Bool) {
		super.viewWillAppear(animated)
	}
}

private extension TabBarController {
	private func makeMapViewController() -> UIViewController {
		let vc = MapViewController()
		vc.tabBarItem = UITabBarItem(title: "Map",
									 image: UIImage(systemName: "map"),
									 tag: 0)
		return vc
	}
}
