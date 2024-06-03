import styles from './Article.module.css'
import { format } from "date-fns";
import heartIcon from './Icons/heart.png'
import { v4 as uuidv4 } from 'uuid';

export default function createArticleList(articles) {
    return (
        <ul>
        {console.log(articles)}
        {articles.articles.map((item) => (
            <li className={styles.article} key={uuidv4()}>
                <div className={styles.topInfo}>
                    <div className={styles.tagsAndTitle}>
                        <div className={styles.titleAndLikes}>
                            <div className={styles.title}>
                            {item.title}
                            </div>
                            <div className={styles.likes}>
                                <img src={heartIcon} alt="likeCount" width='16px' height='16px'/>
                                <p>{item.favoritesCount}</p>
                            </div>
                        </div>
                        <div className={styles.tags}>
                        {item.tagList.map( (tag) => (
                            <div className={styles.tag} key={uuidv4()}>{tag}</div>
                        ))}
                        </div>
                    </div>
                    <div className={styles.author}>
                        <div>
                            <div className={styles.authorName}>{item.author.username}</div>
                            <div className={styles.createdAt}>{format(item.updatedAt, 'LLLL dd, yyyy')}</div>
                        </div>
                        <img src={item.author.image} alt="authorImage"  width='46px' height='46px'/>
                    </div>
                </div>
                <div className={styles.articleText}>
                    {item.body}
                </div>
            </li>
        ))
        }
        </ul>
    )
}