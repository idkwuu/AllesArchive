export type User = {
	id: string;
	name: string;
	tag: string;
	nickname: string;
	plus: boolean;
	createdAt: string;
	reputation: number;
	xp: {
		total: number;
		level: number;
		levelXp: number;
		levelXpMax: number;
		levelProgress: number;
	};
	hasPassword: boolean;
	stripeCustomerId: string;
	country: string;
	birth: { day: number; month: number; year: number; date: string };
};
