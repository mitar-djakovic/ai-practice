import OpenAI from 'openai';

const openai = new OpenAI({
	apiKey: import.meta.env.VITE_OPENAI_API_KEY,
	dangerouslyAllowBrowser: true,
});

export const generateReportDraft = async (title: string): Promise<string> => {
	try {
		const completion = await openai.chat.completions.create({
			messages: [
				{
					role: 'system',
					content:
						'You are a professional report writer. Generate a well-structured report draft based on the given title.',
				},
				{
					role: 'user',
					content: `Generate a professional report draft for the title: "${title}". The report should include an introduction, main sections, and a conclusion.`,
				},
			],
			model: 'gpt-3.5-turbo',
		});

		return completion.choices[0]?.message?.content || 'Failed to generate draft.';
	} catch (error) {
		console.error('Error generating draft:', error);
		throw new Error('Failed to generate draft. Please try again later.');
	}
};

export const summarizeReportContent = async (content: string): Promise<string> => {
	try {
		const completion = await openai.chat.completions.create({
			messages: [
				{
					role: 'system',
					content:
						'You are a professional content summarizer. Create a concise summary of the given report content, highlighting the key points and main ideas.',
				},
				{
					role: 'user',
					content: `Please summarize the following report content in a clear and concise manner:\n\n${content}`,
				},
			],
			model: 'gpt-3.5-turbo',
		});

		return completion.choices[0]?.message?.content || 'Failed to generate summary.';
	} catch (error) {
		console.error('Error generating summary:', error);
		throw new Error('Failed to generate summary. Please try again later.');
	}
};
