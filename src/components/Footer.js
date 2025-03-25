import {
    Box,
    Container,
    Text,
    Link,
    Stack,
    Flex,
    IconButton,
    useColorMode,
    useColorModeValue,
} from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

// Definiáljuk a ColorModeButton komponenst inline
const ColorModeButton = () => {
    const { colorMode, toggleColorMode } = useColorMode();
    return (
        <IconButton
            aria-label="Toggle color mode"
            onClick={toggleColorMode}
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            variant="outline"
        />
    );
};

const Footer = () => {
    // Határozd meg a világos és sötét mód szerinti értékeket
    const bg = useColorModeValue("white", "gray.900");
    const borderTopValue = useColorModeValue("1px solid #e2e8f0", "0px solid #2d3748");
    const textColor = useColorModeValue("gray.900", "gray.100");

    return (
        <Box bg={bg} py={10} width="100%" mt="auto" borderTop={borderTopValue}>
            <Container maxW="container.xl">
                <Flex
                    direction={{ base: "column", md: "row" }}
                    justify="space-between"
                    align="flex-start"
                >
                    {/* Logo és Leírás */}
                    <Box mb={{ base: 10, md: 0 }} maxW={{ base: "full", md: "30%" }}>
                        <Text fontSize="2xl" fontWeight="bold" mb={4} color={textColor}>
                            Shopventure
                        </Text>
                        <Text fontSize="sm" color={textColor}>
                            A legjobb játékélményeket kínáljuk, amelyeket soha nem fogsz elfelejteni.
                        </Text>
                    </Box>

                    {/* Navigációs linkek */}
                    <Stack
                        direction={{ base: "column", md: "row" }}
                        spacing={8}
                        mb={{ base: 10, md: 0 }}
                        align="center"
                    >
                        <Stack align="center">
                            <Text fontWeight="500" fontSize="lg" mb={2}>
                                Shopventure
                            </Text>
                            <Link href="/download" _hover={{ color: "teal.300" }} color={textColor}>
                                Letöltés
                            </Link>
                            <Link href="/blog" _hover={{ color: "teal.300" }} color={textColor}>
                                Blog
                            </Link>
                        </Stack>
                    </Stack>

                    {/* Téma mód váltó */}
                    <Box maxW={{ base: "full", md: "30%" }}>
                        <Text fontWeight="500" fontSize="lg" mb={4} color={textColor}>
                            Téma beállítása
                        </Text>
                        <ColorModeButton />
                    </Box>
                </Flex>

                {/* Footer alja */}
                <Flex
                    direction={{ base: "column-reverse", md: "row" }}
                    justify="space-between"
                    align="center"
                    mt={10}
                >
                    <Text fontSize="sm" color={textColor}>
                        © {new Date().getFullYear()} Shopventure.
                    </Text>
                </Flex>
            </Container>
        </Box>
    );
};

export default Footer;
