// pages/settings.js

import React, { useState, useEffect } from "react";
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
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    useDisclosure,
    Checkbox, Avatar,
} from "@chakra-ui/react";
import supabase from "../utils/supabaseClient"; // Adjust the path if needed
import imageCompression from "browser-image-compression";

const SettingsPage = () => {
    // Profile state
    const [profile, setProfile] = useState({
        username: "",
        avatar_url: "",
        cover_image: "",
        bio: "",
    });
    // Other states
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [acceptedTerms, setAcceptedTerms] = useState(true); // Adjust as needed

    const { isOpen, onOpen, onClose } = useDisclosure();

    // Fetch current user's profile from Supabase
    useEffect(() => {
        const fetchProfile = async () => {
            const {
                data: { session },
                error: sessionError,
            } = await supabase.auth.getSession();

            if (sessionError) {
                console.error("Error fetching session:", sessionError);
                return;
            }

            const userId = session?.user?.id;

            if (userId) {
                const { data, error } = await supabase
                    .from("profiles")
                    .select("username, avatar_url, bio, cover_image")
                    .eq("id", userId)
                    .maybeSingle();

                if (error) {
                    console.error("Error fetching profile:", error);
                } else if (data) {
                    setProfile(data);
                } else {
                    console.log("No profile found for this user.");
                }
            }
        };

        fetchProfile();
    }, []);

    // Helper: Sanitize file names to remove diacritics and invalid characters.
    const sanitizeFileName = (fileName) =>
        fileName
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
            .replace(/[^a-zA-Z0-9.-]/g, "_"); // Replace invalid characters with underscores

    // Function to handle image compression and upload to Supabase bucket.
    // Ensure your bucket has proper RLS policies configured.
    const handleImageUpload = async (file, bucket, uniqueKey) => {
        try {
            const options = {
                maxSizeMB: 0.5,
                maxWidthOrHeight: 800,
                useWebWorker: true,
            };
            const compressedFile = await imageCompression(file, options);
            const { data, error } = await supabase.storage
                .from(bucket)
                .upload(uniqueKey, compressedFile, {
                    cacheControl: "3600",
                    upsert: false,
                });
            if (error) {
                throw error;
            }
            // For Supabase-js v2, getPublicUrl returns an object with data.publicUrl.
            const { data: { publicUrl }, error: publicURLError } =
                supabase.storage.from(bucket).getPublicUrl(uniqueKey);
            if (publicURLError) {
                throw publicURLError;
            }
            return publicUrl;
        } catch (err) {
            console.error("Error uploading image:", err);
            setError(err.message || "Image upload error");
            return null;
        }
    };

    // Handler for profile picture file input
    const handleProfilePicChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const sanitizedFileName = sanitizeFileName(file.name);
        const uniqueKey = `${Date.now()}-${sanitizedFileName}`;
        const url = await handleImageUpload(file, "profile_pic", uniqueKey);
        if (url) {
            setProfile((prev) => ({ ...prev, avatar_url: url }));
        }
    };

    // Handler for cover picture file input
    const handleCoverPicChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const sanitizedFileName = sanitizeFileName(file.name);
        const uniqueKey = `${Date.now()}-${sanitizedFileName}`;
        const url = await handleImageUpload(file, "cover_pic", uniqueKey);
        if (url) {
            setProfile((prev) => ({ ...prev, cover_image: url }));
        }
    };

    // Handler for password change
    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            setError("A jelszavak nem egyeznek!");
            return;
        }
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword,
            });
            if (error) {
                console.error("Error updating password:", error);
                setError(error.message || "Password update error");
                return;
            } else {
                setSuccess("Jelszó sikeresen megváltoztatva!");
                setTimeout(() => setSuccess(""), 5000);
            }
            setNewPassword("");
            setConfirmPassword("");
            onClose();
        } catch (err) {
            console.error("Unexpected error:", err);
            setError(err.message || "Unexpected error");
        }
    };

    // Handler for updating profile information
    const handleUpdateProfile = async () => {
        const {
            data: { session },
            error: sessionError,
        } = await supabase.auth.getSession();
        if (sessionError) {
            console.error("Error fetching session:", sessionError);
            return;
        }
        const userId = session?.user?.id;
        if (userId) {
            const { error } = await supabase
                .from("profiles")
                .update({
                    username: profile.username,
                    avatar_url: profile.avatar_url,
                    cover_image: profile.cover_image,
                    bio: profile.bio,
                })
                .eq("id", userId);
            if (error) {
                console.error("Error updating profile:", error);
                setError(error.message || "Profile update error");
            } else {
                setSuccess("Profilodat sikeresen frissítetted!");
                setTimeout(() => setSuccess(""), 5000);
            }
        }
    };

    // Chakra UI color settings for light/dark mode
    const bgColor = useColorModeValue("white", "gray.800");
    const headingTextColor = useColorModeValue("gray.800", "white");

    return (
        <>
            <Head>
                <title>Beállítások | Shopventure</title>
                <link rel="icon" href="/images/shopventure.png" />
                <meta name="description" content="Beállítások a Shopventure fiókoddal." />
            </Head>
            <Container maxW="3xl"  py={12}>
                <Box minH="80vh" p={8} bg={bgColor} boxShadow={"xl"}>
                    <Stack spacing={4}>
                        <Heading fontSize="2xl" textAlign="center" mb={5} color={headingTextColor}>
                            {profile.username} beállításai
                        </Heading>

                        {error && (
                            <Alert status="error">
                                <AlertIcon />
                                <AlertTitle mr={2}>
                                    {typeof error === "string" ? error : error.message}
                                </AlertTitle>
                            </Alert>
                        )}
                        {success && (
                            <Alert status="success">
                                <AlertIcon />
                                <AlertTitle mr={2}>{success}</AlertTitle>
                            </Alert>
                        )}

                        <Stack spacing={2}>
                            <Text>Felhasználónév</Text>
                            <Input
                                bg="gray.100"
                                borderColor="gray.300"
                                _dark={{ bg: "gray.900", borderColor: "gray.600", color: "gray.400" }}
                                _placeholder={{ color: "gray.500" }}
                                placeholder={profile.username || "Username"}
                                value={profile.username}
                                onChange={(e) =>
                                    setProfile({ ...profile, username: e.target.value })
                                }
                                maxLength={12}
                            />

                            <Text>Bio</Text>
                            <Input
                                bg="gray.100"
                                borderColor="gray.300"
                                _dark={{ bg: "gray.900", borderColor: "gray.600", color: "gray.400" }}
                                _placeholder={{ color: "gray.500" }}
                                placeholder={profile.bio || "Bio"}
                                value={profile.bio}
                                onChange={(e) =>
                                    setProfile({ ...profile, bio: e.target.value })
                                }
                                maxLength={40}
                            />
                            {profile.bio && (
                                <Text fontSize="sm" color="gray.500">
                                    {profile.bio.length}/40
                                </Text>
                            )}

                           <Center>
                                <Avatar
                                    src={profile.avatar_url}
                                    alt="Profile Avatar"
                                    boxSize="150px"
                                />
                            </Center>
                            <Input type="file" accept="image/*" onChange={handleProfilePicChange} />

                            <Center>
                                <Image
                                    src={profile.cover_image}
                                    alt="Cover Image"
                                    width={"500px"}
                                    maxWidth={"100%"}
                                />
                            </Center>
                            <Input type="file" accept="image/*" onChange={handleCoverPicChange} />
                        </Stack>

                        <Text mt={4}>Jelszó megváltoztatása</Text>
                        <Center>
                            <Button variant="outline" onClick={onOpen}>
                                Megváltoztatás
                            </Button>
                        </Center>

                        <Button
                            mt={5}
                            colorScheme="orange"
                            bg="orange.400"
                            _hover={{ bg: "orange.500" }}
                            onClick={handleUpdateProfile}
                        >
                            Mentés
                        </Button>
                    </Stack>
                </Box>
            </Container>

            {/* Modal: Jelszó megváltoztatása */}
            <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset="slideInBottom">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Jelszó megváltoztatása</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Stack spacing={4}>
                            {error && (
                                <Alert status="error">
                                    <AlertIcon />
                                    <AlertTitle mr={2}>
                                        {typeof error === "string" ? error : error.message}
                                    </AlertTitle>
                                </Alert>
                            )}
                            {success && (
                                <Alert status="success">
                                    <AlertIcon />
                                    <AlertTitle mr={2}>{success}</AlertTitle>
                                </Alert>
                            )}
                            <Text>Új jelszó</Text>
                            <Input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Új jelszó"
                            />
                            <Text>Jelszó megerősítése</Text>
                            <Input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Jelszó megerősítése"
                            />
                        </Stack>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="outline" mr={3} onClick={onClose}>
                            Mégse
                        </Button>
                        <Button onClick={handlePasswordChange} colorScheme="teal">
                            Mentés
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default SettingsPage;
