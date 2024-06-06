import styles from './Pagination.module.css'
import nextBtn from './Icons/right.png'

export default function Pagination({page, pageLimit, setPage, visiblePage, setVisiblePage}) {

    const handlePrevPage = () => {
        if (page > 1) {
            setPage(page - 1);
            if (page > 3) {
                setVisiblePage(page - 1)
            }
            if (page === pageLimit) {
                setVisiblePage(pageLimit - 2)
            }
          }
    }
    const handleNextPage = () => {
        if (page < pageLimit) {
            setPage(page + 1);
            if (page < pageLimit - 2) {
                setVisiblePage(page + 1)
            }
            if (page === 1) {
                setVisiblePage(3)
            }
          }
    }
    const changePage = (event) => {
        const clickedNum = Number(event.target.textContent)
        const prevNum = page
        //смена отображаемой страницы
        if ((clickedNum >= 3) && (clickedNum <= pageLimit - 2)) {
            setVisiblePage(clickedNum)
        }
        //смена нумерации если кликнули с 4 на 2
        if ((clickedNum === 2) && (prevNum !== 3)) {
            setVisiblePage(3)
        }
        //смена нумерации если кликнули так же как выше, но с конца
        if ((clickedNum === (pageLimit - 1)) && (prevNum !== (pageLimit - 2))) {
            setVisiblePage((pageLimit - 2))
        }
        setPage(clickedNum)
    }

    const changeClass = (pageValue) => {
        if (page === pageValue) {
            return styles.activePage
        } 
        else return ''
    }
    
    return (
        <div className={styles.pagination}>
          <button onClick={handlePrevPage} className={styles.prevBtn} disabled={page === 1}>
            <img src={nextBtn} alt='previous page'/>
          </button>
          
          <button name={1} onClick={changePage} className={`${styles.pageBtn} ${changeClass(visiblePage - 2)}`} disabled={page === visiblePage - 2}>{visiblePage - 2}
          </button>
          <button name={2} onClick={changePage} className={`${styles.pageBtn} ${changeClass(visiblePage - 1)}`} disabled={page === visiblePage - 1}>{visiblePage - 1}
          </button>
          <button name={3} onClick={changePage} className={`${styles.pageBtn} ${changeClass(visiblePage)}`} disabled={page === visiblePage}>{visiblePage}
          </button>
          <button name={4} onClick={changePage} className={`${styles.pageBtn} ${changeClass(visiblePage + 1)}`} disabled={page === visiblePage + 1}>{visiblePage + 1}
          </button>
          <button name={5} onClick={changePage} className={`${styles.pageBtn} ${changeClass(visiblePage + 2)}`} disabled={page === visiblePage + 2}>{visiblePage + 2}
          </button>

          <button onClick={handleNextPage} className={styles.nextBtn} disabled={page === pageLimit}>
          <img src={nextBtn} alt='next page'/>
          </button>
        </div>
      );
}

