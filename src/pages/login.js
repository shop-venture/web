import React, { useState } from "react";
import Head from "next/head";
import {
    Box,
    Button,
    Container,
    Input,
    Stack,
    Heading,
    Text,
    Alert,
    AlertIcon,
    AlertTitle,
    Link,
    Center,
    Image,
    useColorModeValue,
} from "@chakra-ui/react";
import supabase from "../utils/supabaseClient"; // Győződj meg róla, hogy ez az útvonal helyes

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleLogin = async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error(error);
            setError(error);
        } else {
            // Átirányítás a dashboardra vagy a kezdőlapra
            window.location.href = "/";
        }
    };

    // Chakra UI 2.x useColorModeValue hook a világos/sötét módhoz
    const bgColor = useColorModeValue("white", "gray.900");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const headingTextColor = useColorModeValue("gray.800", "white");
    const labelColor = useColorModeValue("gray.600", "gray.200");
    const inputBg = useColorModeValue("gray.100", "gray.900");
    const inputBorderColor = useColorModeValue("gray.300", "gray.600");
    const placeholderColor = useColorModeValue("gray.500", "gray.500");

    return (
        <>
            <Head>
                <title>Bejelentkezés | Shopventure</title>
                <link rel="icon" href="/images/shopventure.png" />
                <meta name="description" content="Jelentkezz be Shopventure fiókodba" />
            </Head>
            <Container maxW="xl" py={12}>
                <Box
                    p={8}
                    bg={bgColor}
                    border="1px"
                    borderColor={borderColor}
                    shadow="lg"
                    rounded="lg"
                >
                    <Stack spacing={6}>
                        <Center>
                            <Image
                                src="/images/shopventure.png"
                                alt="Shopventure logo"
                                boxSize="150px"
                            />
                        </Center>
                        <Heading
                            mb={5}
                            fontSize="2xl"
                            textAlign="center"
                            color={headingTextColor}
                        >
                            Jelentkezz be Shopventure fiókodba
                        </Heading>

                        {error && (
                            <Alert status="error">
                                <AlertIcon />
                                <AlertTitle mr={2}>{error.message}</AlertTitle>
                            </Alert>
                        )}

                        <Stack spacing={4}>
                            <Text mt={3} color={labelColor}>
                                Add meg az emailcímed
                            </Text>
                            <Input
                                placeholder="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                bg={inputBg}
                                borderColor={inputBorderColor}
                                _placeholder={{ color: placeholderColor }}
                            />
                            <Text mt={3} color={labelColor}>
                                Add meg a jelszavad
                            </Text>
                            <Input
                                placeholder="Jelszó"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                bg={inputBg}
                                borderColor={inputBorderColor}
                                _placeholder={{ color: placeholderColor }}
                            />
                            <Button
                                width="100%"
                                mt={3}
                                colorScheme="purple"
                                onClick={handleLogin}
                                isDisabled={!email || !password}
                                fontWeight={400}
                                fontSize="lg"
                            >
                                Bejelentkezés
                            </Button>
                            <Center mt={3}>
                                <Text>
                                    Még nincs fiókod?{" "}
                                    <Link color="purple.500" href="/register">
                                        Regisztrálj!
                                    </Link>
                                </Text>
                            </Center>
                        </Stack>
                    </Stack>
                </Box>
            </Container>
        </>
    );
};

export default LoginPage;
