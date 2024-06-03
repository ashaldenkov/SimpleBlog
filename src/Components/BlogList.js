import styles from './Blog.module.css'
import {useState, useEffect} from 'react'
import CreateArticleList from './Article/Article'
export default function BlogList() {

    const [articles, setArticles] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
    const getArticleList = async () => {
        setLoading(true)
        const res = await fetch(`https://api.realworld.io/api/articles?offset=5&limit=5`)
        let list = await res.json();
        list = list.articles
        setArticles(list)
        setLoading(false)
        }

        getArticleList()
    }, []);

    return (
        <div className={styles.blog}>
            {articles ? <CreateArticleList articles={articles} /> : null}
        </div>

    )
}

