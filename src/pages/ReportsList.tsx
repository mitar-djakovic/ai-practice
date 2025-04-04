import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	DndContext,
	DragEndEvent,
	DragOverlay,
	DragStartEvent,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import {
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
	Delete as DeleteIcon,
	DragIndicator as DragIcon,
	Edit as EditIcon,
} from '@mui/icons-material';
import {
	Box,
	Button,
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from '@mui/material';

import { Report, useReportStore } from '../store/reportStore';

interface SortableTableRowProps {
	report: Report;
	onEdit: (id: string) => void;
	onDelete: (id: string) => void;
}

const SortableTableRow = ({ report, onEdit, onDelete }: SortableTableRowProps) => {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
		useSortable({ id: report.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<TableRow ref={setNodeRef} style={style} {...attributes}>
			<TableCell>
				<IconButton {...listeners} size='small'>
					<DragIcon />
				</IconButton>
			</TableCell>
			<TableCell>{report.title}</TableCell>
			<TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
			<TableCell>{new Date(report.updatedAt).toLocaleDateString()}</TableCell>
			<TableCell align='right'>
				<IconButton onClick={() => onEdit(report.id)}>
					<EditIcon />
				</IconButton>
				<IconButton onClick={() => onDelete(report.id)}>
					<DeleteIcon />
				</IconButton>
			</TableCell>
		</TableRow>
	);
};

const ReportsList = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const [activeId, setActiveId] = useState<string | null>(null);
	const navigate = useNavigate();
	const { reports, deleteReport, reorderReports } = useReportStore();

	const sensors = useSensors(
		useSensor(MouseSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
		useSensor(TouchSensor, {
			activationConstraint: {
				delay: 250,
				tolerance: 5,
			},
		}),
	);

	const filteredReports = reports.filter((report) =>
		report.title.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const handleCreateNew = () => {
		navigate('/reports/new');
	};

	const handleEdit = (id: string) => {
		navigate(`/reports/${id}`);
	};

	const handleDelete = (id: string) => {
		if (window.confirm('Are you sure you want to delete this report?')) {
			deleteReport(id);
		}
	};

	const handleDragStart = (event: DragStartEvent) => {
		setActiveId(event.active.id as string);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		setActiveId(null);

		if (over && active.id !== over.id) {
			const oldIndex = filteredReports.findIndex((report) => report.id === active.id);
			const newIndex = filteredReports.findIndex((report) => report.id === over.id);
			reorderReports(oldIndex, newIndex);
		}
	};

	return (
		<Box>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
				<Typography variant='h4'>Reports</Typography>
				<Button variant='contained' onClick={handleCreateNew}>
					Create New Report
				</Button>
			</Box>

			<TextField
				fullWidth
				label='Search Reports'
				variant='outlined'
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
				sx={{ mb: 3 }}
			/>

			<DndContext
				sensors={sensors}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
			>
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell width={50}></TableCell>
								<TableCell>Title</TableCell>
								<TableCell>Created</TableCell>
								<TableCell>Updated</TableCell>
								<TableCell align='right'>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							<SortableContext
								items={filteredReports.map((report) => report.id)}
								strategy={verticalListSortingStrategy}
							>
								{filteredReports.map((report) => (
									<SortableTableRow
										key={report.id}
										report={report}
										onEdit={handleEdit}
										onDelete={handleDelete}
									/>
								))}
							</SortableContext>
						</TableBody>
					</Table>
				</TableContainer>
				<DragOverlay>
					{activeId ? (
						<TableRow>
							<TableCell>
								<IconButton size='small'>
									<DragIcon />
								</IconButton>
							</TableCell>
							<TableCell>
								{filteredReports.find((report) => report.id === activeId)?.title}
							</TableCell>
							<TableCell></TableCell>
							<TableCell></TableCell>
							<TableCell></TableCell>
						</TableRow>
					) : null}
				</DragOverlay>
			</DndContext>

			{filteredReports.length === 0 && (
				<Typography variant='body1' color='text.secondary' sx={{ mt: 2 }}>
					No reports found. Create your first report!
				</Typography>
			)}
		</Box>
	);
};

export default ReportsList;
