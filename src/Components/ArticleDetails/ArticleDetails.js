import { useLoaderData, useParams } from 'react-router-dom'
import styles from './ArticleDetails.module.css'
import { format } from "date-fns";
import heartIcon from './Icons/heart.png'
import { v4 as uuidv4 } from 'uuid';
import ReactMarkdown from 'react-markdown'


export default function ArticleDetails() {
    const details = useLoaderData()
    return (
        <div className={styles.titleContainer}>
            <div className={styles.articleDescription}>
                <div className={styles.topInfo}>
                        <div className={styles.tagsAndTitle}>
                            <div className={styles.titleAndLikes}>
                                <div className={styles.title}>
                                    {details.title}
                                </div>
                                <div className={styles.likes}>
                                        <img src={heartIcon} alt="likeCount" width='16px' height='16px'/>
                                        <p>{details.favoritesCount}</p>
                                </div>
                            </div>
                            <div className={styles.tags}>
                            {details.tagList.map( (tag) => (
                                <div className={styles.tag} key={uuidv4()}>{tag}</div>
                            ))}
                            </div>
                        </div>

                        <div className={styles.author}>
                            <div>
                                <div className={styles.authorName}>{details.author.username}</div>
                                <div className={styles.createdAt}>{format(details.updatedAt, 'LLLL dd, yyyy')}</div>
                            </div>
                            <img src={details.author.image} alt="authorImage"  width='46px' height='46px'/>
                        </div>
                </div>
                <div className={styles.botInfo}>
                    <div className={styles.titleDescription}>{details.description}</div>
                    <ReactMarkdown className={styles.titleText}>{details.body}</ReactMarkdown>
                </div>
            </div>
        </div>
    )
}
export const ArticleDetailsLoader = async ({ params }) => {
    const { slug } = params
    const res = await fetch('https://api.realworld.io/api/articles/' + slug)
    
        if (!res.ok) {
            throw Error('Could not load the article!')
        }
    let articleDetails = await res.json()
    articleDetails = articleDetails.article
    return articleDetails
}

/*

*/