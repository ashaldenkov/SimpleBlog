import { useLoaderData, useNavigate, Navigate} from 'react-router-dom'
import styles from './ArticleEdit.module.css'
import { useFormik, Field, FormikProvider, FieldArray, ErrorMessage} from 'formik';
import Cookies from 'js-cookie'

export default function ArticleEdit() {
    const details = useLoaderData()
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
            title: details.title,
            description: details.description,
            body: details.body,
            tags: details.tagList.map(tag => {
                return {'name': `${tag}`}
            }), 
        },
        validate,
        onSubmit: (values,{resetForm}) => {
            const user = JSON.parse(Cookies.get('user'))
            const tagList = values.tags.map(obj => obj.name)
            let request = {article : {title: values.title, description: values.description, body: values.body, tagList: tagList}}
            fetch(`https://api.realworld.io/api/articles/${details.slug}`, {
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
    const user = JSON.parse(Cookies.get('user'))

    if (user.user.username !== details.author.username) {
        alert('You can edit only your personal articles!')
        return <Navigate to='/articles' replace={true}/>
    }

      return (
        <FormikProvider value={formik}>

        <div className={styles.newArticleContainer}>
            <div className={styles.newArticle}>
                <div className={styles.title}>
                    Edit
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
export const ArticleDetailsLoader = async ({ params }) => {
    const { slug } = params
    const res = await fetch('https://api.realworld.io/api/articles/' + slug)
    
        if (!res.ok) {
            throw Error('Could not load the article!')
        }
    let articleDetails = await res.json()
    articleDetails = articleDetails.article
    return articleDetails
}

/*

*/