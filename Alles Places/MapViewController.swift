//
//  ViewController.swift
//  Alles Maps
//
//  Created by Adrian Baumgart on 22.11.20.
//

import UIKit
import MapKit
import class Kingfisher.KingfisherManager
import CoreLocation
import SwiftUI
import KingfisherSwiftUI
import SnapKit

class MapViewController: UIViewController {
	
	var mapView: MKMapView!
	
	var people: [MapUser] = [.init(id: "00000000-0000-0000-0000-000000000000", name: "Archie", tag: "0001", xp: 4651, level: 5, latitude: 51.50838413, longitude: -0.07616377), .init(id: "87cd0529-f41b-4075-a002-059bf2311ce7", name: "Lea", tag: "0001", xp: 2190, level: 3, latitude: 37.3348469, longitude: -122.01139216, isSignedInUser: true), .init(id: "5b0e1bcc-19b0-4c9e-9d98-b8fad3473920", name: "Hanna", tag: "2001", xp: 1100, level: 2, latitude: 40.78164629, longitude: -73.96661282), .init(id: "4f3c00c2-0191-481d-aa56-57cfa8ddaf67", name: "TheModdedChicken", tag: "9018", xp: 1678, level: 2, latitude: 38.8976998, longitude: -77.03655315), .init(id: "5fb01342-2c4c-4af5-9c87-6b657d17559f", name: "dolphin", tag: "0001", xp: 255, level: 1, latitude: 52.5185918, longitude: 13.3766658)]
	
	var locationWithPoints: [MapPoint] = [.init(id: "a07de27e-c2a6-4bd4-80da-f43d101c3dc0", name: "London Bridge", xp: 789, latitude: 51.50804895, longitude: -0.08767155, isNear: true), .init(id: "3eafae02-19e9-4fba-9b34-4aa2ec3e6c9c", name: "Apple Park", xp: 102, latitude: 37.33467237, longitude: -122.0089455, isNear: false)]
	
	var headerController: PeopleHeaderController!
	
	var swiftUIView: UIView!

	override func viewDidLoad() {
		super.viewDidLoad()
		
		mapView = MKMapView(frame: view.frame)
		view.addSubview(mapView)
		mapView.snp.makeConstraints { (make) in
			make.top.equalTo(view.snp.top)
			make.leading.equalTo(view.snp.leading)
			make.bottom.equalTo(view.snp.bottom)
			make.trailing.equalTo(view.snp.trailing)
		}
		mapView.register(MapUserAnnotation.self, forAnnotationViewWithReuseIdentifier: "mapUserAnnotation")
		mapView.register(MapPointLocationAnnotation.self, forAnnotationViewWithReuseIdentifier: "mapPointAnnotation")
		mapView.delegate = self
		
		headerController = PeopleHeaderController()
		headerController.people = people
		
		swiftUIView = UIHostingController(rootView: PeopleHeaderView(controller: headerController, delegate: self)).view
		swiftUIView?.backgroundColor = .clear
		mapView.addSubview(swiftUIView!)
		makeSwiftUIBarConstraints(hidden: false, animate: false)
		
	}
	
	func makeSwiftUIBarConstraints(hidden: Bool, animate: Bool) {
		swiftUIView.snp.removeConstraints()
		
		swiftUIView?.snp.updateConstraints({ (make) in
			make.top.equalTo(mapView.snp.top).offset(32)
			if hidden {
				make.width.equalTo(70)
			}
			else {
				make.leading.equalTo(mapView.snp.leading).offset(16)
			}
			make.trailing.equalTo(mapView.snp.trailing).offset(-16)
			make.height.equalTo(90)
		})
		if animate {
			UIView.animate(withDuration: 0.2) {
				self.view.layoutIfNeeded()
			}
		}
	}
	
	override func viewDidAppear(_ animated: Bool) {
		for person in people {
			let newPin = MapUserAnnotation(user: person)
			mapView.addAnnotation(newPin)
		}
		for point in locationWithPoints {
			let newPin = MapPointLocationAnnotation(point: point)
			mapView.addAnnotations([newPin])
		}
		mapView.setRegion(.init(center: .init(latitude: locationWithPoints[0].latitude, longitude: locationWithPoints[0].longitude), latitudinalMeters: 1000, longitudinalMeters: 1000), animated: true)
	}
}

extension MapViewController: PeopleHeaderViewDelegate {
	func zoomToPersonWithId(_ id: String) {
		if let foundPerson = people.first(where: { $0.id == id }) {
			mapView.setCenter(.init(latitude: foundPerson.latitude, longitude: foundPerson.longitude), animated: true)
		}
	}
	
	func hideView(_ bool: Bool) {
		makeSwiftUIBarConstraints(hidden: bool, animate: true)
	}
}

extension MapViewController: MKMapViewDelegate {
	func mapView(_ mapView: MKMapView, viewFor annotation: MKAnnotation) -> MKAnnotationView? {
		let Identifier = "Pin"
		let annotationView = mapView.dequeueReusableAnnotationView(withIdentifier: Identifier) ?? MKAnnotationView(annotation: annotation, reuseIdentifier: Identifier)
		   
			  annotationView.canShowCallout = true
			  if annotation is MKUserLocation {
				 return nil
			  } else if annotation is MapUserAnnotation {
				KingfisherManager.shared.retrieveImage(with: URL(string: "https://avatar.alles.cc/\((annotation as! MapUserAnnotation).user.id)")!, completionHandler: { (result) in
					switch result {
						case .success(let value):
							let size = CGSize(width: 50, height: 50)
							let image = value.image
							UIGraphicsBeginImageContext(size)
							image.draw(in: CGRect(x: 0, y: 0, width: size.width, height: size.height))
							let resizedImage = UIGraphicsGetImageFromCurrentImageContext()
							let imageView = UIImageView(frame: CGRect(x: 0, y: 0, width: 50, height: 50))
							imageView.image = resizedImage
							imageView.layer.cornerRadius = imageView.layer.frame.size.width / 2
							imageView.layer.masksToBounds = true
							imageView.layer.anchorPoint = CGPoint(x: 1, y: 1)
							annotationView.addSubview(imageView)
							
							let rightButton: AnyObject! = UIButton(type: .detailDisclosure)
							annotationView.rightCalloutAccessoryView = rightButton as? UIView

						case .failure(let error):
							print(error)
						}
				})
				 return annotationView
			} else if annotation is MapPointLocationAnnotation {
				let markerAnnotation = MKMarkerAnnotationView(annotation: annotation, reuseIdentifier: nil)
				markerAnnotation.canShowCallout = true
				
				if UIImagePickerController.isSourceTypeAvailable(.camera), (annotation as! MapPointLocationAnnotation).point.isNear {
					let rightButton = UIButton(type: .detailDisclosure)
					rightButton.setImage(UIImage(systemName: "camera.circle"), for: .normal)
					rightButton.tag = (annotation as! MapPointLocationAnnotation).point.tag
					rightButton.addTarget(self, action: #selector(takeImage(_:)), for: .touchUpInside)
					markerAnnotation.rightCalloutAccessoryView = rightButton
				}
				return markerAnnotation
			}
			else {
				 return nil
			  }
	}
	
	@objc func takeImage(_ sender: UIButton) {
		if let point = locationWithPoints.first(where: { $0.tag == sender.tag }) {
			let imagePicker = UIImagePickerController()
			imagePicker.sourceType = .camera
			imagePicker.delegate = self
			present(imagePicker, animated: true, completion: nil)
		}
	}
}

extension MapViewController: UIImagePickerControllerDelegate, UINavigationControllerDelegate {
	func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
		if let image = info[.originalImage] as? UIImage {
			print(image)
		}
	}
}

protocol PeopleHeaderViewDelegate {
	func zoomToPersonWithId(_ id: String)
	func hideView(_ bool: Bool)
}

struct PeopleHeaderView: View {
	
	@ObservedObject var controller: PeopleHeaderController
	var delegate: PeopleHeaderViewDelegate!
	@Environment(\.colorScheme) var colorScheme
	
	@State var showLocationSettingsMenu: Bool = false
	
	@State var isHidden: Bool = false {
		didSet {
			delegate.hideView(isHidden)
		}
	}
	
	var body: some View {
		ZStack {
			VisualEffectView(effect: UIBlurEffect(style: colorScheme == .dark ? .dark : .light))
				.cornerRadius(12)
			if isHidden {
				Button(action: {
					isHidden = false
				}, label: {
					Image(systemName: "chevron.left").resizable().aspectRatio(contentMode: .fit).frame(width: 15, alignment: .center)
						.padding(.leading, 4).padding(.trailing, 4)
				})
			}
			else {
				HStack {
					Button(action: {
						isHidden = true
					}, label: {
						Image(systemName: "chevron.right").resizable().aspectRatio(contentMode: .fit).frame(width: 15, alignment: .center)
							.padding(.leading, 4).padding(.trailing, 4)
					})
					ScrollView(.horizontal, showsIndicators: false, content: {
						HStack {
							ForEach(controller.people) { (person) in
								KFImage(URL(string: "https://avatar.alles.cc/\(person.id)")).resizable().frame(width: 50, height: 50).clipShape(Circle()).overlay(Circle().stroke(person.isSignedInUser ? Color.blue : Color.clear, lineWidth: person.isSignedInUser ? 2.0 : 0.0)).onTapGesture {
									delegate.zoomToPersonWithId(person.id)
								}.padding(4)
							}
						}
					})
					Button(action: {
						showLocationSettingsMenu.toggle()
					}, label: {
						Image(systemName: "location").resizable().frame(width: 25, height: 25, alignment: .center)
					}).padding(.leading, 4).padding(.trailing, 4)
					.actionSheet(isPresented: $showLocationSettingsMenu, content: {
						ActionSheet(title: Text("Location settings"), message: Text("Please select who should be able to see your location"), buttons: [
										.default(Text("Anyone"), action: {}),
										.default(Text("Friends only"), action: {}),
										.default(Text("Nobody"), action: {}),
										.cancel()])
					})
				}.padding()
			}
		}.background(Color.clear)
		.gesture(DragGesture()
					.onEnded({ (value) in
						if value.translation.width > 100, !isHidden {
							isHidden = true
						}
						else if value.translation.width < -100, isHidden {
							isHidden = false
						}
					}))
	}
}

class PeopleHeaderController: ObservableObject {
	@Published var people = [MapUser]()
}

struct VisualEffectView: UIViewRepresentable {
	var effect: UIVisualEffect?
	func makeUIView(context: UIViewRepresentableContext<Self>) -> UIVisualEffectView { UIVisualEffectView() }
	func updateUIView(_ uiView: UIVisualEffectView, context: UIViewRepresentableContext<Self>) { uiView.effect = effect }
}
