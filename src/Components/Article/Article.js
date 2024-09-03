import styles from './Article.module.css'
import { format } from "date-fns";
import heartIcon from './Icons/heart.png'
import liked from './Icons/liked.png'
import { v4 as uuidv4 } from 'uuid';
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'
import { useState } from 'react'

export default function CreateArticleList(articles) {
    let user = null
    if (Cookies.get('user')) {
        user = JSON.parse(Cookies.get('user'))
    }
    
    const likePost = (article, setArticle) => {
        let err = false;
        fetch(`https://api.realworld.io/api/articles/${article.slug}/favorite`, 
            { method: 'POST',
            headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${user.user.token}`
                  }
             })
             .then((res) => {
                if (!res.ok) {
                    err = true
                }
                return res.json()
            })
            .then((data) => {
                setArticle(data.article)
                if (err) alert(data.errors)
            })
            return
  }

    const dislikePost = (article, setArticle) => {
        let err = false;
        fetch(`https://api.realworld.io/api/articles/${article.slug}/favorite`, 
            { method: 'DELETE',
            headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${user.user.token}`
                  }
             })
             .then((res) => {
                if (!res.ok) {
                    err = true
                }
                return res.json()
        })
    .then((data) => {
        setArticle(data.article)
        if (err) alert(data.errors)
    })
    }

    const navigate = useNavigate();

  const Post = ({item}) => {
    const [ article, setArticle ] = useState(item)
    const [ favorited, setFavorited ] = useState(item.favorited)
    return ( 
        <li className={styles.article} key={uuidv4()}>
        <div className={styles.topInfo}>
            <div className={styles.tagsAndTitle}>
                <div className={styles.titleAndLikes}>
                    <Link className={styles.title} to={article.slug}>
                    {article.title}
                    </Link>
                    <button className={styles.likes} onClick={() => {
                        if (!user) {
                            navigate(`/sign-in`)
                        }
                        else if (!favorited) {
                            likePost(article, setArticle)
                            setFavorited(true)
                        }
                        else {
                            dislikePost(article, setArticle)
                            setFavorited(false)
                        }
                    }}>
                    {favorited ? 
                    <img src={liked} alt="likeCount" width='18px' height='16px' className={styles.liked}/> : 
                    <img src={heartIcon} alt="likeCount" width='16px' height='16px' className={styles.notLiked}/>}
                        <p>{article.favoritesCount}</p>
                    </button>
                </div>
                <div className={styles.tags}>
                {article.tagList.map( (tag) => (
                    <div className={styles.tag} key={uuidv4()}>{tag}</div>
                ))}
                </div>
            </div>
            <div className={styles.author}>
                <div className={styles.dateAndName}>
                    <div className={styles.authorName}>{article.author.username}</div>
                    <div className={styles.createdAt}>{format(article.createdAt || Date.now(), 'LLLL dd, yyyy')}</div>
                </div>
                <img src={article.author.image} alt="authorImage"  width='46px' height='46px'/>
            </div>
        </div>
        <div className={styles.articleText}>
            {article.body}
        </div>
    </li>
    )
}


    return (
        <ul>
        {articles.articles.map((item) => (
            <Post item={item} key={item.slug}/>
        ))
        }
        </ul>
    )
}