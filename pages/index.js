import fs from 'fs';
import matter from 'gray-matter';
import Pagination from '../components/pagination';
import PostCard from '../components/postcard';

const PAGE_SIZE = 3;

const range = (start, end, length = end - start + 1) =>
    Array.from({ length }, (_,i) => start + i);

export const getStaticProps = () => {
    const files = fs.readdirSync('posts');
    const posts = files.map((fileName) => {
        const slug = fileName.replace(/\.md$/, '');
        const fileContent = fs.readFileSync(`posts/${fileName}`,
        'utf-8');
        const { data } = matter(fileContent);
        return {
            frontMatter: data,
            slug,
        }
    }).filter((post) => (post = !post.frontMatter.categories.includes('独り言')));

    const sortedPosts = posts.sort((postA, postB) =>
        new Date(postA.frontMatter.date) > new Date(postB.frontMatter.date) ? -1 : 1
    )

    const pages = range(1, Math.ceil(posts.length / PAGE_SIZE));

    return {
        props: {
            posts: sortedPosts.slice(0, PAGE_SIZE),
            pages
        }
    }
}

export const About = () => {
    return (
        <div className="font-bold px-8">
        <h1 className="text-2xl">About Me</h1>
        <p>Akagiiです。主にPython等でプログラミングをしていたり、Linuxを触っていたりします。</p>
        <h1 className="text-2xl pt-8">記事</h1>
        </div>
    )
}

export default function Home({ posts, pages }) {
    return (
    <div>
        <About />
        <div className="px-8">
            <div className="grid grid-cols-3 gap-4">
            {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
            ))}
            </div>
            <Pagination pages={pages} />
        </div>
    </div>
    )
}