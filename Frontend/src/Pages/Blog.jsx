import React from 'react'
import Navbar from '../Components/Navbar'
import HeroBackground from '../Components/HeroBackground'
import Footer from '../Components/Footer'
import styles from './Blog.module.css'

const posts = [
  {
    title: 'Learning to Think Like a Developer',
    excerpt: 'Practical approaches to problem solving and building resilient mental models.',
    date: 'Feb 1, 2026',
    author: 'Team CodingLabs'
  },
  {
    title: 'How to Debug Faster',
    excerpt: 'A short guide to faster debugging using focused tests and logging.',
    date: 'Jan 20, 2026',
    author: 'Team CodingLabs'
  },
  {
    title: 'Interview Prep: Top Algorithms',
    excerpt: 'Key tricks and patterns that reappear in interviews and real projects.',
    date: 'Dec 15, 2025',
    author: 'Team CodingLabs'
  }
]

const Blog = () => {
  return (
    <>
      <div className='landing-page'>
        <HeroBackground />
        <div className='landing-foreground'>
          <Navbar />
        </div>
      </div>

      <div className={styles.blogSection}>
        <h1 className={styles.blogHeading} data-aos="fade-up">From the Labs</h1>
        <p className={styles.blogSubheading} data-aos="fade-up">Insights, guides and tutorials to help you level up.</p>

        <div className={styles.postsGrid} data-aos="fade-up" data-aos-duration="1200">
          {posts.map((post, idx) => (
            <article key={idx} className={`card glass-effect ${styles.postCard}`}>
              <div className={styles.postMeta}>
                <span className={styles.postDate}>{post.date}</span>
                <span className={styles.postAuthor}>{post.author}</span>
              </div>
              <h3 className={styles.postTitle}>{post.title}</h3>
              <p className={styles.postExcerpt}>{post.excerpt}</p>
              <div className={styles.postActions}>
                <button className="button button-white">Read</button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <Footer />
    </>
  )
}

export default Blog
