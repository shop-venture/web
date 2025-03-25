// pages/create-blog.js
import { useState } from 'react'
import { useRouter } from 'next/router'
import supabase from '@/utils/supabaseClient'
import { Box, Heading, Input, Button, FormControl, FormLabel, Container } from '@chakra-ui/react'
import { Editor } from '@tinymce/tinymce-react'

const slugify = (text) =>
    text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '')

export default function CreateBlog() {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [categories, setCategories] = useState('')
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const categoriesArray = categories.split(',').map((cat) => cat.trim()).filter(Boolean)
        const { data, error } = await supabase
            .from('blog')
            .insert([{ title, content, image_url: imageUrl, categories: categoriesArray }])
            .select()
        if (error) {
            console.error('Error creating blog post:', error)
        } else {
            const post = data[0]
            router.push(`/blog/${slugify(post.title)}`)
        }
    }

    return (
        <Container maxW="5xl" mx="auto" p="4">
            <Heading mb="4">Új Blogbejegyzés</Heading>
            <form onSubmit={handleSubmit}>
                <FormControl mb="4" isRequired>
                    <FormLabel>Cím</FormLabel>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Blog címe" />
                </FormControl>
                <FormControl mb="4" isRequired>
                    <FormLabel>Tartalom</FormLabel>
                    <Editor
                        apiKey="b4e9zxx7v1brzmzgqh2x80tcapzwawzr565hi35tzhngdi5v"
                        value={content}
                        init={{
                            height: 600,
                            menubar: true,
                            branding: false,
                            plugins: [
                                'advlist', 'anchor', 'autolink', 'charmap', 'code', 'codesample', 'directionality', 'emoticons', 'fullpage',
                                'help', 'image', 'imagetools', 'importcss', 'lists', 'link', 'media', 'nonbreaking', 'pagebreak', 'preview',
                                'print', 'quickbars', 'save', 'searchreplace', 'table', 'template', 'textpattern', 'toc', 'visualblocks', 'wordcount'
                            ],
                            toolbar: [
                                'undo redo | bold italic underline strikethrough | forecolor backcolor | fontsizeselect formatselect',
                                'alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | blockquote subscript superscript',
                                'removeformat | code codesample | pagebreak | charmap emoticons | link image media | fullpage preview print',
                                'ltr rtl | lineheight | table | help'
                            ].join(' | '),
                            quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
                            image_advtab: true,
                            images_upload_url: '/api/upload-image',
                            automatic_uploads: true,
                            file_picker_types: 'image',
                            file_picker_callback: (cb, value, meta) => {
                                const input = document.createElement('input')
                                input.setAttribute('type', 'file')
                                input.setAttribute('accept', 'image/*')
                                input.onchange = function () {
                                    const file = this.files[0]
                                    const reader = new FileReader()
                                    reader.onload = function () {
                                        const id = 'blobid' + new Date().getTime()
                                        const blobCache = tinymce.activeEditor.editorUpload.blobCache
                                        const base64 = reader.result.split(',')[1]
                                        const blobInfo = blobCache.create(id, file, base64)
                                        blobCache.add(blobInfo)
                                        cb(blobInfo.blobUri(), { title: file.name })
                                    }
                                    reader.readAsDataURL(file)
                                }
                                input.click()
                            },
                            content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:16px }",
                            importcss_append: true,
                            templates: [
                                { title: 'Kezdő sablon', description: 'Egyszerű kezdő sablon', content: '<p>Kezdd el az írást itt...</p>' },
                                { title: 'Képes sablon', description: 'Sablon képpel', content: '<h2>Cím</h2><p>Leírás...</p><img src="https://via.placeholder.com/350x150" alt="példa kép" />' }
                            ]
                        }}
                        onEditorChange={(newValue) => setContent(newValue)}
                    />
                </FormControl>
                <FormControl mb="4">
                    <FormLabel>Kép URL</FormLabel>
                    <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
                </FormControl>
                <FormControl mb="4">
                    <FormLabel>Kategóriák (vesszővel elválasztva)</FormLabel>
                    <Input value={categories} onChange={(e) => setCategories(e.target.value)} placeholder="pl. technológia, életmód" />
                </FormControl>
                <Button type="submit" colorScheme="blue">
                    Létrehozás
                </Button>
            </form>
        </Container>
    )
}
