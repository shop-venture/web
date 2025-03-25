// pages/[username].js

import React, { useState, useEffect } from "react";
import {
    Box,
    Container,
    Heading,
    Text,
    Center,
    Spinner,
    Alert,
    AlertIcon,
    useColorModeValue,
    Avatar,
    Flex,
    Stack,
    Divider,
    Button, HStack
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import supabase from "@/utils/supabaseClient"; // Adjust path if needed
import UserBadges from "@/components/UserBadges";
import Head from "next/head"; // Adjust path if needed
const MotionBox = motion(Box);

const ProfilePage = () => {
    const router = useRouter();
    const { username } = router.query;

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Colors for light/dark modes
    const bgCard = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("gray.700", "gray.200");

    useEffect(() => {
        if (!username) return; // Wait for the route parameter to be available
        const fetchProfile = async () => {
            try {
                const { data, error } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("username", username)
                    .maybeSingle();
                if (error) throw error;
                setProfile(data);
            } catch (err) {
                console.error("Error fetching profile:", err);
                setError(err.message || "An unexpected error occurred.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [username]);

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

    if (!profile) {
        return (
            <Container maxW="5xl" py={12}>
                <Heading textAlign="center">Profile not found</Heading>
            </Container>
        );
    }

    // Fallback images if not provided
    const coverImage =
        profile.cover_image ||
        "https://via.placeholder.com/1200x300?text=Cover+Image";
    const avatarImage =
        profile.avatar_url || "https://via.placeholder.com/150?text=Avatar";

    return (
        <>
            <Head>
                <title>{profile.username} | Shopventure</title>
                <link rel="icon" href="/images/shopventure.png"/>
                <meta
                    name="description"
                    content="Csatlakozz a 2D boltos játék világához, ahol a játék és az üzlet találkozik. Készen állsz a kihívásra?"
                />
            </Head>
        <Container maxW="5xl">
            {/* Cover Section with animated zoom effect and gradient overlay */}
            <MotionBox
                height={{ base: "200px", md: "350px" }}
                bgImage={`url(${coverImage})`}
                bgSize="100%"
                bgPosition="center"
                mb={-12}
                position="relative"
                initial={{ scale: 1.05, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bgGradient="linear(to-b, rgba(0,0,0,0.5), rgba(0,0,0,0.5))"
                    borderRadius="md"
                />
            </MotionBox>

            <MotionBox
                bg={bgCard}
                p={6}
                pt={4}
                mt={10}
                mb={12}
                position="relative"
                zIndex={1}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
            >
                <Flex
                            direction={{ base: "column", md: "row" }}
                            align="center"
                            justify="space-between"
                            textAlign="left"
                        >
                            {/* Profile Information */}
                            <Stack
                                spacing={3}
                                ml={{ base: 0, md: 8 }}
                                mt={{ base: 4, md: 0 }}
                            >
                                <HStack>
                                <Heading as="h1" size="xl">
                                    {profile.username}
                                </Heading>
                                    <UserBadges profile={profile} />
                                </HStack>
                                {profile.shop_name && (
                                    <Text fontSize="lg" color={textColor}>
                                        {profile.shop_name}
                                    </Text>
                                )}
                                <Divider />
                              <Text color={textColor} fontSize="sm">
                                        <strong>Csatlakozott:</strong>{" "}
                                        {Math.floor((new Date() - new Date(profile.created_at)) / (1000 * 60 * 60 * 24))} napja!
                                    </Text>
                                {profile.bio && (
                                    <Text color={textColor} fontSize="sm">
                                        <strong>Bio:</strong> {profile.bio}
                                    </Text>
                                )}
                            </Stack>

                            <Center>
                                <MotionBox
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 0.7 }}
                                >
                                    <Avatar
                                        size="2xl"
                                        src={avatarImage}
                                        name={profile.username}
                                        borderWidth={4}
                                        borderColor={bgCard}
                                    />
                                </MotionBox>
                            </Center>

                            <Button
                                colorScheme="blue"
                                variant={"outline"}
                                onClick={() => router.push(`/settings`)}
                            >
                                Modosítás
                            </Button>
                        </Flex>
            </MotionBox>
        </Container>
        </>
    );
};

export default ProfilePage;
