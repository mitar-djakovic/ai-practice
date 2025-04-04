import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Container, Toolbar, Typography } from '@mui/material';

interface LayoutProps {
	children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
	return (
		<>
			<AppBar position='static'>
				<Toolbar>
					<Typography
						variant='h6'
						component={Link}
						to='/'
						sx={{ textDecoration: 'none', color: 'white' }}
					>
						Report Manager
					</Typography>
				</Toolbar>
			</AppBar>
			<Container maxWidth='lg' sx={{ mt: 4 }}>
				{children}
			</Container>
		</>
	);
};

export default Layout;
