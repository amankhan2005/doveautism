import { Link } from 'react-router-dom';
import styles from './Breadcrumbs.module.css';

export function Breadcrumbs({ current }) {
  return (
    <nav aria-label="Breadcrumb" className={styles.crumbs}>
      <ol>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li aria-current="page">{current}</li>
      </ol>
    </nav>
  );
}
