// pages/index.js
import { useState, useEffect } from 'react'
import Link from 'next/link'
import supabase from '@/utils/supabaseClient'
import {
    Box,
    Heading,
    Spinner,
    Stack,
    Container,
    Button,
    Text,
    VStack,
    useColorModeValue,
    Image, SimpleGrid
} from '@chakra-ui/react'
import Head from "next/head";

const slugify = (text) =>
    text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '')

export default function Home() {
    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchBlogs() {
            const { data, error } = await supabase
                .from('blog')
                .select('*')
                .order('id', { ascending: false })

            if (error) console.error('Hiba a blogok lekérdezésekor:', error)
            else setBlogs(data)

            setLoading(false)
        }

        fetchBlogs()
    }, [])

    const cardBg = useColorModeValue('white', 'gray.800')
    const cardHoverBg = useColorModeValue('gray.50', 'gray.700')
    const textColor = useColorModeValue('gray.600', 'gray.300')

    if (loading)
        return (
            <Container maxW="container.lg" centerContent py="20">
                <Spinner size="xl" thickness="4px" speed="0.65s" color="orange.500" />
            </Container>
        )

    return (
        <>
            <Head>
                <title>Blog | Shopventure</title>
                <link rel="icon" href="/images/shopventure.png"/>
                <meta
                    name="description"
                    content="Csatlakozz a 2D boltos játék világához, ahol a játék és az üzlet találkozik. Készen állsz a kihívásra?"
                />
            </Head>
        <Container maxW="5xl" py="12">
            <VStack spacing="8" align="stretch">
                <Heading
                    as="h1"
                    size="2xl"
                    textAlign="center"
                    bgGradient="linear(to-r, orange.400, orange.500)"
                    bgClip="text"
                    fontWeight="extrabold"
                >
                    Blogbejegyzések
                </Heading>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing="6">
                    {blogs.map((blog) => (
                        <Link href={`/blog/${slugify(blog.title)}`}>
                            <Box
                                key={blog.id}
                                p="4"
                                bg={cardBg}
                                borderRadius="md"
                                boxShadow="md"
                                transition="all 0.3s"
                                _hover={{
                                    bg: cardHoverBg,
                                    transform: 'translateY(-3px)',
                                    boxShadow: 'lg',
                                }}
                                mb="4"
                            >
                                <Image src={blog.image_url} width={"100%"} mb={4} />
                                <Heading
                                    as="h2"
                                    size="md"
                                    mb="2"
                                    fontWeight="semibold"
                                    color={useColorModeValue('gray.800', 'white')}
                                >
                                    <Link href={`/blog/${slugify(blog.title)}`} passHref>
                                        <Button
                                            variant="link"
                                            colorScheme="orange"
                                            fontSize="inherit"
                                            fontWeight="inherit"
                                            _hover={{ textDecoration: 'underline' }}
                                        >
                                            {blog.title}
                                        </Button>
                                    </Link>
                                </Heading>
                                <Text
                                    color={textColor}
                                    noOfLines={2}
                                    dangerouslySetInnerHTML={{ __html: blog.content }}
                                />
                                <Link href={`/blog/${slugify(blog.title)}`} passHref>
                                    <Button
                                        variant="link"
                                        colorScheme="orange"
                                        mt="2"
                                        fontSize="sm"
                                        _hover={{ textDecoration: 'underline' }}
                                    >
                                        Olvasd tovább →
                                    </Button>
                                </Link>
                            </Box>
                        </Link>
                    ))}
                </SimpleGrid>

                <Box textAlign="center">
                    <Link href="/blog/create-blog" passHref>
                        <Button
                            size="lg"
                            colorScheme="orange"
                            bgGradient="linear(to-r, orange.500, orange.600)"
                            _hover={{ bgGradient: 'linear(to-r, orange.600, orange.700)' }}
                            px="8"
                            py="6"
                            fontSize="md"
                            fontWeight="bold"
                            borderRadius="full"
                            boxShadow="md"
                        >
                            Új bejegyzés
                        </Button>
                    </Link>
                </Box>
            </VStack>
        </Container>
        </>
    )
}
