import React, {useEffect, useState} from "react";
import Head from "next/head";
import {
    Box,
    Button,
    Container,
    Heading,
    HStack,
    Stack,
    Text,
    Image,
    Center,
    Highlight,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    useColorModeValue,
    SimpleGrid, Link,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { MdDownload, MdOutlineTipsAndUpdates, MdAttachMoney, MdSecurity } from "react-icons/md";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { LuUser } from "react-icons/lu";
import { FaRocket, FaUsers } from "react-icons/fa";
import supabase from "@/utils/supabaseClient"

const MotionBox = motion(Box);

export default function DownloadPage() {
    // Narancssárga alapú színek
    const headingColor = useColorModeValue("purple.500", "purple.300");
    const headingColor2 = useColorModeValue("purple.500", "black");
    const textColor = useColorModeValue("gray.700", "gray.300");
    const [session, setSession] = useState(null);
    // Hero szekció színátmenete: narancs és sárga árnyalatok
    const bgGradient = useColorModeValue(
        "linear(to-r, purple.100, purple.100)",
        "linear(to-r, purple.300, purple.600)"
    );

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
        };
        getSession();
    }, []);

    return (
        <>
            <Head>
                <title>Letöltés | Shopventure</title>
                <link rel="icon" href="/images/shopventure.png" />
                <meta
                    name="description"
                    content="Csatlakozz a 2D boltos játék világához, ahol a játék és az üzlet találkozik. Készen állsz a kihívásra?"
                />
            </Head>

            {/* HERO SZEKCIÓ */}
            <Box
                bgGradient={bgGradient}
                py={{ base: 16, md: 24 }}
                mb={10}
                position="relative"
                overflow="hidden"
            >
                <Container maxW="5xl">
                    <MotionBox
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        textAlign="center"
                    >
                        <Heading
                            fontWeight={700}
                            fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }}
                            lineHeight="110%"
                            mb={4}
                        >
                            Töltse le<br />
                            <Text as="span" color={headingColor2 }>
                                játékunkat ingyen!
                            </Text>
                        </Heading>
                        <Text color={textColor} fontSize={{ base: "md", md: "lg" }} mb={6}>
                            Kezd el a következő játékélményedet a Shopventure letöltésével.
                        </Text>
                       <HStack justify="center" spacing={4} wrap="wrap">
                                {session ? (
                                    <Link href="https://bjwiinzcbuvjoxfhuhay.supabase.co/storage/v1/object/public/game//shopventure.rar" download="shopventure_image.webp">
                                        <Button
                                            colorScheme="purple"
                                            bg="purple.500"
                                            rounded="full"
                                            px={6}
                                            _hover={{ bg: "purple.600" }}
                                        >
                                            <MdDownload style={{ marginRight: 4 }} />Letöltése
                                        </Button>
                                    </Link>
                                ) : (
                                    <Text color={textColor}>Kérjük, jelentkezzen be a letöltéshez.</Text>
                                )}
                            </HStack>
                    </MotionBox>
                </Container>
            </Box>

            <Container maxW="5xl">
                <Stack
                    direction={{ base: "column", md: "row" }}
                    spacing={10}
                    align="center"
                    mb={16}
                >
                    <Box flex={1} textAlign="center">
                        <Heading fontSize={{ base: "2xl", md: "4xl" }} color={headingColor}>
                            Kezdj bele az uralmadba!
                        </Heading>
                        <Text color={textColor} mt={5} fontSize={{ base: "md", md: "lg" }}>
                            A Shopventure egy 2D boltos játék, ahol a játék és az üzlet találkozik. Készen állsz a kihívásra?
                        </Text>
                    </Box>
                    <Box flex={1}>
                        <Image
                            src="/images/download.jpg"
                            alt="Játékboltos illusztráció"
                            width="100%"
                            rounded="2xl"
                            transition="transform 0.3s"
                            _hover={{ transform: "scale(1.01)" }}
                        />
                    </Box>
                </Stack>
                <Text p={6} fontSize={20} fontWeight={"bold"}>Rendszerkövetelmények</Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10} mb={10}>
                    <TableContainer>
                        <Table variant='simple'>
                            <TableCaption>Ajánlott Játék Követelmények</TableCaption>
                            <Thead>
                                <Tr>
                                    <Th>Komponens</Th>
                                    <Th>Specifikáció</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                <Tr>
                                    <Td>OS</Td>
                                    <Td>Windows 10</Td>
                                </Tr>
                                <Tr>
                                    <Td>Processzor</Td>
                                    <Td>Intel Core i5</Td>
                                </Tr>
                                <Tr>
                                    <Td>Memória</Td>
                                    <Td>8 GB RAM</Td>
                                </Tr>
                                <Tr>
                                    <Td>Grafika</Td>
                                    <Td>NVIDIA GTX 1060</Td>
                                </Tr>
                                <Tr>
                                    <Td>Tárhely</Td>
                                    <Td>2 GB szabad hely</Td>
                                </Tr>
                            </Tbody>
                        </Table>
                    </TableContainer>
                    <TableContainer>
                        <Table variant='simple'>
                            <TableCaption>Minimális Játék Követelmények</TableCaption>
                            <Thead>
                                <Tr>
                                    <Th>Komponens</Th>
                                    <Th>Specifikáció</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                <Tr>
                                    <Td>OS</Td>
                                    <Td>Windows 7</Td>
                                </Tr>
                                <Tr>
                                    <Td>Processzor</Td>
                                    <Td>Intel Core i3</Td>
                                </Tr>
                                <Tr>
                                    <Td>Memória</Td>
                                    <Td>4 GB RAM</Td>
                                </Tr>
                                <Tr>
                                    <Td>Grafika</Td>
                                    <Td>NVIDIA GTX 750</Td>
                                </Tr>
                                <Tr>
                                    <Td>Tárhely</Td>
                                    <Td>1 GB szabad hely</Td>
                                </Tr>
                            </Tbody>
                        </Table>
                    </TableContainer>
                </SimpleGrid>
            </Container>
        </>
    );
}
