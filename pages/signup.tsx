import {
	Button,
	Input,
	FormControl,
	FormLabel,
	useToast,
	FormErrorMessage,
	Stack,
	Divider,
	Center,
	Text,
	Container,
	Box,
	Link,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';
import GoogleIcon from '../components/GoogleIcon';
import NextLink from 'next/link';
import Head from 'next/head';

type FormValues = {
	email: string;
	password: string;
};

export default function Register() {
	const [loading, setLoading] = useState(false);
	const { signUpWithEmailAndPassword, signInWithGoogle, authenticated } = useFirebaseAuth();

	const toast = useToast();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormValues>();

	const registeruser = ({ email, password }) => {
		setLoading(true);
		signUpWithEmailAndPassword(email, password).catch((error) => {
			setLoading(false);
			toast({
				title: 'An error occurred.',
				description: error.message,
				status: 'error',
				duration: 5000,
				isClosable: true,
			});
		});
	};

	return (
		<>
			<script
				dangerouslySetInnerHTML={{
					__html: `
              if (document.cookie && document.cookie.includes('acad-auth')) {
                window.location.href = "/home"
              }
            `,
				}}
			/>
			<Head>
				<title>Signup | Acadknit</title>
			</Head>
			<Box mt={20}>
				<Center>
					<Text textAlign='center' fontSize='xl' fontWeight='300'>
						Signup
					</Text>
				</Center>
				<Center>
					<Stack
						as='form'
						onSubmit={handleSubmit((data) => registeruser(data))}
						// errors={errors}
						padding={8}>
						<FormControl
						// isInvalid={errors.email && errors.email.message}
						>
							<FormLabel htmlFor='email'>Email</FormLabel>

							<Input
								w={['350px', '400px', '400px']}
								autoFocus
								placeholder='jake@gmail.com'
								type='text'
								{...register('email', {
									required: 'Email is required',
									pattern: {
										value: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
										message: 'Invalid email address',
									},
								})}
								bg='#ffffff'
							/>
							<FormErrorMessage>
								{errors.email && errors.email.message}
							</FormErrorMessage>
						</FormControl>
						<FormControl
						// isInvalid={errors.password && errors.password.message}
						>
							<FormLabel htmlFor='Password'>Password</FormLabel>
							<Input
								w={['350px', '400px', '400px']}
								type='password'
								{...register('password', {
									required: 'Password is required',
									minLength: {
										value: 8,
										message: 'Minimum length is 8',
									},
								})}
								bg='#ffffff'
							/>
							<FormErrorMessage>
								{errors.password && errors.password.message}
							</FormErrorMessage>
						</FormControl>

						<Center>
							<Button
								isLoading={loading}
								type='submit'
								w='60%'
								mt={3}
								m={2}
								bg='#0EB500'
								borderColor='green.300'
								variant='outline'
								textColor='#ffffff'
								_hover={{ bg: '#13DA01' }}>
								Sign Up
							</Button>
						</Center>
						<Divider />
						<Center>
							<Button
								fontSize={['sm', 'md', 'md']}
								size='md'
								leftIcon={<GoogleIcon />}
								onClick={() => signInWithGoogle()}
								w='60%'
								mt={2}
								bg='#ffffff'
								variant='outline'
								borderColor='green.300'
								_hover={{ bg: '#fafafa' }}>
								Continue With Google
							</Button>
						</Center>
						<Center>
							<NextLink href='/login'>
								<Link>
									<Text as='u' fontSize='xs' opacity='80%'>
										Already a member? Log In
									</Text>
								</Link>
							</NextLink>
						</Center>
					</Stack>
				</Center>
			</Box>
		</>
	);
}
