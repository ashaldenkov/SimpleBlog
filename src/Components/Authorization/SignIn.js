import styles from './SignIn.module.css'
import { useFormik } from 'formik';
import { Link, useNavigate, Navigate } from 'react-router-dom'
import Cookies from 'js-cookie'

export default function SignIn() {  
    const navigate = useNavigate();

      const validate = values => {
        const errors = {};

        if (!values.email) {
            errors.email = 'Required field';
          } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
            errors.email = 'Invalid email address';
          }
      
        if (!values.password) {
          errors.password = 'Required field';
        } 
        return errors;
      };
      const formik = useFormik({
        initialValues: {
          email: '',
          password: '',
        },
        validate,
        onSubmit: values => {
            let request = {user : {email: values.email, password: values.password}}
            fetch(`https://api.realworld.io/api/users/login`, {
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
        return <Navigate to='/' replace={true}/>
    }
        return (
            <div className={styles.signInContainer}>
                <div className={styles.signIn}>
                    <div className={styles.title}>
                        Sign In
                    </div>
                    <form className={styles.form} onSubmit={formik.handleSubmit}>

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

                        <button type="submit" className={styles.submitBtn}>Login</button>
                    </form>
                    <div className={styles.redirect}>
                        Don't have an account? <Link to='/sign-up' className={styles.link}>Sign up.</Link>
                    </div>
                </div>
            </div>
        )
    }