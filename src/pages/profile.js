// pages/profiles.js

import React, { useState, useEffect } from "react";
import {
    Box,
    Container,
    Heading,
    Stack,
    Text,
    Center,
    Spinner,
    Alert,
    AlertIcon,
    HStack,
    VStack,
    useColorModeValue,
} from "@chakra-ui/react";
import {
    FaUser,
    FaBox,
    FaStar,
    FaChartLine,
    FaStore,
    FaExchangeAlt,
} from "react-icons/fa";
import supabase from "../utils/supabaseClient"; // Győződj meg róla, hogy az útvonal helyes

const ProfilesPage = () => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Lekérjük a bejelentkezett felhasználó session-jét
                const {
                    data: { session },
                } = await supabase.auth.getSession();

                if (!session) throw new Error("User not authenticated");

                const userId = session.user.id;

                // Profilok lekérése a felhasználóhoz
                const { data: profilesData, error: profilesError } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("user_id", userId);

                if (profilesError) throw profilesError;

                // Készlet lekérése a felhasználóhoz
                const { data: inventoryData, error: inventoryError } = await supabase
                    .from("inventory")
                    .select("*")
                    .eq("user_id", userId);

                if (inventoryError) throw inventoryError;

                // Ranglista lekérése a felhasználóhoz
                const { data: rankingsData, error: rankingsError } = await supabase
                    .from("rankings")
                    .select("*")
                    .eq("user_id", userId);

                if (rankingsError) throw rankingsError;

                // Statisztikák lekérése a felhasználóhoz
                const { data: statisticsData, error: statisticsError } = await supabase
                    .from("statistics")
                    .select("*")
                    .eq("user_id", userId);

                if (statisticsError) throw statisticsError;

                // Boltok lekérése a felhasználóhoz
                const { data: storesData, error: storesError } = await supabase
                    .from("stores")
                    .select("*")
                    .eq("user_id", userId);

                if (storesError) throw storesError;

                // Tranzakciók lekérése a felhasználóhoz
                const { data: transactionsData, error: transactionsError } = await supabase
                    .from("transactions")
                    .select("*")
                    .eq("user_id", userId);

                if (transactionsError) throw transactionsError;

                // Az adatok beállítása
                setData({
                    profiles: profilesData,
                    inventory: inventoryData,
                    rankings: rankingsData,
                    statistics: statisticsData,
                    stores: storesData,
                    transactions: transactionsData,
                });
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err.message || "An unexpected error occurred.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Világos/sötét módhoz tartozó színek
    const bgBox = useColorModeValue("gray.50", "gray.700");

    if (loading) {
        return (
            <Center minH="80vh">
                <Spinner size="xl" />
            </Center>
        );
    }

    if (error) {
        return (
            <Container maxW="5xl" py={12}>
                <Alert status="error">
                    <AlertIcon />
                    {error}
                </Alert>
            </Container>
        );
    }

    return (
        <>
            <Head>
                <title>Shopventure - {data.profiles[0]?.username}</title>
                <link rel="icon" href="/images/shopventure.png"/>
                <meta
                    name="description"
                    content="Csatlakozz a 2D boltos játék világához, ahol a játék és az üzlet találkozik. Készen állsz a kihívásra?"
                />
            </Head>
        <Container maxW="5xl" py={12}>
            <Heading as="h1" mb={6} textAlign="center">
                Adatok
            </Heading>
            <VStack spacing={8}>
                {/* Profiles */}
                <Box w="100%" p={6} boxShadow="md" rounded="lg" bg={bgBox}>
                    <HStack spacing={4} align="center">
                        <FaUser size={24} color="blue" />
                        <Heading as="h2" fontSize="xl">
                            Profiles
                        </Heading>
                    </HStack>
                    <Text mt={4}>{JSON.stringify(data.profiles, null, 2)}</Text>
                </Box>

                {/* Inventory */}
                <Box w="100%" p={6} boxShadow="md" rounded="lg" bg={bgBox}>
                    <HStack spacing={4} align="center">
                        <FaBox size={24} color="orange" />
                        <Heading as="h2" fontSize="xl">
                            Inventory
                        </Heading>
                    </HStack>
                    <Text mt={4}>{JSON.stringify(data.inventory, null, 2)}</Text>
                </Box>

                {/* Rankings */}
                <Box w="100%" p={6} boxShadow="md" rounded="lg" bg={bgBox}>
                    <HStack spacing={4} align="center">
                        <FaStar size={24} color="yellow" />
                        <Heading as="h2" fontSize="xl">
                            Rankings
                        </Heading>
                    </HStack>
                    <Text mt={4}>{JSON.stringify(data.rankings, null, 2)}</Text>
                </Box>

                {/* Statistics */}
                <Box w="100%" p={6} boxShadow="md" rounded="lg" bg={bgBox}>
                    <HStack spacing={4} align="center">
                        <FaChartLine size={24} color="green" />
                        <Heading as="h2" fontSize="xl">
                            Statistics
                        </Heading>
                    </HStack>
                    <Text mt={4}>{JSON.stringify(data.statistics, null, 2)}</Text>
                </Box>

                {/* Stores */}
                <Box w="100%" p={6} boxShadow="md" rounded="lg" bg={bgBox}>
                    <HStack spacing={4} align="center">
                        <FaStore size={24} color="purple" />
                        <Heading as="h2" fontSize="xl">
                            Stores
                        </Heading>
                    </HStack>
                    <Text mt={4}>{JSON.stringify(data.stores, null, 2)}</Text>
                </Box>

                {/* Transactions */}
                <Box w="100%" p={6} boxShadow="md" rounded="lg" bg={bgBox}>
                    <HStack spacing={4} align="center">
                        <FaExchangeAlt size={24} color="red" />
                        <Heading as="h2" fontSize="xl">
                            Transactions
                        </Heading>
                    </HStack>
                    <Text mt={4}>{JSON.stringify(data.transactions, null, 2)}</Text>
                </Box>
            </VStack>
        </Container>
            </>
    );
};

export default ProfilesPage;
