export default {
	maxNicknameLength: 25,
	minUsernameLevel: 3,
	minUsernameLength: 5,
	maxUsernameLength: 25,
	maxPasswordLength: 256,
	maxEmailLength: 100,
	avatarSize: 5 * 1024 * 1024,
	plusOptions: {
		one: {
			name: "1 month",
			coins: 100,
			days: 30,
		},
		three: {
			name: "3 months",
			coins: 300,
			days: 90,
		},
		six: {
			name: "6 months",
			coins: 500,
			days: 180,
		},
		twelve: {
			name: "1 year",
			coins: 1000,
			days: 365,
		},
	},
	coinsOptions: {
		a: {
			coins: 50,
			price: 250,
		},
		b: {
			coins: 120,
			price: 500,
		},
		c: {
			coins: 450,
			price: 1500,
		},
		d: {
			coins: 1000,
			price: 3000,
		},
	},
};
