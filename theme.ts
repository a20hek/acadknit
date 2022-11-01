import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
	fonts: {
		heading: 'Inter',
		body: 'Inter',
	},
	breakpoints: {
		sm: '500px',
		md: '700px',
		lg: '1000px',
	},
});

export { theme };
