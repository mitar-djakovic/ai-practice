import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography } from '@mui/material';

interface Report {
	id: string;
	title: string;
	content: string;
	createdAt: Date;
	updatedAt: Date;
}

const ReportsList = () => {
	const [searchTerm, setSearchTerm] = useState('');
	const navigate = useNavigate();
	// TODO: Replace with actual data fetching
	const reports: Report[] = [];

	const handleCreateNew = () => {
		navigate('/reports/new');
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

			{/* TODO: Add reports list/table component */}
			{reports.length === 0 && (
				<Typography variant='body1' color='text.secondary'>
					No reports found. Create your first report!
				</Typography>
			)}
		</Box>
	);
};

export default ReportsList;
