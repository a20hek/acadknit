import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useFirebaseAuth } from '../../hooks/useFirebaseAuth';
import {
	Button,
	Input,
	FormLabel,
	Stack,
	Center,
	Text,
	Container,
	Heading,
	Tag,
	Flex,
	Tooltip,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import Head from 'next/head';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function Registration2() {
	const router = useRouter();
	const { uid, authenticated } = useFirebaseAuth();

	const [skills, setSkills] = useState([]);
	const [inputskill, setInputskill] = useState('');
	const addSkill = (e) => {
		e.preventDefault();
		setSkills([...skills, inputskill]);
		setInputskill('');
	};

	const [interests, setInterests] = useState([]);
	const [inputinterest, setInputinterest] = useState('');
	const addInterest = (e) => {
		e.preventDefault();
		setInterests([...interests, inputinterest]);
		setInputinterest('');
	};

	async function arrUnion(skills, interests, uid) {
		const userRef = doc(db, 'users', uid);
		await updateDoc(userRef, {
			skills: arrayUnion(...skills),
			interests: arrayUnion(...interests),
		}).then(() => router.push('/home'));
	}

	return (
		<>
			{authenticated ? (
				<>
					<Head>
						<title>Registration</title>
					</Head>
					<Container centerContent>
						<Heading fontWeight='400' textAlign='center' mt='5%'>
							Welcome!
						</Heading>
						<Heading size='md' opacity='0.7' textAlign='center' mt={2}>
							It&apos;s great to have you here {':)'}
						</Heading>
						<Text fontWeight='500' opacity='0.5' textAlign='center' mt={10} mb={5}>
							One last step before you get started..
						</Text>
						<br />
						<Stack>
							<FormLabel htmlFor='name' opacity='0.7'>
								Enter things that interests you, one by one
							</FormLabel>
							<Flex>
								<Input
									autoFocus
									w={['300px', '400px', '400px']}
									placeholder='E.g. Anime or Reading or Crypto'
									type='text'
									value={inputinterest}
									onChange={(e) => setInputinterest(e.target.value)}
								/>
								<Tooltip
									defaultIsOpen
									hasArrow
									label='Input an interest and click here'
									aria-label='Add Interest'
									color='white'>
									<Button
										disabled={!inputinterest}
										onClick={addInterest}
										ml={2}
										borderRadius='100%'
										h='40px'
										w='40px'
										bg='#F265FF'
										_hover={{ bg: '#DE44EC' }}>
										<AddIcon color='#ffffff' />
									</Button>
								</Tooltip>
							</Flex>
							<ul>
								{interests.map((interest) => (
									<Tag
										key={interest}
										m={1}
										bg='#F265FF'
										textColor='#ffffff'
										opacity='0.7'>
										{interest}
									</Tag>
								))}
							</ul>
							<br />
							<FormLabel htmlFor='name' opacity='0.7'>
								Enter skills, frameworks and softwares known, one by one
							</FormLabel>
							<Flex>
								<Input
									w={['300px', '400px', '400px']}
									placeholder='E.g. JavaScript'
									type='text'
									value={inputskill}
									onChange={(e) => setInputskill(e.target.value)}
								/>
								<Tooltip
									hasArrow
									label='Add skill'
									aria-label='Add Skill'
									color='white'>
									<Button
										disabled={!inputskill}
										onClick={addSkill}
										ml={2}
										borderRadius='100%'
										h='40px'
										w='40px'
										bg='#13DA01'
										_hover={{ bg: '#0EB500' }}>
										<AddIcon color='#ffffff' />
									</Button>
								</Tooltip>
							</Flex>
							<ul>
								{skills.map((skill) => (
									<Tag
										key={skill}
										m={1}
										bg='#13DA01'
										textColor='#ffffff'
										opacity='0.7'>
										{skill}
									</Tag>
								))}
							</ul>

							<Center>
								<Button
									onClick={() => arrUnion(skills, interests, uid)}
									w='60%'
									mt={5}
									bg='#0EB500'
									borderColor='green.300'
									variant='outline'
									textColor='#ffffff'
									_hover={{ bg: '#13DA01' }}
									// isDisabled={true ? inputskill || inputinterest : false}
								>
									Next
								</Button>
							</Center>
						</Stack>
					</Container>
				</>
			) : null}
		</>
	);
}
