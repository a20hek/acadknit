//remove array function

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
	Box,
	Input,
	Button,
	Heading,
	Image,
	Text,
	Flex,
	Tag,
	InputGroup,
	InputLeftAddon,
	Accordion,
	Center,
	AccordionItem,
	AccordionButton,
	AccordionIcon,
	AccordionPanel,
	Tabs,
	TabList,
	TabPanel,
	Tab,
	TabPanels,
	TagLabel,
	TagCloseButton,
	Link,
} from '@chakra-ui/react';
import { Search2Icon } from '@chakra-ui/icons';
import Head from 'next/head';
import Loginform from '../components/Loginform';
import NextLink from 'next/link';
import { onAuthStateChanged } from 'firebase/auth';
import {
	collection,
	query,
	where,
	getDocs,
	doc,
	updateDoc,
	arrayUnion,
	arrayRemove,
} from 'firebase/firestore';
import { useFirebaseAuth } from '../hooks/useFirebaseAuth';
import { auth, db } from '../lib/firebase';
import NotLoggedin from '../components/NotLoggedIn';

function removeSkill(uid, skill) {
	const userRef = doc(db, 'users', uid);
	return updateDoc(userRef, {
		skills: arrayRemove(skill),
	});
}

function removeInterest(uid, interest) {
	const userRef = doc(db, 'users', uid);
	return updateDoc(userRef, {
		interests: arrayRemove(interest),
	});
}

export default function Home() {
	const { authenticated, logOut, uid } = useFirebaseAuth();
	const router = useRouter();
	const [inputSkill, setInputSkill] = useState('');
	const [inputInterest, setInputInterest] = useState('');

	const handleKeyPressSkill = (event) => {
		if (event.key === 'Enter') {
			router.push({
				pathname: '/searchskill/[searchSkill]',
				query: { searchSkill: inputSkill },
			});
		}
	};

	const handleKeyPressInterest = (event) => {
		if (event.key === 'Enter') {
			router.push({
				pathname: '/searchinterest/[searchInterest]',
				query: { searchInterest: inputInterest },
			});
		}
	};

	const [result, setResult] = useState([]);

	async function Userdata(uid) {
		const snapshot = await getDocs(query(collection(db, 'users'), where('uid', '==', uid)));
		const results = [];
		snapshot.forEach((doc) => {
			results.push({ id: doc.id, ...doc.data() });
		});
		return { results };
	}

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				Userdata(user.uid).then(({ results }) => setResult(results));
			}
		});
	}, []);

	return (
		<>
			{authenticated ? (
				<>
					<Head>
						<title>Acadknit </title>
					</Head>
					<Box bg='#f4f4f4' h='100vh' pr={['8px', '5%', '5%']} pl={['8px', '5%', '5%']}>
						<Flex justifyContent='space-between'>
							<Image
								src='/logo-black.svg'
								alt='acadknit'
								p={[2, 5, 5]}
								h={['72px', '100px', '100px']}
								w={['72px', '100px', '100px']}
								cursor='pointer'
								top='5px'
							/>
							<div>
								{result.length > 0 && (
									<Accordion
										w={['250px', '300px', '300px']}
										bg='#ffffff'
										borderRadius='10px'
										m={[1, 5, 5]}
										allowToggle
										position='absolute'
										top={['auto', '5px', '5px']}
										right={['10px', '20px', '20px']}
										zIndex='9999'>
										<AccordionItem>
											<AccordionButton>
												<Flex justifyContent='space-between' w='100%'>
													<Flex
														direction='column'
														w='100%'
														align='flex-start'>
														<Text fontSize='lg' fontWeight='500'>
															{result[0].name}
														</Text>
														<Text fontSize='sm' fontWeight='300'>
															{result[0].college}
														</Text>
													</Flex>
													<AccordionIcon h='48px' />
												</Flex>
											</AccordionButton>
											<AccordionPanel>
												<ul>
													{result[0].interests.length > 0 &&
														result[0].interests.map((interest) => (
															<Tag
																key={interest}
																mr={1}
																mb={1}
																bg='#F265FF'
																textColor='#ffffff'
																opacity='0.7'>
																<TagLabel>{interest}</TagLabel>
																<TagCloseButton
																	onClick={() =>
																		removeInterest(
																			uid,
																			interest
																		)
																	}
																/>
															</Tag>
														))}
												</ul>
												<ul>
													{result[0].skills.length > 0 &&
														result[0].skills.map((skill) => (
															<Tag
																key={skill}
																mr={1}
																mb={1}
																bg='#13DA01'
																textColor='#ffffff'
																opacity='0.7'>
																<TagLabel>{skill}</TagLabel>
																<TagCloseButton
																	onClick={() =>
																		removeSkill(uid, skill)
																	}
																/>
															</Tag>
														))}
												</ul>
												<Button
													textColor='#0C8C00'
													fontWeight='300'
													colorScheme='teal'
													size='sm'
													variant='ghost'
													onClick={() => router.push('/editprofile')}>
													Add Skills/Interests
												</Button>
												<Center>
													<Button
														colorScheme='red'
														onClick={() => logOut()}
														size='xs'
														m={1}
														variant='ghost'>
														Logout
													</Button>
												</Center>
											</AccordionPanel>
										</AccordionItem>
									</Accordion>
								)}
							</div>
						</Flex>
						<Flex>
							<Flex direction='column' m='auto'>
								<Heading
									textAlign='center'
									mt={['15%', '5%', '5%']}
									mb='5%'
									as='h1'
									size='2xl'>
									Connect. Collaborate. Learn. Seek Help.
								</Heading>
								<Tabs isLazy isFitted variant='enclosed-colored'>
									<TabList mb='1em'>
										<Tab _selected={{ color: 'white', bg: '#F265FF' }}>
											Search By Interest
										</Tab>
										<Tab _selected={{ color: 'white', bg: '#13DA01' }}>
											Search By Skill
										</Tab>
									</TabList>
									<TabPanels>
										<TabPanel>
											<InputGroup
												size='lg'
												w={['100%', '80%', '80%']}
												m='auto'>
												<InputLeftAddon bg='#fdfdfd'>
													<Search2Icon />
												</InputLeftAddon>
												<Input
													textColor='#000000'
													variant='outline'
													placeholder='Search for interests'
													colorScheme='whiteAlpha'
													size='lg'
													bg='#ffffff'
													value={inputInterest}
													onChange={(e) =>
														setInputInterest(e.target.value)
													}
													onKeyPress={handleKeyPressInterest}
												/>
											</InputGroup>
										</TabPanel>
										<TabPanel>
											<InputGroup
												size='lg'
												w={['100%', '80%', '80%']}
												m='auto'>
												<InputLeftAddon bg='#fdfdfd'>
													<Search2Icon />
												</InputLeftAddon>
												<Input
													textColor='#000000'
													variant='outline'
													placeholder='Search for skills e.g. Python'
													colorScheme='whiteAlpha'
													size='lg'
													bg='#ffffff'
													value={inputSkill}
													onChange={(e) => setInputSkill(e.target.value)}
													onKeyPress={handleKeyPressSkill}
												/>
											</InputGroup>
										</TabPanel>
									</TabPanels>
								</Tabs>
							</Flex>
						</Flex>
					</Box>
				</>
			) : (
				<NotLoggedin />
			)}
		</>
	);
}
