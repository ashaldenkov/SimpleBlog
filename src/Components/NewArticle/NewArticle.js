import styles from './NewArticle.module.css'
import { useFormik, Field, FormikProvider, FieldArray, ErrorMessage} from 'formik';
import Cookies from 'js-cookie'
import { Navigate, useNavigate } from "react-router-dom"


export default function NewArticle() {
    const navigate = useNavigate();

    const validate = values => {
        const errors = {};
        if (!values.title) {
          errors.title = 'Title must not be empty';
        }

        if (!values.description) {
            errors.description = 'Description must not be empty';
          }
      
          if (!values.body) {
            errors.body = 'Article body must not be empty';
          }
    
        return errors;
      };
      const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            body: '',
            tags: [{name: ''},],
        },
        validate,
        onSubmit: (values,{resetForm}) => {
            const user = JSON.parse(Cookies.get('user'))
            const tagList = values.tags.map(obj => obj.name)
            let request = {article : {title: values.title, description: values.description, body: values.body, tagList: tagList}}
            fetch(`https://api.realworld.io/api/articles`, {
                method: "POST",
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
                    navigate(`/articles/${data.article.slug}`)
              }})
            .catch((err) => {
                throw Error('Could not connect to server, try again later')
            })
        },
      });


    if (!Cookies.get('user')) {
        return <Navigate to='/sign-in' replace={true}/>
    }

      return (
        <FormikProvider value={formik}>

        <div className={styles.newArticleContainer}>
            <div className={styles.newArticle}>
                <div className={styles.title}>
                    Create new article
                </div>
                <form className={styles.form} onSubmit={formik.handleSubmit}>
                    <label htmlFor="title">Title</label>
                    <input
                        name="title"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.title}
                        placeholder='Title'
                        className={formik.touched.title && formik.errors.title ? styles.errorInput : ''}
                    />
                    {formik.touched.title && formik.errors.title ?
                    (<div className={styles.errorMsg}>{formik.errors.title}</div>) :
                    null}
                
                    <label htmlFor="description">Short description</label>
                    <input
                        name="description"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.description}
                        placeholder='Short description'
                        className={formik.touched.description && formik.errors.description ? styles.errorInput : ''}
                    />
                    {formik.touched.description && formik.errors.description ?
                    (<div className={styles.errorMsg}>{formik.errors.description}</div>) :
                    null}

                    <label htmlFor="body">Text</label>
                    <Field
                        as="textarea"
                        name="body"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.body}
                        placeholder='Text'
                        className={`${styles.body} ${formik.touched.body && formik.errors.body ? styles.errorInput : ''}`}
                    />
                    {formik.touched.body && formik.errors.body ?
                    (<div className={styles.errorMsg}>{formik.errors.body}</div>) :
                    null}

                    <label htmlFor="tags">Tags</label>
                    
                    <FieldArray name="tags">
              {({ remove, push }) => (
                <div className={styles.tagList}>
                <button
                    type="button"
                    className={styles.addTagBtn}
                    onClick={() => push({ name: ''})}
                >
                    Add tag
                  </button>
                  {formik.values.tags.length > 0 &&
                    formik.values.tags.map((tag, index) => (
                      <div className={styles.tag} key={index}>
                        <div className={styles.tagText}>
                          <Field
                            name={`tags.${index}.name`}
                            placeholder="Tag"
                            type="text"
                          />
                          <ErrorMessage
                            name={`tags.${index}.name`}
                            component="div"
                            className="field-error"
                          />
                        </div>
                        <div className={styles.deleteTag}>
                          <button
                            type="button"
                            className={styles.deleteTagBtn}
                            onClick={() => remove(index)}
                          > Delete tag
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </FieldArray>
                    {formik.touched.tags && formik.errors.tags ?
                    (<div className={styles.errorMsg}>{formik.errors.tags}</div>) :
                    null}
                    <button type="submit" className={styles.submitBtn}>Send</button>
                </form>
            </div>
        </div>
        </FormikProvider>
    )
}
