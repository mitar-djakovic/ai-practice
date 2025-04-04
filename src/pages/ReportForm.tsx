import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';

interface Report {
	id: string;
	title: string;
	content: string;
	createdAt: Date;
	updatedAt: Date;
}

const ReportForm = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [report, setReport] = useState<Partial<Report>>({
		title: '',
		content: '',
	});

	useEffect(() => {
		if (id) {
			// TODO: Fetch report data
			setLoading(true);
			// Simulate loading
			setTimeout(() => {
				setLoading(false);
			}, 1000);
		}
	}, [id]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		// TODO: Implement save functionality
		console.log('Saving report:', report);
	};

	const handleGenerateDraft = async () => {
		// TODO: Implement AI draft generation
		console.log('Generating draft...');
	};

	const handleSummarize = async () => {
		// TODO: Implement content summarization
		console.log('Summarizing content...');
	};

	if (loading) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Box component='form' onSubmit={handleSubmit}>
			<Typography variant='h4' sx={{ mb: 3 }}>
				{id ? 'Edit Report' : 'Create New Report'}
			</Typography>

			<TextField
				fullWidth
				label='Title'
				value={report.title}
				onChange={(e) => setReport({ ...report, title: e.target.value })}
				sx={{ mb: 3 }}
				required
			/>

			<TextField
				fullWidth
				label='Content'
				value={report.content}
				onChange={(e) => setReport({ ...report, content: e.target.value })}
				multiline
				rows={10}
				sx={{ mb: 3 }}
				required
			/>

			<Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
				<Button variant='outlined' onClick={handleGenerateDraft} disabled={!report.title}>
					Generate Draft
				</Button>
				<Button variant='outlined' onClick={handleSummarize} disabled={!report.content}>
					Summarize Content
				</Button>
			</Box>

			<Box sx={{ display: 'flex', gap: 2 }}>
				<Button variant='contained' type='submit'>
					Save
				</Button>
				<Button variant='outlined' onClick={() => navigate('/')}>
					Cancel
				</Button>
			</Box>
		</Box>
	);
};

export default ReportForm;
