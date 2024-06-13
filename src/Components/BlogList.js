import styles from './Blog.module.css'
import {useState, useEffect} from 'react'
import CreateArticleList from './Article/Article'
import Pagination from './Pagination/Pagination'
import { Circles } from 'react-loader-spinner'
import Cookies from 'js-cookie'

export default function BlogList() {

    const [articles, setArticles] = useState();
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1)
    const [pageLimit, setPageLimit] = useState(0)
    const [visiblePage, setVisiblePage] = useState(3)    //отображение нумерации страниц, чтобы сохранялось при ререндеринге
    const articlesLimit = 5



    useEffect(() => {
    const getArticleList = async () => {
        setLoading(true)
        setArticles()
        let res
        if (Cookies.get('user')) {
            const user = JSON.parse(Cookies.get('user'))
            res = await fetch(`https://api.realworld.io/api/articles?offset=${5*(page-1)}&limit=${articlesLimit}`,
            {headers: {
                "Authorization": `Token ${user.user.token}`
              }})
        } else {
             res = await fetch(`https://api.realworld.io/api/articles?offset=${5*(page-1)}&limit=${articlesLimit}`)
        }
          
        if (!res.ok) {
            throw Error('Could not fetch the articles!')
        }

        let list = await res.json();
        setPageLimit(Math.ceil(list.articlesCount / articlesLimit)) // делим количество статей на лимит постов на странице и округляем вверх
        list = list.articles
        setArticles(list)
        setLoading(false)
        }
        getArticleList()
    }, [page]);

    return (
        <div className={styles.blog}>
            {loading ? <Circles
            className={styles.loader}
            height="80"
            width="80"
            color="#1890FF"
            ariaLabel="circles-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            /> : null}
            {articles ? <CreateArticleList articles={articles} /> : null}
            {articles ? <Pagination page={page} setPage={setPage} pageLimit={pageLimit} visiblePage={visiblePage} setVisiblePage={setVisiblePage}/> : null}
        </div>

    )
}

