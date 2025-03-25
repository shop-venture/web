// pages/[slug].jsx
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import supabase from '@/utils/supabaseClient'
import { Box, Heading, Spinner, Image } from '@chakra-ui/react'
import Head from "next/head";

// Ugyanaz a slugify függvény, mint az index.js-ben
const slugify = (text) =>
    text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '')

export default function BlogDetail() {
    const router = useRouter()
    const { slug } = router.query
    const [blog, setBlog] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!slug) return

        async function fetchBlog() {
            // Mivel a táblánkban nincs külön slug mező, ezért az összes bejegyzést lekérjük és kiszűrjük azt,
            // melynek slug-ja megegyezik a URL-ben kapott slug értékkel.
            let { data, error } = await supabase.from('blog').select('*')

            if (error) {
                console.error('Hiba a bejegyzés lekérésekor:', error)
                setLoading(false)
                return
            }

            const found = data.find((item) => slugify(item.title) === slug)
            setBlog(found)
            setLoading(false)
        }

        fetchBlog()
    }, [slug])

    if (loading)
        return (
            <Box textAlign="center" mt="10">
                <Spinner size="xl" />
            </Box>
        )

    if (!blog)
        return (
            <Box textAlign="center" mt="10">
                <Heading>Nem található bejegyzés</Heading>
            </Box>
        )

    return (
        <>
            <Head>
                <title>{blog.title} - Shopventure</title>
                <link rel="icon" href="/images/shopventure.png"/>
                <meta
                    name="description"
                    content="Csatlakozz a 2D boltos játék világához, ahol a játék és az üzlet találkozik. Készen állsz a kihívásra?"
                />
            </Head>
        <Box maxW="800px" mx="auto" p="4">
            <Heading mb="4">{blog.title}</Heading>
            {blog.image_url && (
                <Image src={blog.image_url} alt={blog.title} mb="4" borderRadius="md" width={"100%"} />
            )}
            <Box
                mb="4"
                dangerouslySetInnerHTML={{ __html: blog.content }}
            />
            {blog.categories && blog.categories.length > 0 && (
                <Box>
                    <Heading size="sm" mb="2">Kategóriák:</Heading>
                    <Box>{blog.categories.join(', ')}</Box>
                </Box>
            )}
        </Box>
        </>
    )
}
