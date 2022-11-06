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
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';
import GoogleIcon from './GoogleIcon';

type FormValues = {
	email: string;
	password: string;
};

export default function Loginform() {
	const [loading, setLoading] = useState(false);
	const toast = useToast();

	const { signInWithEmailAndPassword, signInWithGoogle, authenticated } = useFirebaseAuth();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormValues>();

	const loginuser = ({ email, password }) => {
		setLoading(true);
		signInWithEmailAndPassword(email, password).catch((error) => {
			setLoading(false);
			toast({
				title: 'An error occurred.',
				description: 'The username and password do not match',
				status: 'error',
				duration: 5000,
				isClosable: true,
			});
		});
	};

	return (
		<>
			<Stack as='form' onSubmit={handleSubmit((data) => loginuser(data))}>
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
					<FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
				</FormControl>
				<FormControl
				// isInvalid={errors.password && errors.password.message}
				>
					<FormLabel htmlFor='Password'>Password</FormLabel>
					{/* <Center> */}
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
					{/* </Center> */}
					<FormErrorMessage>
						{errors.password && errors.password.message}
					</FormErrorMessage>
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
							Login
						</Button>
					</Center>
					<Divider />
					<Center>
						<Button
							fontSize={['sm', 'md', 'md']}
							size='md'
							onClick={() => signInWithGoogle()}
							leftIcon={<GoogleIcon />}
							w='60%'
							mt={2}
							bg='#ffffff'
							variant='outline'
							borderColor='green.300'
							_hover={{ bg: '#fafafa' }}>
							Continue With Google
						</Button>
					</Center>
				</FormControl>
			</Stack>
		</>
	);
}
