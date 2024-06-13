import { Link, useNavigate, Navigate } from 'react-router-dom'
import styles from './SignUp.module.css'
import { useFormik } from 'formik';
import Cookies from 'js-cookie'


export default function SignUp() {
    const navigate = useNavigate();


      const validate = values => {
        const errors = {};
        if (!values.username) {
          errors.username = 'Required field';
        } else if (values.username.length > 20 || values.username.length < 3) {
          errors.username = 'Username length must be between 3 and 20 characters';
        }

        if (!values.email) {
            errors.email = 'Required field';
          } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
            errors.email = 'Invalid email address';
          }
      
        if (!values.password) {
          errors.password = 'Required field';
        } else if (values.password.length > 40 || values.password.length < 6 ) {
          errors.password = 'Password must consist of 6 to 40 characters';
        }
      
        if (!values.repeatPassword) {
            errors.repeatPassword = 'Required field';
          } else if (values.password !== values.repeatPassword) {
            errors.repeatPassword = 'Passwords must match';
          }

        if (!values.checkbox) {
            errors.checkbox = 'Agree on requirements to continue';
        }
          
      
        return errors;
      };

      const formik = useFormik({
        initialValues: {
          username: '',
          email: '',
          password: '',
          repeatPassword: '',
          checkbox:false
        },
        validate,
        onSubmit: values => {
            let request = {user : {username: values.username, email: values.email, password: values.password}}
            fetch(`https://api.realworld.io/api/users`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
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
                  navigate("/articles", { replace: true })
                }
              })
            .catch((err) => {
                throw Error('Could not connect to server, try again later')
            })
        },
      });

      if (Cookies.get('user')) {
        return <Navigate to='/articles' replace={true}/>
    }

    return (
        <div className={styles.signUpContainer}>
            <div className={styles.signUp}>
                <div className={styles.title}>
                    Create new account
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

                    <label htmlFor="password">Password</label>
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

                    <label htmlFor="repeatPassword">Repeat password</label>
                    <input
                        id="repeatPassword"
                        name="repeatPassword"
                        type="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.repeatPassword}
                        autoComplete='off'
                        placeholder='Password'
                        className={formik.touched.repeatPassword && formik.errors.repeatPassword ? styles.errorInput : ''}
                    />
                    {formik.touched.repeatPassword && formik.errors.repeatPassword ?
                    (<div className={styles.errorMsg}>{formik.errors.repeatPassword}</div>) :
                    null}

                    <label className={styles.agree}>
                        <input type="checkbox"
                            name='checkbox'
                            onChange={formik.handleChange}
                            value={formik.values.checkbox}
                            className={formik.touched.checkbox && formik.errors.checkbox ? styles.errorInput : ''}
                        />
                        <span>I agree to the processing of my personal information</span>
                    </label>  
                    {formik.touched.checkbox && formik.errors.checkbox ?
                    (<div className={styles.errorMsg}>{formik.errors.checkbox}</div>) : null}
                    <button type="submit" className={styles.submitBtn}>Create</button>
                </form>
                <div className={styles.redirect}>
                    Already have an account? <Link to='/sign-in' className={styles.link}>Sign in.</Link>
                </div>
            </div>
        </div>
    )
}