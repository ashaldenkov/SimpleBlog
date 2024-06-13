import {Outlet, Link, useNavigate, redirect } from "react-router-dom"
import styles from './Header.module.css'
import Cookies from 'js-cookie'

export default function HeaderLayout() {
    const navigate = useNavigate()
    let user = {}
    if (Cookies.get('user')) {
        user = JSON.parse(Cookies.get('user'))
    }

    function Buttons() {
        if (Cookies.get('user')) {
           return (
            //Если залогинены то кнопки профиля
           <div className={styles.buttons}>
                <button className={`${styles.btnArticle} ${styles.btnActive}`} onClick={() => navigate('/new-article')}>Create article</button>
                <button className={styles.btnProfile} onClick={() => navigate('/profile')}>
                    <p>{user.user.username}</p>
                    <img src={user.user.image} alt="User Icon"/>
                </button>
                <button className={styles.btnLogout} onClick={() => {
                    Cookies.remove('user')
                    redirect ('/articles')
                    window.location.reload()
                }}>Log Out</button>
            </div>
            )
        } else {
            //Если незалогинены то кнопки входа
            return (
            <div className={styles.buttons}>
                <button className={styles.btn} onClick={() => navigate('/sign-in')}>Sign In</button>
                <button className={`${styles.btn} ${styles.btnActive}`} onClick={() => navigate('/sign-up')}>Sign Up</button>
            </div>
            )
        }
      }

    return (
        <div className='header-layout'>
            <header className={styles.header}>
                <div className={styles.title}><Link className={styles.link} reloadDocument to="/articles">Realworld Blog</Link></div>
                <Buttons/>
            </header>

            <main>
                <Outlet/>
            </main>
        </div>

    )
}
