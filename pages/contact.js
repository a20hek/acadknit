import React from 'react';
import { Container, Heading, Text, Flex, Image } from '@chakra-ui/react';
import NextLink from 'next/link';

export default function contact() {
	return (
		<Flex direction='column'>
			<Flex>
				<NextLink href='/home'>
					<Image p={5} src='/logo-black.svg' alt='acadknit' cursor='pointer' />
				</NextLink>
			</Flex>
			<Container size='xl'>
				<Heading textAlign='center' fontWeight='500'>
					CONTACT
				</Heading>
				<br />
				<br />
				<Text fontSize='xl'>
					In case you’re facing any difficulties while navigating through the website,
					drop a mail at abhishek@acadknit.com or call +91 8104053253, we’ll be forever
					ready to help you out.
				</Text>
				<br />
				<Text fontSize='xl'>
					If you think you can contribute to this project by helping us build more
					features or by bringing in more students, we’d be more than happy to have you in
					our team. Contact us at abhishek@acadknit.com or call +91 8104053253 for more
					details.
				</Text>
				<br />
				<br />
				<br />
				<Image src='/all-icons.svg' alt='acadknit' m='auto' />
			</Container>
		</Flex>
	);
}
