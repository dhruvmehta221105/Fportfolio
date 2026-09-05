import { portfolioData } from './portfolioData';

export const projectItems = portfolioData.projects.map(({ image, shortTitle: text }) => ({ image, text }));
