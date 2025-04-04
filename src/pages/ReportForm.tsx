import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { Editor } from '@tinymce/tinymce-react';

import { generateReportDraft, summarizeReportContent } from '../services/aiService';
import { useReportStore } from '../store/reportStore';

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

	const { addReport, updateReport, getReport } = useReportStore();

	useEffect(() => {
		if (id) {
			setLoading(true);
			const existingReport = getReport(id);
			if (existingReport) {
				setReport(existingReport);
			}
			setLoading(false);
		}
	}, [id, getReport]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (id) {
			updateReport(id, report);
		} else {
			addReport(report as { title: string; content: string });
		}
		navigate('/');
	};

	const handleGenerateDraft = async () => {
		if (!report.title) {
			return;
		}
		try {
			setLoading(true);
			const generatedContent = await generateReportDraft(report.title);
			setReport({ ...report, content: generatedContent });
		} catch (error) {
			console.error('Error generating draft:', error);
			// You might want to show an error message to the user here
		} finally {
			setLoading(false);
		}
	};

	const handleSummarize = async () => {
		if (!report.content) {
			return;
		}
		try {
			setLoading(true);
			const summary = await summarizeReportContent(report.content);
			setReport({ ...report, content: summary });
		} catch (error) {
			console.error('Error summarizing content:', error);
			// You might want to show an error message to the user here
		} finally {
			setLoading(false);
		}
	};

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
				disabled={loading}
			/>

			<Box sx={{ mb: 3, position: 'relative' }}>
				{loading ? (
					<Box
						sx={{
							height: 500,
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							border: '1px solid #ccc',
							borderRadius: 1,
						}}
					>
						<CircularProgress />
					</Box>
				) : (
					<Editor
						apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
						value={report.content}
						onEditorChange={(content) => setReport({ ...report, content })}
						init={{
							height: 500,
							menubar: true,
							plugins: [
								'advlist',
								'autolink',
								'lists',
								'link',
								'image',
								'charmap',
								'preview',
								'anchor',
								'searchreplace',
								'visualblocks',
								'code',
								'fullscreen',
								'insertdatetime',
								'media',
								'table',
								'code',
								'help',
								'wordcount',
							],
							toolbar:
								'undo redo | blocks | ' +
								'bold italic forecolor | alignleft aligncenter ' +
								'alignright alignjustify | bullist numlist outdent indent | ' +
								'removeformat | help',
						}}
					/>
				)}
			</Box>

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
