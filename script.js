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
		'Kevin Durant',
		'LaMelo Ball',
		'Zach LaVine',
		'Donovan Mitchell',
		'Luka Don\u010di\u0107',
		'Nikola Joki\u0107',
		'Cade Cunningham',
		'Stephen Curry',
		'Jalen Green',
		'Tyrese Haliburton',
		'Kawhi Leonard',
		'LeBron James',
		'Ja Morant',
		'Jimmy Butler',
		'Giannis Antetokounmpo',
		'Karl-Anthony Towns',
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
		// Try PNG first, then SVG. These files should live in the `images/` folder.
		var basePath = 'images/' + slugify(teams[i]);
		logoImg.src = basePath + '.png';
		logoImg.dataset.try = 'png';
		logoImg.addEventListener('error', function () {
			if (this.dataset.try === 'png') {
				this.dataset.try = 'svg';
				this.src = basePath + '.svg';
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

		// Add keyboard accessibility: allow Enter or Space to flip
		card.tabIndex = 0;
		card.setAttribute('role', 'button');
		card.setAttribute('aria-pressed', 'false');

		// Add a click listener to toggle the 'flipped' class
		card.addEventListener('click', function () {
			// toggle the visual flipped state
			this.classList.toggle('flipped');
			// update accessible state
			var pressed = this.classList.contains('flipped');
			this.setAttribute('aria-pressed', pressed ? 'true' : 'false');
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
}

// Run the creator once the DOM content is loaded
document.addEventListener('DOMContentLoaded', function () {
	createCards();
});

// AI-generated code ends here
