import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ActivityItem {
	type: string;
	timestamp: Date;
	user: string;
}

export interface Report {
	id: string;
	title: string;
	content: string;
	createdAt: Date;
	updatedAt: Date;
	activityHistory: ActivityItem[];
}

interface ReportStore {
	reports: Report[];
	currentUser: string;
	setCurrentUser: (username: string) => void;
	addReport: (
		report: Omit<Report, 'id' | 'createdAt' | 'updatedAt' | 'activityHistory'>,
	) => void;
	updateReport: (id: string, report: Partial<Report>) => void;
	deleteReport: (id: string) => void;
	getReport: (id: string) => Report | undefined;
	reorderReports: (fromIndex: number, toIndex: number) => void;
	addActivity: (reportId: string, activityType: string) => void;
}

export const useReportStore = create<ReportStore>()(
	persist(
		(set, get) => ({
			reports: [],
			currentUser: 'Anonymous User',
			setCurrentUser: (username) => {
				set({ currentUser: username });
			},
			addReport: (report) => {
				const user = get().currentUser;
				const newReport: Report = {
					...report,
					id: crypto.randomUUID(),
					createdAt: new Date(),
					updatedAt: new Date(),
					activityHistory: [
						{
							type: 'Created report',
							timestamp: new Date(),
							user,
						},
					],
				};
				set((state) => ({
					reports: [...state.reports, newReport],
				}));
			},
			updateReport: (id, report) => {
				const user = get().currentUser;
				let activityType = 'Updated report';

				// Determine more specific activity type
				if (report.title && !report.content) {
					activityType = 'Updated title';
				} else if (report.content && !report.title) {
					activityType = 'Updated content';
				}

				set((state) => ({
					reports: state.reports.map((r) => {
						if (r.id === id) {
							return {
								...r,
								...report,
								updatedAt: new Date(),
								activityHistory: [
									...r.activityHistory,
									{
										type: activityType,
										timestamp: new Date(),
										user,
									},
								],
							};
						}
						return r;
					}),
				}));
			},
			deleteReport: (id) => {
				set((state) => ({
					reports: state.reports.filter((r) => r.id !== id),
				}));
			},
			getReport: (id) => {
				return get().reports.find((r) => r.id === id);
			},
			reorderReports: (fromIndex, toIndex) => {
				set((state) => {
					const newReports = [...state.reports];
					const [movedItem] = newReports.splice(fromIndex, 1);
					newReports.splice(toIndex, 0, movedItem);
					return { reports: newReports };
				});
			},
			addActivity: (reportId, activityType) => {
				const user = get().currentUser;
				set((state) => ({
					reports: state.reports.map((r) => {
						if (r.id === reportId) {
							return {
								...r,
								updatedAt: new Date(),
								activityHistory: [
									...r.activityHistory,
									{
										type: activityType,
										timestamp: new Date(),
										user,
									},
								],
							};
						}
						return r;
					}),
				}));
			},
		}),
		{
			name: 'report-storage',
		},
	),
);
