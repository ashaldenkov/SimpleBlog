import {Outlet, Link} from "react-router-dom"
import styles from './Header.module.css'

export default function HeaderLayout() {
    return (
        <div className='header-layout'>
            <header className={styles.header}>
                <div className={styles.title}><Link className={styles.link} to="/articles">Realworld Blog</Link></div>
                <div className={styles.buttons}>
                    <button className={styles.btn}>Sign In</button>
                    <button className={`${styles.btn} ${styles.btnActive}`}>Sign Up</button>
                </div>
            </header>

            <main>
                <Outlet/>
            </main>
        </div>

    )
}