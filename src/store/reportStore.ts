import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Report {
	id: string;
	title: string;
	content: string;
	createdAt: Date;
	updatedAt: Date;
}

interface ReportStore {
	reports: Report[];
	addReport: (report: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>) => void;
	updateReport: (id: string, report: Partial<Report>) => void;
	deleteReport: (id: string) => void;
	getReport: (id: string) => Report | undefined;
	reorderReports: (fromIndex: number, toIndex: number) => void;
}

export const useReportStore = create<ReportStore>()(
	persist(
		(set, get) => ({
			reports: [],
			addReport: (report) => {
				const newReport: Report = {
					...report,
					id: crypto.randomUUID(),
					createdAt: new Date(),
					updatedAt: new Date(),
				};
				set((state) => ({
					reports: [...state.reports, newReport],
				}));
			},
			updateReport: (id, report) => {
				set((state) => ({
					reports: state.reports.map((r) =>
						r.id === id ? { ...r, ...report, updatedAt: new Date() } : r,
					),
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
		}),
		{
			name: 'report-storage',
		},
	),
);
