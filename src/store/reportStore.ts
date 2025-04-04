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
		}),
		{
			name: 'report-storage',
		},
	),
);
