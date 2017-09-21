(function() {
	var test = false;
	// Initialize Firebase
	const config = {
    apiKey: "AIzaSyDeWc7f-nohx0NRG5Yq7ma2MpzfFI9W_ng",
    authDomain: "kinesensors.firebaseapp.com",
    databaseURL: "https://kinesensors.firebaseio.com",
    projectId: "kinesensors",
    storageBucket: "",
    messagingSenderId: "793802367050"
  };
	firebase.initializeApp(config);

	/*var ctx = document.getElementById("canvas").getContext('2d');
	ctx.font = "40px Arial";*/

	var dirOnPhone = document.getElementById('valueDir')//Direction de la tête
	var valInDeg = document.getElementById('valInDegrees');//La value en degrés depuis l'initialisation
	var test = false;//Le gyroscope est plus ou moins en face de l'écran au départ

	const preDir = document.getElementById('dir');

	const dbRefDir = firebase.database().ref('position/dir');

	console.log(performance.now() + " - startTime");

	dbRefDir.on('value', function(snap) {
		console.log(performance.now() + " -%c switchStart ", 'background: #f8f;');
		dirOnPhone.innerHTML = snap.val();
		switch(snap.val()) {
			case 'Gauche':
				/*ctx.fillText(String.fromCharCode(Math.random() * (90 - 65) + 65),30,(canvas.height * 0.5));*/
				console.log(performance.now() + " -%c gauche", 'background: #0a5;');
				break;
			case 'Droite':
				/*ctx.fillText(String.fromCharCode(Math.random() * (90 - 65) + 65),(canvas.width - 30),(canvas.height * 0.5));*/
				console.log(performance.now() + " -%c droite", 'background: #0a5;');
				break;
			case 'Face':
				/*ctx.clearRect(0, 0, canvas.width, canvas.height);*/
				console.log(performance.now() + " -%c face", 'background: #a11;');
				break;
		}
	});
	function speedTest(degStart, rotation) {
		var start = degStart;
			setTimeout(function(){
				var stop = rotation;
			},10);
			var total = stop - start;
		return total;
	};

	function writePhoneData(dir) {
		console.log(performance.now() + " - startWritePhoneData");
		firebase.database().ref('position').update({dir: dir});
		console.log(performance.now() + " - endWritePhoneData");
	};

		var triggerAngle = null;
		var triggerTime = null;
		var speed = null;
		var dir = "Face";

		window.addEventListener("deviceorientation", function(eventOrientation) {
			console.log(performance.now() + " -%c EventListenerTriggered ", 'background: #16e;');
			var rotation = eventOrientation.alpha;

			valInDeg.innerHTML = rotation + '°';

				eventOrientation.preventDefault();
				console.log(performance.now() + "%c - triggerTime : " + triggerTime, 'background: #1ee;');
				console.log(performance.now() + "%c - triggerAngle : " + triggerAngle, 'background: #1ee;');

				if(triggerAngle !== null && triggerTime !== null) {

					var nowTime = performance.now();
					speed = (rotation - triggerAngle) / (nowTime - triggerTime);
					console.log("%ctriggerTime : " + triggerTime, 'background: #1ee;');
					console.log("%cnowTime : " + nowTime, 'background: #1ee;');
					console.log("%ctriggerAngle : " + triggerAngle, 'background: #1ee;');
					console.log("%cRotation : " + rotation, 'background: #1ee;');
					console.log(performance.now() + "%c - speed : " + speed, 'background: #f00;color:#fff;');
				} else {
					if(rotation >= 40 && rotation < 160) {
						triggerAngle = rotation;
						triggerTime = performance.now();
						dir = "Gauche";
						console.log(performance.now() + " - setGauche");
					} else if (rotation > 200 && rotation <= 320) {
						triggerAngle = rotation;
						triggerTime = performance.now();
						dir = "Droite";
						console.log(performance.now() + " - setDroite");
					} else if (rotation >= 160 && rotation <= 200) {
						dir = "L'exorciste ?";
						console.log(performance.now() + " - sayWut");
					} else {
						dir = "Face";
						console.log(performance.now() + " - setFace");
					}
				}
				if(speed !== null && speed > 0.12) {
					console.log(performance.now() + "%c - speed : " + speed, 'background: #274;');
					writePhoneData(dir);
					triggerTime = null;
					triggerAngle = null;
					speed = null;
				} else {
					triggerTime = null;
					triggerAngle = null;
					speed = null;
				}
			},false);
}());
