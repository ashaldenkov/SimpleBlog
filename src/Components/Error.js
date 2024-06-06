import { Link, useRouteError } from 'react-router-dom'
import styles from './Error.module.css'

export default function ErrorPage() {
    const error = useRouteError()

    return (
        <div className={styles.error}>
            <h2 className={styles.errorTitle}>Error happened!</h2>
            <p className={styles.errorText}>{error.message}</p>
            <Link to="/articles" className={styles.errorLink}>Back to homepage</Link>
        </div>
    )
}