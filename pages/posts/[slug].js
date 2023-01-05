import fs from 'fs';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeShiki from "rehype-shiki";
import * as shiki from "shiki";
import remarkToc from 'remark-toc';
import rehypeSlug from 'rehype-slug';
import rehypeParse from 'rehype-parse';
import rehypeReact from 'rehype-react';
import Image from 'next/image';
import Link from 'next/link';
import { createElement, Fragment } from 'react';
import { NextSeo } from 'next-seo';

export async function getStaticProps({ params }) {
    const file = fs.readFileSync(`posts/${params.slug}.md`, 'utf-8');
    const { data, content } = matter(file);
    const result = await unified()
        .use(remarkParse, {
            fragment: true
        })
        .use(remarkToc, {
            heading: '目次',
        })
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeSlug)
        .use(rehypeShiki, {
        highlighter: await shiki.getHighlighter({
            theme: 'github-light',
        }),
        })
        .use(rehypeStringify, { allowDangerousHtml: true })
        .process(content);
    return { props: { frontMatter: data, content: result.toString() , slug: params.slug} };
}

export async function getStaticPaths() {
    const files = fs.readdirSync('posts');
    const paths = files.map((fileName) => ({
        params: {
            slug: fileName.replace(/\.md$/, ''),
        }
    }))
    return {
        paths,
        fallback: false,
    }
}

const MyLink = ({ children, href }) => {
    if (href === '') href = '/';
    return href.startsWith('/') || href.startsWith('#') ? (
        <Link href={href}>
            {children}
        </Link>
    ) : (
        <a href={href} target="_blank" rel="noopener noreferrer">
            {children}
        </a>
    )
}


const MyImage = ({ src, alt }) => {
    return (
      <div className="relative max-w-full h-96">
        <Image src={src} alt={alt} fill style={"contain"} />
      </div>
    )
}

const toReactNode = (content) => {
    return unified()
      .use(rehypeParse, {
        fragment: true,
      })
      .use(rehypeReact, {
        createElement,
        Fragment,
        components: {
            a: MyLink,
            img: MyImage,
        }
      })
      .processSync(content).result;
  };

const Post = ({ frontMatter, content, slug }) => {
    return (
        <>
            <NextSeo
            title={frontMatter.title}
            description={frontMatter.description}
            openGraph={{
                type: 'website',
                url: `https://akagii.net/${slug}`,
                title: frontMatter.title,
                description: frontMatter.description,
                images: [
                    {
                        url: `https://akagii.net/${frontMatter.image}`,
                        width: 1200,
                        height: 700,
                        alt: frontMatter.title
                    }
                ]
            }}
            />
        <div className="prose prose-lg max-w-none">
            <h1 className="mt-12">{frontMatter.title}</h1>
            <span>{frontMatter.date}</span>
            <div className="space-x-2">
                {frontMatter.categories.map((category) => (
                    <span key={category} >
                        <Link href={`/categories/${category}`}>
                            {category}
                        </Link>
                    </span>
                ))}
            </div>
            {toReactNode(content)}
        </div>
        </>
)}

export default Post;