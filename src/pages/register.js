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
    FormControl,
    FormLabel,
    Checkbox,
    Alert,
    AlertIcon,
    AlertTitle,
    Link,
    Center,
    Image,
    useColorModeValue,
} from "@chakra-ui/react";
import supabase from "../utils/supabaseClient"; // Győződj meg róla, hogy az útvonal helyes

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            setError({ message: "A két jelszó nem egyezik meg" });
            return;
        }

        // Felhasználó regisztrációja
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
        });
    
        if (signUpError) {
            setError(signUpError);
            return;
        }

        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !sessionData?.session?.user?.id) {
            setError({ message: "Nem sikerült lekérni a session adatait" });
            return;
        }

        const userUuid = sessionData.session.user.id;

        // Új profil beszúrása a profiles táblába
        const { error: profileError } = await supabase
            .from("profiles")
            .insert([
                {
                    id: userUuid,
                    username,
                    avatar_url: "",
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ]);

        if (profileError) {
            console.error("Error inserting profile:", profileError);
            setError(profileError);
            return;
        }


        setSuccess("Sikeres regisztráció! Most jelentkezz be.");
    };

    // Világos/sötét mód színei
    const bgColor = useColorModeValue("white", "gray.900");
    const borderColor = useColorModeValue("gray.200", "gray.600");
    const headingTextColor = useColorModeValue("gray.800", "white");

    return (
        <>
            <Head>
                <title>Regisztráció | Shopventure</title>
                <link rel="icon" href="/images/shopventure.png" />
                <meta name="description" content="Regisztrálj Shopventure fiókot!" />
            </Head>
            <Container maxW="xl" py={12}>
                <Box
                    p={8}
                    bg={bgColor}
                    boxShadow="lg"
                    rounded="lg"
                    border="1px"
                    borderColor={borderColor}
                >
                    <Stack spacing={4}>
                        <Center>
                            <Image
                                src="/images/shopventure.png"
                                alt="Shopventure logo"
                                boxSize="150px"
                            />
                        </Center>
                        <Heading fontSize="2xl" textAlign="center" mb={5} color={headingTextColor}>
                            Regisztrálj egy új kalandra
                        </Heading>

                        {error && (
                            <Alert status="error">
                                <AlertIcon />
                                <AlertTitle mr={2}>{error.message}</AlertTitle>
                            </Alert>
                        )}
                        {success && (
                            <Alert status="success">
                                <AlertIcon />
                                <AlertTitle mr={2}>{success}</AlertTitle>
                            </Alert>
                        )}

                        <Stack spacing={4}>
                            <FormControl id="username" isRequired>
                                <FormLabel>Felhasználónév</FormLabel>
                                <Input
                                    name="username"
                                    value={username}
                                    placeholder="johndoe"
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </FormControl>
                            <FormControl id="email" isRequired>
                                <FormLabel>Email</FormLabel>
                                <Input
                                    name="email"
                                    type="email"
                                    value={email}
                                    placeholder="pelda@email.domain"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </FormControl>
                            <FormControl id="password" isRequired>
                                <FormLabel>Jelszó</FormLabel>
                                <Input
                                    name="password"
                                    type="password"
                                    value={password}
                                    placeholder="Jelszó"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </FormControl>
                            <FormControl id="confirmPassword" isRequired>
                                <FormLabel>Jelszó megerősítése</FormLabel>
                                <Input
                                    name="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    placeholder="Jelszó megerősítése"
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </FormControl>
                            <FormControl id="terms" isRequired>
                                <Checkbox
                                    isChecked={acceptedTerms}
                                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                                >
                                    Elfogadom a felhasználási feltételeket és az adatvédelmi nyilatkozatot
                                </Checkbox>
                            </FormControl>
                        </Stack>
                        <Center>
                            <Button
                                mt={5}
                                colorScheme="orange"
                                onClick={handleRegister}
                                isDisabled={!acceptedTerms}
                                fontWeight={400}
                                fontSize="lg"
                            >
                                Regisztráció
                            </Button>
                        </Center>
                        <Center>
                            <Text mt={3}>
                                Már van fiókod?{" "}
                                <Link color="orange.500" href="/login">
                                    Jelentkezz be!
                                </Link>
                            </Text>
                        </Center>
                    </Stack>
                </Box>
            </Container>
        </>
    );
}
