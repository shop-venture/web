// pages/reviews.js
import React, { useState, useEffect } from 'react';
import {
    Box,
    Text,
    Flex,
    Stack,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Button,
    Avatar,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import supabase from '../utils/supabaseClient';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(0);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [editingReview, setEditingReview] = useState(null);

    useEffect(() => {
        fetchReviews();
        fetchCurrentUser();
    }, []);

    // Lekéri az értékeléseket a profiles táblával együtt
    const fetchReviews = async () => {
        const { data, error } = await supabase
            .from('reviews')
            .select('*, profiles(username, avatar_url)')
            .order('created_at', { ascending: false });
        if (error) {
            console.error('Hiba az értékelések betöltésekor: ', error);
        } else {
            setReviews(data);
        }
    };

    // Lekéri a bejelentkezett felhasználót
    const fetchCurrentUser = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        setCurrentUser(user);
    };

    // Új review beküldése
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Felhasználó ellenőrzése
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
            alert('Be kell jelentkezned az értékeléshez!');
            return;
        }

        // Csak egy review engedélyezett felhasználónként
        const existingReview = reviews.find((review) => review.user_id === user.id);
        if (existingReview) {
            alert('Már írtál értékelést!');
            return;
        }

        if (!title || !content || rating === 0) {
            alert('Kérlek töltsd ki az összes mezőt, és válassz értékelést!');
            return;
        }

        setLoading(true);
        const { data, error: insertError } = await supabase
            .from('reviews')
            .insert([{ title, content, rating, user_id: user.id }])
            .select();

        if (insertError) {
            setError(insertError.message);
            console.error(insertError);
        } else {
            // Új review beszúrása a helyi állapotba
            setReviews([data[0], ...reviews]);
            setTitle('');
            setContent('');
            setRating(0);
        }
        setLoading(false);
    };

    // Review módosítása
    const handleUpdate = async () => {
        if (!editingReview) return;

        if (
            !editingReview.title ||
            !editingReview.content ||
            editingReview.rating === 0
        ) {
            alert('Kérlek töltsd ki az összes mezőt az értékelés módosításához!');
            return;
        }

        setLoading(true);
        const { data, error: updateError } = await supabase
            .from('reviews')
            .update({
                title: editingReview.title,
                content: editingReview.content,
                rating: editingReview.rating,
                updated: new Date().toISOString(),
            })
            .eq('id', editingReview.id)
            .select();

        if (updateError) {
            setError(updateError.message);
            console.error(updateError);
        } else {
            const updatedReview = data[0];
            setReviews(
                reviews.map((review) =>
                    review.id === updatedReview.id ? updatedReview : review
                )
            );
            setEditingReview(null);
        }
        setLoading(false);
    };

    // Review törlése
    const handleDelete = async (id) => {
        setLoading(true);
        const { data, error: deleteError } = await supabase
            .from('reviews')
            .delete()
            .eq('id', id)
            .select();

        if (deleteError) {
            setError(deleteError.message);
            console.error(deleteError);
        } else {
            setReviews(reviews.filter((review) => review.id !== id));
        }
        setLoading(false);
    };

    return (
        <>
            <Head>
                <title>Shopventure - Értékelj most!</title>
                <link rel="icon" href="/images/shopventure.png"/>
                <meta
                    name="description"
                    content="Értékelj minket most!"
                />
            </Head>
        <Box maxW="600px" mx="auto" p={4}>
            <form onSubmit={handleSubmit}>
                <Stack spacing={4}>
                    <FormControl id="title" isRequired>
                        <FormLabel>Cím</FormLabel>
                        <Input
                            placeholder="Írd be a címet"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </FormControl>
                    <FormControl id="content" isRequired>
                        <FormLabel>Tartalom</FormLabel>
                        <Textarea
                            placeholder="Írd be a tartalmat"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </FormControl>
                    <FormControl id="rating" isRequired>
                        <FormLabel>Értékelés (1-10 csillag)</FormLabel>
                        <Flex>
                            {Array.from({ length: 10 }, (_, i) => i + 1).map((star) => (
                                <StarIcon
                                    key={star}
                                    boxSize={6}
                                    cursor="pointer"
                                    color={star <= rating ? 'orange.500' : 'gray.300'}
                                    onClick={() => setRating(star)}
                                />
                            ))}
                        </Flex>
                    </FormControl>
                    {error && <Text color="red.500">{error}</Text>}
                    <Button type="submit" colorScheme="orange" isLoading={loading}>
                        Értékelés elküldése
                    </Button>
                </Stack>
            </form>

            <Box mt={8}>
                <Text fontSize="2xl" fontWeight="bold" mb={4}>
                    Értékelések
                </Text>
                {reviews.length === 0 ? (
                    <Text>Nincsenek értékelések.</Text>
                ) : (
                    <Stack spacing={6}>
                        {reviews.map((review) => (
                            <Box
                                key={review.id}
                                borderWidth="1px"
                                borderRadius="lg"
                                p={6}
                                boxShadow="md"
                            >
                                {editingReview && editingReview.id === review.id ? (
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            handleUpdate();
                                        }}
                                    >
                                        <FormControl id="edit-title" isRequired mb={3}>
                                            <FormLabel>Cím</FormLabel>
                                            <Input
                                                value={editingReview.title}
                                                onChange={(e) =>
                                                    setEditingReview({
                                                        ...editingReview,
                                                        title: e.target.value,
                                                    })
                                                }
                                            />
                                        </FormControl>
                                        <FormControl id="edit-content" isRequired mb={3}>
                                            <FormLabel>Tartalom</FormLabel>
                                            <Textarea
                                                value={editingReview.content}
                                                onChange={(e) =>
                                                    setEditingReview({
                                                        ...editingReview,
                                                        content: e.target.value,
                                                    })
                                                }
                                            />
                                        </FormControl>
                                        <FormControl id="edit-rating" isRequired mb={3}>
                                            <FormLabel>Értékelés (1-10 csillag)</FormLabel>
                                            <Flex>
                                                {Array.from({ length: 10 }, (_, i) => i + 1).map(
                                                    (star) => (
                                                        <StarIcon
                                                            key={star}
                                                            boxSize={6}
                                                            cursor="pointer"
                                                            color={
                                                                star <= editingReview.rating
                                                                    ? 'orange.500'
                                                                    : 'gray.300'
                                                            }
                                                            onClick={() =>
                                                                setEditingReview({
                                                                    ...editingReview,
                                                                    rating: star,
                                                                })
                                                            }
                                                        />
                                                    )
                                                )}
                                            </Flex>
                                        </FormControl>
                                        <Flex mt={2} justifyContent="flex-end">
                                            <Button
                                                type="submit"
                                                colorScheme="orange"
                                                size="sm"
                                                mr={2}
                                                isLoading={loading}
                                            >
                                                Frissítés
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() => setEditingReview(null)}
                                                isDisabled={loading}
                                            >
                                                Mégse
                                            </Button>
                                        </Flex>
                                    </form>
                                ) : (
                                    <>
                                        <Flex
                                            justifyContent="space-between"
                                            alignItems="center"
                                            mb={4}
                                        >
                                            {review.profiles && (
                                                <Flex alignItems="center">
                                                    <Avatar
                                                        size="md"
                                                        src={review.profiles.avatar_url}
                                                        mr={3}
                                                        name={review.profiles.username}
                                                    />
                                                    <Text fontSize="md" fontWeight="bold">
                                                        {review.profiles.username}
                                                    </Text>
                                                </Flex>
                                            )}
                                            <Text fontSize="2xl" fontWeight="bold">
                                                {review.title}
                                            </Text>
                                            <Text fontSize="sm" color="gray.500">
                                                {new Date(review.created_at).toLocaleDateString()}
                                            </Text>
                                        </Flex>
                                        <Text mb={4}>{review.content}</Text>
                                        <Flex alignItems="center" mb={2}>
                                            {Array.from({ length: 10 }, (_, i) => i + 1).map((star) => (
                                                <StarIcon
                                                    key={star}
                                                    boxSize={5}
                                                    color={star <= review.rating ? 'orange.500' : 'gray.300'}
                                                />
                                            ))}
                                            <Text ml={3} fontSize="sm">
                                                {review.rating}/10
                                            </Text>
                                        </Flex>
                                        {review.updated &&
                                            review.updated !== review.created_at && (
                                                <Text fontSize="xs" color="gray.500" mb={2}>
                                                    Frissítve:{' '}
                                                    {new Date(review.updated).toLocaleDateString()}
                                                </Text>
                                            )}
                                        {currentUser && currentUser.id === review.user_id && (
                                            <Flex justifyContent="flex-end" mt={2}>
                                                <Button
                                                    size="sm"
                                                    colorScheme="blue"
                                                    mr={2}
                                                    onClick={() => setEditingReview(review)}
                                                    isDisabled={loading}
                                                >
                                                    Szerkesztés
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    colorScheme="red"
                                                    onClick={() => handleDelete(review.id)}
                                                    isDisabled={loading}
                                                >
                                                    Törlés
                                                </Button>
                                            </Flex>
                                        )}
                                    </>
                                )}
                            </Box>
                        ))}
                    </Stack>
                )}
            </Box>
        </Box>
        </>
    );
};

export default Reviews;
