import { useLoaderData, useNavigate } from 'react-router-dom'
import styles from './ArticleDetails.module.css'
import { format } from "date-fns";
import heartIcon from './Icons/heart.png'
import arrow from './Icons/arrow.png'
import attention from './Icons/attention.png'
import { v4 as uuidv4 } from 'uuid';
import ReactMarkdown from 'react-markdown'
import { useState } from 'react'
import Cookies from 'js-cookie'
import liked from './Icons/liked.png'


export default function ArticleDetails() {
    const details = useLoaderData()
    const navigate = useNavigate();
    let user = null
    if (Cookies.get('user')) {
        user = JSON.parse(Cookies.get('user'))
    }
    const ModalWindow = () => {
        return (
        <div className={styles.modal}>
            <div className={styles.modalText}>
                <img src={attention} alt="attention" width='16px' height='16px'/>
                <p>Are you sure to delete this article?</p>
            </div>
            <div className={styles.modalBtns}>
                <button className={styles.modalNo} onClick={() => setModal(false)}>No</button>
                <button className={styles.modalYes} onClick={() => {
                    fetch(`https://api.realworld.io/api/articles/${details.slug}`, 
                        { method: 'DELETE',
                        headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Token ${user.user.token}`
                              }
                         })
                         .then((res) => {
                            if (res.ok) {
                                navigate(`/articles`)
                            } else {
                               return res.json()
                            }
                })
                .then((data) => {
                    data ? alert(data.message) : Promise.resolve(data)
                })



                }}>Yes</button>
            </div>
            <img  className={styles.modalArrow} src={arrow} alt="arrow" width='6px' height='24px'/>
        </div>
    )};

    const ControlsButtons = () => {
    return (
        <div className={styles.controlBtns}>
        <button className={styles.deleteBtn} onClick={() => setModal(true)}>Delete</button>
        <button className={styles.editBtn} onClick={() => navigate(`/articles/${details.slug}/edit`)}>Edit</button> 
        {modal ? <ModalWindow/> : null}
    </div>
    )
}
    const [ modal, setModal ] = useState(false)
    const [ favorited, setFavorited ] = useState(details.favorited)
    const [ article, setArticle ] = useState(details)

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
    return (
        <div className={styles.titleContainer}>
            <div className={styles.articleDescription}>
                <div className={styles.topInfo}>
                        <div className={styles.tagsAndTitle}>
                            <div className={styles.titleAndLikes}>
                                <div className={styles.title}>
                                    {article.title}
                                </div>
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
                    <div className={styles.descAndControls}>
                        <div className={styles.titleDescription}>{details.description}</div>
                      {((user) && (details.author.username === user.user.username)) ? <ControlsButtons/> : null}
                    </div>
                    <ReactMarkdown className={styles.titleText}>{details.body}</ReactMarkdown>
                </div>
            </div>
        </div>
    )
}
export const ArticleDetailsLoader = async ({ params }) => {
    let user = null
    let res
    if (Cookies.get('user')) {
        user = JSON.parse(Cookies.get('user'))
    }
    const { slug } = params

    if (user) {
        res = await fetch('https://api.realworld.io/api/articles/' + slug, 
            {headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${user.user.token}`
              }}
        )
    } else {
        res = await fetch('https://api.realworld.io/api/articles/' + slug)
    }

        if (!res.ok) {
            throw Error('Could not load the article!')
        }
    let articleDetails = await res.json()
    articleDetails = articleDetails.article
    return articleDetails
}