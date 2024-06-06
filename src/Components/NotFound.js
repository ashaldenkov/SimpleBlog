import { Link } from "react-router-dom";
import styles from './NotFound.module.css'

export default function NotFound() {

    return (
        <div className={styles.container}>
            <h2 className={styles.header}>Page you are looking for does not exist!</h2>
            <p className={styles.text}>
                Go to the <Link to="/articles" className={styles.link}>Main Page</Link>
            </p>
        </div>
    )
}
