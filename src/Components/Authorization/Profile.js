import styles from './Profile.module.css'
import { useFormik } from 'formik';
import Cookies from 'js-cookie'
import {Navigate} from "react-router-dom"


export default function Profile() {
//тк нельзя инициализировать формик с условием, то проверка логина идёт после. Добавлены значения для того чтобы парсило и не выдавало ошибку, после редирект на логин
    const user = JSON.parse((Cookies.get('user') || '{"user": {"email": "notauthorized@not.not","username": "notauthorized"}}'))
    const validate = values => {
        const errors = {};
        if (!values.username) {
          errors.username = 'Username must not be empty';
        } else if (values.username.length > 20 || values.username.length < 3) {
          errors.username = 'Username length must be between 3 and 20 characters';
        }

        if (!values.email) {
            errors.email = 'Email must not be empty';
          } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
            errors.email = 'Invalid email address';
          }
      
        if (values.password && (values.password.length > 40 || values.password.length < 6 )) {
          errors.password = 'Password must consist of 6 to 40 characters';
        }
      
        if (values.avatar && !/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(values.avatar)) {
            errors.avatar = 'Put a valid URL adress';
        }  
    
        return errors;
      };
      const formik = useFormik({
        initialValues: {
          username: user.user.username,
          email:  user.user.email,
          password: '',
          avatar: '',
        },
        validate,
        onSubmit: (values,{resetForm}) => {
            let request = {user : {username: values.username, email: values.email, password: values.password, image: values.avatar}}
            fetch(`https://api.realworld.io/api/user`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Token ${user.user.token}`
                },
                body: JSON.stringify(request),
              })
              .then((res) => res.json())
              .then ((data) => {
                if (data.errors) {
                  const error = []
                  for (const [key, value] of Object.entries(data.errors)) {
                    error.push(`${key} ${value} `);
                  }
                  alert(error)
                } else {
                  Cookies.set('user', JSON.stringify(data), { secure: true })
                  resetForm()
                  alert('User updated successfully!')
                }
              })
            .catch((err) => {
                throw Error('Could not connect to server, try again later')
            })
        },
      });

    if (!Cookies.get('user')) {
        return <Navigate to='/sign-in' replace={true}/>
    }

      return (
        <div className={styles.profileContainer}>
            <div className={styles.profile}>
                <div className={styles.title}>
                    Edit profile
                </div>
                <form className={styles.form} onSubmit={formik.handleSubmit}>
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.username}
                        placeholder='Username'
                        className={formik.touched.username && formik.errors.username ? styles.errorInput : ''}
                    />
                    {formik.touched.username && formik.errors.username ?
                    (<div className={styles.errorMsg}>{formik.errors.username}</div>) :
                    null}
                
                    <label htmlFor="email">Email address</label>
                    <input
                        id="email"
                        name="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        placeholder='Email adress'
                        className={formik.touched.email && formik.errors.email ? styles.errorInput : ''}
                    />
                    {formik.touched.email && formik.errors.email ?
                    (<div className={styles.errorMsg}>{formik.errors.email}</div>) :
                    null}

                    <label htmlFor="password">New password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                        autoComplete='off'
                        placeholder='Password'
                        className={formik.touched.password && formik.errors.password ? styles.errorInput : ''}
                    />
                    {formik.touched.password && formik.errors.password ?
                    (<div className={styles.errorMsg}>{formik.errors.password}</div>) :
                    null}

                    <label htmlFor="avatar">Avatar image (url)</label>
                    <input
                        id="avatar"
                        name="avatar"
                        type="url"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.avatar}
                        placeholder='Avatar image'
                        className={formik.touched.avatar && formik.errors.avatar ? styles.errorInput : ''}
                    />
                    {formik.touched.avatar && formik.errors.avatar ?
                    (<div className={styles.errorMsg}>{formik.errors.avatar}</div>) :
                    null}

                    <button type="submit" className={styles.submitBtn}>Save</button>
                </form>
            </div>
        </div>
    )
}