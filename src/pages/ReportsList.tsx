import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
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

import { useReportStore } from '../store/reportStore';

const ReportsList = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const navigate = useNavigate();
	const { reports, deleteReport } = useReportStore();

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

			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Title</TableCell>
							<TableCell>Created</TableCell>
							<TableCell>Updated</TableCell>
							<TableCell align='right'>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredReports.map((report) => (
							<TableRow key={report.id}>
								<TableCell>{report.title}</TableCell>
								<TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
								<TableCell>{new Date(report.updatedAt).toLocaleDateString()}</TableCell>
								<TableCell align='right'>
									<IconButton onClick={() => handleEdit(report.id)}>
										<EditIcon />
									</IconButton>
									<IconButton onClick={() => handleDelete(report.id)}>
										<DeleteIcon />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			{filteredReports.length === 0 && (
				<Typography variant='body1' color='text.secondary' sx={{ mt: 2 }}>
					No reports found. Create your first report!
				</Typography>
			)}
		</Box>
	);
};

export default ReportsList;
