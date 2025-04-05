import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import HistoryIcon from '@mui/icons-material/History';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
	Alert,
	Box,
	Button,
	CircularProgress,
	Collapse,
	Divider,
	List,
	ListItem,
	ListItemText,
	Paper,
	Snackbar,
	TextField,
	Typography,
} from '@mui/material';
import { Editor } from '@tinymce/tinymce-react';

import { generateReportDraft, summarizeReportContent } from '../services/aiService';
import { Report, useReportStore } from '../store/reportStore';

const ReportForm = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<{ message: string; open: boolean }>({
		message: '',
		open: false,
	});
	const [report, setReport] = useState<Partial<Report>>({
		title: '',
		content: '',
		activityHistory: [],
	});
	const [showHistory, setShowHistory] = useState(false);

	const { addReport, updateReport, getReport, addActivity } = useReportStore();

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
			setError({ message: 'Please enter a title before generating a draft', open: true });
			return;
		}
		try {
			setLoading(true);
			const generatedContent = await generateReportDraft(report.title);
			setReport({ ...report, content: generatedContent });

			// Add activity for AI content generation if we have a report ID
			if (id) {
				addActivity(id, 'Generated draft content with AI');
			}
		} catch (error) {
			console.error('Error generating draft:', error);
			setError({
				message: 'Failed to generate draft. Please try again later.',
				open: true,
			});
		} finally {
			setLoading(false);
		}
	};

	const handleSummarize = async () => {
		if (!report.content) {
			setError({ message: 'Please add some content before summarizing', open: true });
			return;
		}
		try {
			setLoading(true);
			const summary = await summarizeReportContent(report.content);
			setReport({ ...report, content: summary });

			// Add activity for AI summarization if we have a report ID
			if (id) {
				addActivity(id, 'Summarized content with AI');
			}
		} catch (error) {
			console.error('Error summarizing content:', error);
			setError({
				message: 'Failed to summarize content. Please try again later.',
				open: true,
			});
		} finally {
			setLoading(false);
		}
	};

	// Function to format date for display
	const formatDate = (date: Date) => {
		return new Date(date).toLocaleString();
	};

	const handleCloseError = () => {
		setError({ ...error, open: false });
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

			{/* Activity History Toggle Button */}
			<Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
				<Button
					startIcon={<HistoryIcon />}
					endIcon={showHistory ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					onClick={() => setShowHistory(!showHistory)}
					variant='text'
					sx={{ mb: 1 }}
				>
					Activity History
				</Button>
			</Box>

			{/* Activity History Section */}
			<Collapse in={showHistory} timeout='auto' unmountOnExit>
				<Paper elevation={1} sx={{ mb: 3, p: 2 }}>
					<List sx={{ width: '100%', bgcolor: 'background.paper' }}>
						{report.activityHistory && report.activityHistory.length > 0 ? (
							report.activityHistory.map((activity, index) => (
								<Box key={index}>
									<ListItem alignItems='flex-start'>
										<ListItemText
											primary={activity.type}
											secondary={
												<>
													<Typography
														component='span'
														variant='body2'
														color='text.primary'
													>
														{activity.user}
													</Typography>
													{` — ${formatDate(activity.timestamp)}`}
												</>
											}
										/>
									</ListItem>
									{index < report.activityHistory!.length - 1 && (
										<Divider component='li' />
									)}
								</Box>
							))
						) : (
							<ListItem>
								<ListItemText primary='No activity history available' />
							</ListItem>
						)}
					</List>
				</Paper>
			</Collapse>

			<Box sx={{ display: 'flex', gap: 2 }}>
				<Button variant='contained' type='submit'>
					Save
				</Button>
				<Button variant='outlined' onClick={() => navigate('/')}>
					Cancel
				</Button>
			</Box>

			<Snackbar
				open={error.open}
				autoHideDuration={6000}
				onClose={handleCloseError}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
			>
				<Alert onClose={handleCloseError} severity='error' sx={{ width: '100%' }}>
					{error.message}
				</Alert>
			</Snackbar>
		</Box>
	);
};

export default ReportForm;
