import React, {useEffect, useState} from "react";
import Head from "next/head";
import {
    Box, Button, Container, Heading, HStack, Stack, Text, Image, Center, Highlight, Tabs, TabList, TabPanels, Tab, TabPanel, useColorModeValue, SimpleGrid, Link, Grid, Avatar, VStack, Progress, Card, CardHeader, CardBody, Flex
} from "@chakra-ui/react";
import supabase from "../utils/supabaseClient";
import {motion} from "framer-motion";
import {MdDownload, MdOutlineTipsAndUpdates, MdAttachMoney, MdSecurity} from "react-icons/md";
import {IoMdInformationCircleOutline} from "react-icons/io";
import {LuUser} from "react-icons/lu";
import {StarIcon} from "@chakra-ui/icons";

const MotionBox = motion(Box);

export default function LandingPage() {
    const headingColor = useColorModeValue("orange.500", "orange.300");
    const headingColor2 = useColorModeValue("orange.500", "black");
    const textColor = useColorModeValue("gray.700", "gray.300");
    const bgGradient = useColorModeValue(
        "linear(to-r, purple.100, orange.100)",
        "linear(to-r, purple.300, orange.600)"
    );
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            const {data, error} = await supabase
                .from("reviews")
                .select("rating");
            if (error) {
                console.error("Hiba az értékelések betöltésekor: ", error);
            } else {
                setReviews(data);
            }
        };
        fetchReviews();
    }, []);

    // Átlag számítása
    const averageRating =
        reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;
    const roundedAvg = Math.round(averageRating);
    // Animáció a "Tudj meg többet" gombhoz: gördítés a "Uralkodj a boltodban!" szekcióhoz
    const scrollToSection = () => {
        const el = document.getElementById("bolt-szekcio");
        if (el) {
            el.scrollIntoView({behavior: "smooth"});
        }
    };

    return (
        <>
            <Head>
                <title>Shopventure - Játssz, Építs, Győzz!</title>
                <link rel="icon" href="/images/shopventure.png"/>
                <meta
                    name="description"
                    content="Csatlakozz a 2D boltos játék világához, ahol a játék és az üzlet találkozik. Készen állsz a kihívásra?"
                />
            </Head>

            <Box
                bgGradient={bgGradient}
                py={{base: 16, md: 24}}
                mb={10}
                position="relative"
                overflow="hidden"
            >
                <Container maxW="5xl">
                    <MotionBox
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{duration: 1}}
                        textAlign="center"
                    >
                        <Heading
                            fontWeight={700}
                            fontSize={{base: "3xl", sm: "4xl", md: "6xl"}}
                            lineHeight="110%"
                            mb={4}
                        >
                            Kezdj bele a <br/>
                            <Text as="span" color={headingColor2}>
                                következő kalandodba!
                            </Text>
                        </Heading>
                        <Text color={textColor} fontSize={{base: "md", md: "lg"}} mb={6}>
                            Fedezd fel a Shopventure univerzumot, építsd fel saját boltodat és hódítsd meg a toplistát!
                        </Text>
                        <HStack justify="center" spacing={4} wrap="wrap">
                            <Link href={"/download"}>
                                <Button
                                    colorScheme="orange"
                                    bg="orange.500"
                                    rounded="full"
                                    px={6}
                                    _hover={{bg: "orange.600"}}
                                >
                                    <MdDownload style={{marginRight: 4}}/> Játék Letöltése
                                </Button>
                            </Link>
                            <Button
                                colorScheme="orange"
                                variant="outline"
                                rounded="full"
                                px={6}
                                _hover={{bg: "orange.50"}}
                                onClick={scrollToSection}
                            >
                                <IoMdInformationCircleOutline style={{marginRight: 4}}/> Tudj meg többet
                            </Button>
                        </HStack>
                    </MotionBox>
                </Container>
            </Box>

            <Container maxW="5xl">
                <SimpleGrid columns={{base: 1, md: 3}} spacing={10} mb={16}>
                    <Box
                        textAlign="center"
                        p={5}
                        shadow="lg"
                        borderRadius="xl"
                        bg={useColorModeValue("white", "gray.800")}
                        transition="transform 0.3s, box-shadow 0.3s"
                        _hover={{transform: "scale(1.05)", boxShadow: "xl"}}
                        onMouseEnter={(e) => e.currentTarget.querySelector('p').style.transform = 'translate(10px, -10px)'}
                        onMouseLeave={(e) => e.currentTarget.querySelector('p').style.transform = 'translate(0, 0)'}
                    >
                        <Center>
                            <Text fontSize={35} transition="transform 0.3s">🚀</Text>
                        </Center>
                        <Heading fontSize="xl" mt={4} mb={2} color={headingColor}>
                            Villámgyors Indulás
                        </Heading>
                        <Text color={textColor}>
                            Azonnali belépés, gyors regisztráció és intuitív játékmenet.
                        </Text>
                    </Box>
                    <Box
                        textAlign="center"
                        p={5}
                        shadow="lg"
                        borderRadius="xl"
                        bg={useColorModeValue("white", "gray.800")}
                        transition="transform 0.3s, box-shadow 0.3s"
                        _hover={{transform: "scale(1.05)", boxShadow: "xl"}}
                        onMouseEnter={(e) => {
                            e.currentTarget.querySelector('p').style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                            e.currentTarget.querySelector('p').style.transform = 'rotate(360deg)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.querySelector('p').style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                            e.currentTarget.querySelector('p').style.transform = 'rotate(0deg)';
                        }}
                    >
                        <Center>
                            <Text fontSize={35} transition="transform 0.5s linear">
                                🤠
                            </Text>
                        </Center>
                        <Heading fontSize="xl" mt={4} mb={2} color={headingColor}>
                            Erős Közösség
                        </Heading>
                        <Text color={textColor}>
                            Csatlakozz a dinamikus játékos közösséghez, versenyezz és növeld a ranglistádat.
                        </Text>
                    </Box>
                    <Box
                        textAlign="center"
                        p={5}
                        shadow="lg"
                        borderRadius="xl"
                        bg={useColorModeValue("white", "gray.800")}
                        transition="transform 0.3s, box-shadow 0.3s"
                        _hover={{transform: "scale(1.05)", boxShadow: "xl"}}
                        onMouseEnter={(e) => e.currentTarget.querySelector('p').textContent = '🔒'}
                        onMouseLeave={(e) => e.currentTarget.querySelector('p').textContent = '🔓'}
                    >
                        <Center>
                            <Text
                                fontSize={35}
                                transition="transform 0.3s linear"
                                as={motion.p}
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                transition={{duration: 1}}
                            >
                                🔓
                            </Text>
                        </Center>
                        <Heading fontSize="xl" mt={4} mb={2} color={headingColor}>
                            Maximális Biztonság
                        </Heading>
                        <Text color={textColor}>
                            Korszerű technológia, hogy játékélményed zavartalan és biztonságos legyen.
                        </Text>
                    </Box>
                </SimpleGrid>

                <Stack
                    direction={{base: "column", md: "row"}}
                    spacing={10}
                    align="center"
                    mb={16}
                >
                    <Box flex={1} textAlign="center">
                        <Heading fontSize={{base: "2xl", md: "4xl"}} color={headingColor}>
                            Uralkodj a boltodban!
                        </Heading>
                        <Text color={textColor} mt={5} fontSize={{base: "md", md: "lg"}}>
                            Állítsd be az árakat, optimalizáld a stratégiádat és figyeld, ahogy a vásárlók reagálnak.
                        </Text>
                    </Box>
                    <Box flex={1}>
                        <Image
                            src="/images/3861184.png"
                            alt="Játékboltos illusztráció"
                            width="100%"
                            rounded="2xl"
                            transition="transform 0.3s"
                            _hover={{transform: "scale(1.01)"}}
                        />
                    </Box>
                </Stack>

                <Heading textAlign={"center"} mb={2}>Az emberek imádnak</Heading>
                <Text textAlign={"center"} mb={8}>Nézd meg, hogy játékosaink hogyan vélekedtek játékunkról</Text>
                <Center>
                    <Image src={"images/undraw_avatars_xsfb.svg"} mb={5} height={400}/>
                </Center>
                <Center>
                    <Card mb={10} maxW={"3xl"} mt={0} width={"100%"}>
                        <CardHeader>
                            <Heading size="md" color={headingColor} textAlign="center" mb={-4}>
                                Értékelés: {averageRating.toFixed(1)}
                            </Heading>
                        </CardHeader>
                        <CardBody>
                            <Flex justifyContent="center" alignItems="center">
                                {Array.from({length: 10}, (_, i) => i + 1).map((star) => (
                                    <StarIcon
                                        key={star}
                                        boxSize={8}
                                        color={star <= roundedAvg ? "orange.400" : "gray.300"}
                                        mx={1}
                                    />
                                ))}
                            </Flex>
                            <Center>
                                <HStack>
                                    <Link href={"/reviews"}>
                                <Button mt={6} mb={2}>Értékelj minket</Button>
                                    </Link>
                                </HStack>
                            </Center>
                        </CardBody>
                    </Card>
                </Center>
                <Box id="bolt-szekcio" mt={10} mb={10}>
                    <Center mb={6}>
                        <Heading fontSize="2xl" color={headingColor} mb={3}>
                            További Információk
                        </Heading>
                    </Center>
                    <Tabs variant="enclosed" defaultIndex={0}>
                        <TabList>
                            <Tab>
                                <LuUser style={{marginRight: 4}}/> Shopinfo
                            </Tab>
                            <Tab>
                                <MdOutlineTipsAndUpdates style={{marginRight: 4}}/> Stratégiák
                            </Tab>
                            <Tab>
                                <MdAttachMoney style={{marginRight: 4}}/> Jutalmak
                            </Tab>
                        </TabList>
                        <TabPanels pt={4}>
                           <TabPanel>
                                <Heading as="h2" size="lg" color={headingColor} mb={4}>
                                    Üdvözlünk a Shopventure-ben! 🎉
                                </Heading>
                                <VStack spacing={4} align="stretch">
                                    <Text color={textColor} fontSize="md" lineHeight="tall">
                                        Fedezd fel az üzleti lehetőségek végtelen tárházát, ahol minden döntésed új
                                        utakat nyit meg előtted. Itt nem csupán egy élménydús játékvilágot találsz,
                                        hanem egy kalandot, amely a kreativitás és az innováció erejét ötvözi. 🚀
                                    </Text>
                                    <Text color={textColor} fontSize="md" lineHeight="tall">
                                        A Shopventure-ben minden apró részlet számít: az üzleted stílusos dekorációjától
                                        az árak finomhangolásáig minden elem hozzájárul a sikerhez. Minden döntés
                                        közelebb visz a céljaid megvalósításához. 🏆
                                    </Text>
                                    <Text color={textColor} fontSize="md" lineHeight="tall">
                                        Merülj el a dinamikus üzleti világban, ahol minden lépésed értékes, és az apró
                                        változtatások is nagy hatással vannak a fejlődésre. 📈
                                    </Text>
                                    <Text color={textColor} fontSize="md" lineHeight="tall">
                                        Indulj el ezen az inspiráló úton, és építsd fel saját sikeres történetedet a
                                        Shopventure-ben! 🌟
                                    </Text>
                                </VStack>
                            </TabPanel>

                            <TabPanel>
                                <Heading as="h2" size="lg" color={headingColor} mb={4}>
                                    Titkos Stratégiák
                                </Heading>
                                <VStack spacing={4} align="stretch">
                                    <Text color={textColor} fontSize="md" lineHeight="tall">
                                        A siker titka mindig a részletekben rejlik. Fedezd fel azokat az apró, de
                                        hatékony trükköket, amelyekkel a boltod működését optimalizálhatod. Minden
                                        stratégia egy új lehetőség a jobb eredmények elérésére.
                                    </Text>
                                    <Text color={textColor} fontSize="md" lineHeight="tall">
                                        Egy apró módosítás az árképzésben vagy a dekoráció elrendezésében akár jelentős
                                        növekedést is eredményezhet. Ne félj kísérletezni, és keresd mindig azokat az
                                        innovatív megoldásokat, amelyek előrevisznek.
                                    </Text>
                                    <Text color={textColor} fontSize="md" lineHeight="tall">
                                        Kombináld a különböző megközelítéseket úgy, hogy azok egymást erősítsék, és
                                        minden döntésed egy mérföldkő legyen a siker felé vezető úton.
                                    </Text>
                                    <Text color={textColor} fontSize="md" lineHeight="tall">
                                        Merülj el a stratégiák világában, és tedd ezeket a titkos fegyvereiddé!
                                    </Text>
                                </VStack>
                            </TabPanel>

                            <TabPanel>
                                <Heading as="h2" size="lg" color={headingColor} mb={4}>
                                    Különleges Jutalmak
                                </Heading>
                                <VStack spacing={4} align="stretch">
                                    <Text color={textColor} fontSize="md" lineHeight="tall">
                                        Az igazi siker elismerése megérdemli a legkülönlegesebb jutalmakat. Minden
                                        teljesítményedet nemcsak anyagi értékkel, hanem egyedi bónuszokkal is
                                        jutalmazzuk, amelyek még inkább motiválnak.
                                    </Text>
                                    <Text color={textColor} fontSize="md" lineHeight="tall">
                                        Képzeld el, hogy az alap jutalmad 3$, de a kitartásod és kreativitásod révén ez
                                        az érték akár 3.3$-ra is emelkedhet. Minden lépés egy újabb esély a fejlődésre.
                                    </Text>
                                    <Text color={textColor} fontSize="md" lineHeight="tall">
                                        A jutalmak nemcsak pénzügyi értéket képviselnek, hanem mérföldkövek, amelyek
                                        megmutatják, mennyit fejlődtél és mennyire közel vagy a céljaidhoz.
                                    </Text>
                                    <Text color={textColor} fontSize="md" lineHeight="tall">
                                        Használd ki az összes lehetőséget, és engedd, hogy ezek a jutalmak inspiráljanak
                                        a következő nagy lépés felé!
                                    </Text>
                                </VStack>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>
            </Container>
        </>
    );
}
