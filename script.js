// AI-generated code starts here
// Student prompt: create 30 flippable cards (team on front, best player on back)

// This script creates 30 simple cards and makes them flip when clicked.
// It uses only basic DOM methods so it's easy for beginners to read.

// Create 30 cards and add them to the page
function createCards() {
	// Find the container where cards will go
	var list = document.querySelector('.cards-list');
	if (!list) return; // if container missing, stop

	// Basic arrays of 30 teams and their (commonly-known) best players.
	// We use two simple arrays so beginners can read and edit them easily.
	var teams = [
		'Atlanta Hawks',
		'Boston Celtics',
		'Brooklyn Nets',
		'Charlotte Hornets',
		'Chicago Bulls',
		'Cleveland Cavaliers',
		'Dallas Mavericks',
		'Denver Nuggets',
		'Detroit Pistons',
		'Golden State Warriors',
		'Houston Rockets',
		'Indiana Pacers',
		'Los Angeles Clippers',
		'Los Angeles Lakers',
		'Memphis Grizzlies',
		'Miami Heat',
		'Milwaukee Bucks',
		'Minnesota Timberwolves',
		'New Orleans Pelicans',
		'New York Knicks',
		'Oklahoma City Thunder',
		'Orlando Magic',
		'Philadelphia 76ers',
		'Phoenix Suns',
		'Portland Trail Blazers',
		'Sacramento Kings',
		'San Antonio Spurs',
		'Toronto Raptors',
		'Utah Jazz',
		'Washington Wizards'
	];

	var players = [
		'Trae Young',
		'Jayson Tatum',
		'Micheal Porter Jr',
		'LaMelo Ball',
		'Coby White',
		'Donovan Mitchell',
		'Anthony Davis',
		'Nikola Joki\u0107',
		'Cade Cunningham',
		'Stephen Curry',
		'Kevin Durant',
		'Pascal Siakam',
		'Kawhi Leonard',
		'LeBron James',
		'Ja Morant',
		'Bam Adebayo',
		'Giannis Antetokounmpo',
		'ANthony Edwards',
		'Zion Williamson',
		'Jalen Brunson',
		'Shai Gilgeous-Alexander',
		'Paolo Banchero',
		'Joel Embiid',
		'Devin Booker',
		'Damian Lillard',
		"De'Aaron Fox",
		'Victor Wembanyama',
		'Pascal Siakam',
		'Lauri Markkanen',
		'Bradley Beal'
	];

	// Colors for each team (one-to-one with the `teams` array).
	// These are simple hex color values students can change.
	var colors = [
		'#E03A3E', // Atlanta Hawks (red)
		'#007A33', // Boston Celtics (green)
		'#000000', // Brooklyn Nets (black)
		'#00A3E0', // Charlotte Hornets (teal)
		'#CE1141', // Chicago Bulls (red)
		'#6F263D', // Cleveland Cavaliers (wine)
		'#00538C', // Dallas Mavericks (blue)
		'#0E2240', // Denver Nuggets (navy)
		'#C8102E', // Detroit Pistons (red)
		'#1D428A', // Golden State Warriors (blue)
		'#CE1141', // Houston Rockets (red)
		'#002D62', // Indiana Pacers (navy)
		'#C8102E', // LA Clippers (red)
		'#552583', // LA Lakers (purple)
		'#5D76A9', // Memphis Grizzlies (blue)
		'#98002E', // Miami Heat (red)
		'#00471B', // Milwaukee Bucks (green)
		'#0C2340', // Minnesota Timberwolves (navy)
		'#0C2340', // New Orleans Pelicans (navy)
		'#006BB6', // New York Knicks (blue)
		'#007AC1', // Oklahoma City Thunder (blue)
		'#0077C0', // Orlando Magic (blue)
		'#006BB6', // Philadelphia 76ers (blue)
		'#E56020', // Phoenix Suns (orange)
		'#E03A3E', // Portland Trail Blazers (red)
		'#5A2D81', // Sacramento Kings (purple)
		'#000000', // San Antonio Spurs (black)
		'#CE1141', // Toronto Raptors (red)
		'#002B5C', // Utah Jazz (navy)
		'#002B5C' // Washington Wizards (navy)
	];

	// Helper: convert a hex color string like '#RRGGBB' to an object {r,g,b}
	function hexToRgb(hex) {
		// Remove the leading '#' if present
		hex = hex.replace('#', '');
		var r = parseInt(hex.substring(0, 2), 16);
		var g = parseInt(hex.substring(2, 4), 16);
		var b = parseInt(hex.substring(4, 6), 16);
		return { r: r, g: g, b: b };
	}

	// --- Simple WebAudio helpers for hover/click sounds (no external files) ---
	var audioCtx = null;

	// Global mute flag; read saved preference if available
	var audioMuted = false;
	try {
		audioMuted = localStorage.getItem('soundMuted') === 'true';
	} catch (e) {
		// ignore storage errors
	}

	function ensureAudioContext() {
		if (!audioCtx) {
			audioCtx = new (window.AudioContext || window.webkitAudioContext)();
		}
		// Resume if suspended (some browsers require a user gesture)
		if (audioCtx.state === 'suspended') {
			audioCtx.resume().catch(function () {});
		}
	}

	function playTone(freq, durationMs, type, volume) {
		// respect global mute immediately
		if (audioMuted) return;
		ensureAudioContext();
		var now = audioCtx.currentTime;
		var o = audioCtx.createOscillator();
		var g = audioCtx.createGain();
		o.type = type || 'sine';
		o.frequency.value = freq;
		g.gain.value = (typeof volume === 'number' ? volume : 0.06);
		o.connect(g);
		g.connect(audioCtx.destination);
		o.start(now);
		// smooth release
		g.gain.setValueAtTime(g.gain.value, now);
		g.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000);
		o.stop(now + durationMs / 1000 + 0.02);
	}

	function playHoverSound() {
		// gentle short beep; default fixed pitch when no element provided
		try {
			playTone(880, 70, 'sine', 0.08);
		} catch (e) {}
	}

	function playClickSound() {
		// slightly richer sound: two quick tones
		try {
			playTone(520, 120, 'square', 0.05);
			setTimeout(function () { playTone(760, 90, 'sawtooth', 0.03); }, 40);
		} catch (e) {}
	}

	// Convert a string into a small numeric seed (stable for the same string)
	function stringToSeed(str) {
		if (!str) return 0;
		var s = 0;
		for (var i = 0; i < str.length; i++) {
			s = (s * 31 + str.charCodeAt(i)) & 0xffffffff;
		}
		return Math.abs(s);
	}

	// Play hover sound tailored to a specific card element (if provided)
	function playHoverSoundFor(card) {
		var seed = stringToSeed((card && (card.dataset.playerSlug || card.dataset.teamName)) || '');
		// map seed to a frequency between 600 and 1200 Hz
		var freq = 600 + (seed % 601);
		var type = (seed % 2) === 0 ? 'sine' : 'triangle';
		try {
			playTone(freq, 70, type, 0.08);
		} catch (e) {}
	}

	// Play click sound tailored to a specific card element (if provided)
	function playClickSoundFor(card) {
		var seed = stringToSeed((card && (card.dataset.playerSlug || card.dataset.teamName)) || '');
		// base frequencies vary by seed
		var f1 = 400 + (seed % 301); // 400-700
		var f2 = 700 + (seed % 401); // 700-1100
		var type1 = (seed % 3) === 0 ? 'square' : 'sawtooth';
		var type2 = (seed % 5) === 0 ? 'triangle' : 'sine';
		try {
			playTone(f1, 120, type1, 0.12);
			setTimeout(function () { playTone(f2, 90, type2, 0.08); }, 40);
		} catch (e) {}
	}

	// Helper: make a simple slug from a team name for image filenames
	// e.g. "Boston Celtics" -> "boston-celtics"
	function slugify(name) {
		return name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)/g, '');
	}

	// Helper: simple brightness test to choose dark or light text color
	function isLightColor(hex) {
		var c = hexToRgb(hex);
		// Perceived brightness formula
		var brightness = (c.r * 299 + c.g * 587 + c.b * 114) / 1000;
		return brightness > 150; // threshold: >150 is light
	}

	// Helper: darken a hex color by a percent (0-100)
	function darkenHex(hex, percent) {
		var c = hexToRgb(hex.replace('#', ''));
		var r = Math.max(0, Math.min(255, Math.floor(c.r * (1 - percent / 100))));
		var g = Math.max(0, Math.min(255, Math.floor(c.g * (1 - percent / 100))));
		var b = Math.max(0, Math.min(255, Math.floor(c.b * (1 - percent / 100))));
		// Convert back to hex
		function toHex(n) {
			var s = n.toString(16);
			return s.length === 1 ? '0' + s : s;
		}
		return '#' + toHex(r) + toHex(g) + toHex(b);
	}

	// Ensure both arrays have the same number of items.
	var count = teams.length;
	if (players.length < count) count = players.length;

	// Create a card for each pair
	var i = 0;
	while (i < count) {
		// Create the outer card element
		var card = document.createElement('div');
		card.className = 'card';

		// Create the inner element that will be rotated
		var inner = document.createElement('div');
		inner.className = 'card-inner';

		// Create the front face (team)
		var front = document.createElement('div');
		front.className = 'card-front';
		// Try to show a team logo image on the front. If the image isn't
		// available, fall back to showing the team name as text.
		front.textContent = '';
		var logoImg = document.createElement('img');
		logoImg.className = 'team-logo';
		logoImg.alt = teams[i] + ' logo';
		// Try SVG first, then PNG. These files should live in the `images/` folder.
		var basePath = 'images/' + slugify(teams[i]);
		logoImg.src = basePath + '.svg';
		logoImg.dataset.try = 'svg';
		logoImg.addEventListener('error', function () {
			if (this.dataset.try === 'svg') {
				this.dataset.try = 'png';
				this.src = basePath + '.png';
			} else {
				// both attempts failed: remove the img and show text
				this.remove();
				front.textContent = teams[i];
			}
		});
		// If the image loads, keep it. If not, the error handler above will
		// show the team name instead.
		front.appendChild(logoImg);
		// Apply the team's color as a background so logos with transparency
		// still sit on a team-colored card.
		if (colors[i]) {
			front.style.background = colors[i];
			front.style.color = isLightColor(colors[i]) ? '#000' : '#fff';
		}

		// Create the back face (best player)
		var back = document.createElement('div');
		back.className = 'card-back';
		back.textContent = players[i];
		// Make the back a slightly darker shade of the team color for contrast
		if (colors[i]) {
			back.style.background = darkenHex(colors[i], 30);
			back.style.color = '#fff';
		}

		// Put the faces inside the inner element
		inner.appendChild(front);
		inner.appendChild(back);

		// Put inner inside the outer card
		card.appendChild(inner);

		// Store the team's color on the card element so the click handler can
		// reference it later without closing over the loop index.
		if (colors[i]) {
			card.dataset.teamColor = colors[i];
		} else {
			card.dataset.teamColor = '';
		}

		// Also store the full team name so the click handler can show it
		// in the large centered display without needing closures.
		card.dataset.teamName = teams[i];

		// Store the player's name so we can show it under the team title
		// in the centered background display.
		card.dataset.playerName = players[i] || '';

		// Add keyboard accessibility: allow Enter or Space to flip
		card.tabIndex = 0;
		card.setAttribute('role', 'button');
		card.setAttribute('aria-pressed', 'false');

		// Hover sound: play when pointer enters the card (with a small cooldown)
		card._lastHover = 0;
		card.addEventListener('mouseenter', function () {
			var now = Date.now();
			if (now - (this._lastHover || 0) < 120) return; // avoid spam
			this._lastHover = now;
			playHoverSoundFor(this);
		});

		// Add a click listener to toggle the 'flipped' class
		card.addEventListener('click', function () {
			// Hide the instruction text on first click
			var instructionText = document.getElementById('instruction-text');
			if (instructionText && !instructionText.classList.contains('hidden')) {
				instructionText.classList.add('hidden');
			}

			// play click sound (also resumes audio context on some browsers)
			playClickSoundFor(this);
			// If another card is already open, close it first so only one
			// card remains flipped at a time.
			if (list) {
				var prev = list.querySelector('.card.flipped');
				if (prev && prev !== this) {
					prev.classList.remove('flipped');
					prev.setAttribute('aria-pressed', 'false');
				}
			}

			// toggle the visual flipped state for the clicked card
			this.classList.toggle('flipped');
			// update accessible state
			var pressed = this.classList.contains('flipped');
			this.setAttribute('aria-pressed', pressed ? 'true' : 'false');

			// Toggle the page background between white and this card's color.
			// We use a data attribute on the body to remember the active color.
			var teamColor = this.dataset.teamColor || '';
			var body = document.body;
			if (teamColor && body.dataset.activeColor === teamColor) {
				// Same card clicked again: reset background to white and clear state
				body.style.background = '#ffffff';
				delete body.dataset.activeColor;
			} else if (teamColor) {
				// Different card (or none active): set background to the team's color
				body.style.background = teamColor;
				body.dataset.activeColor = teamColor;
			} else {
				// No team color available: ensure background is white
				body.style.background = '#ffffff';
				delete body.dataset.activeColor;
			}

			// Show or hide the large centered team name behind the cards.
			var center = document.getElementById('center-team-name');
			var teamName = this.dataset.teamName || '';
			if (center) {
				// We'll show a labeled player line above the large team title.
				// Create or reuse the elements: a player label and a team title.
				var title = center.querySelector('.center-team-title');
				var playerLabel = center.querySelector('.center-player-label');
				// If title missing, create it now.
				if (!title) {
					title = document.createElement('div');
					title.className = 'center-team-title';
					center.appendChild(title);
				}
				// If player label missing, create it and insert it before the title
				if (!playerLabel) {
					playerLabel = document.createElement('div');
					playerLabel.className = 'center-player-label';
					center.insertBefore(playerLabel, title);
				}

				var playerName = this.dataset.playerName || '';
				// Toggle: if same team and player are already shown, hide them.
				if (teamName && center.dataset.active === teamName && center.dataset.player === playerName) {
					playerLabel.textContent = '';
					title.textContent = '';
					center.style.opacity = '0';
					delete center.dataset.active;
					delete center.dataset.player;
				} else if (teamName) {
					// Show player label above the team title.
					playerLabel.textContent = 'Best player: ' + playerName;
					title.textContent = teamName;
					center.style.opacity = '1';
					center.dataset.active = teamName;
					center.dataset.player = playerName;
					// adjust contrast
					var tc = this.dataset.teamColor || '';
					if (tc && isLightColor(tc)) {
						center.style.color = 'rgba(0,0,0,0.08)';
					} else {
						center.style.color = 'rgba(255,255,255,0.14)';
					}
				} else {
					playerLabel.textContent = '';
					title.textContent = '';
					center.style.opacity = '0';
					delete center.dataset.active;
					delete center.dataset.player;
				}
			}

			// Ensure dimming reflects whether this card is now open. If the
			// clicked card is flipped, add the dim class; otherwise remove it.
			if (list) {
				if (this.classList.contains('flipped')) {
					list.classList.add('dim-all');
				} else {
					list.classList.remove('dim-all');
				}
			}
		});

		// Add keyboard interaction
		card.addEventListener('keydown', function (evt) {
			if (evt.key === 'Enter' || evt.key === ' ') {
				evt.preventDefault();
				this.click();
			}
		});

		// Append the card to the list
		list.appendChild(card);

		i = i + 1;
	}

	// --- Sound toggle UI wiring (button toggles `audioMuted`) ---
	var soundBtn = document.getElementById('sound-toggle');
	function updateSoundButton() {
		if (!soundBtn) return;
		soundBtn.setAttribute('aria-pressed', audioMuted ? 'true' : 'false');
		soundBtn.textContent = audioMuted ? '🔇 Muted' : '🔊 Sound';
	}

	updateSoundButton();
	if (soundBtn) {
		soundBtn.addEventListener('click', function () {
			audioMuted = !audioMuted;
			try { localStorage.setItem('soundMuted', audioMuted ? 'true' : 'false'); } catch (e) {}
			updateSoundButton();
		});
	}
}

// Run the creator once the DOM content is loaded
document.addEventListener('DOMContentLoaded', function () {
	createCards();

	// Handle example button click
	var exampleBtn = document.getElementById('example-button');
	if (exampleBtn) {
		exampleBtn.addEventListener('click', function () {
			// Get the first card to click
			var firstCard = document.querySelector('.card');
			if (firstCard) {
				// Get the position of the first card
				var rect = firstCard.getBoundingClientRect();
				var cardCenterX = rect.left + rect.width / 2;
				var cardCenterY = rect.top + rect.height / 2;

				// Create and show the cursor pointer animation
				var cursor = document.createElement('div');
				cursor.className = 'cursor-pointer';
				cursor.textContent = '👆';
				// Start in the middle of the screen
				cursor.style.left = (window.innerWidth / 2) + 'px';
				cursor.style.top = (window.innerHeight / 2) + 'px';
				cursor.style.transition = 'left 1.5s ease-in-out, top 1.5s ease-in-out';
				document.body.appendChild(cursor);

				// Animate to the card after a brief delay
				setTimeout(function () {
					cursor.style.left = cardCenterX + 'px';
					cursor.style.top = cardCenterY + 'px';
				}, 100);

				// Remove the cursor element after animation completes
				setTimeout(function () {
					cursor.remove();
				}, 2000);

				// Trigger the card click after the animation moves to the card
				setTimeout(function () {
					// Add the clicking animation to the cursor
					cursor.classList.add('clicking');
					firstCard.click();
				}, 1600);
			}
		});
	}
});

// AI-generated code ends here
