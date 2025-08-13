import { Link } from 'react-router-dom';
import './Pagination.css';
import ProblemsCard from './ProblemsCard';
const Pagination = ({ data, currentPage,PAGE_SIZE}) => {


  // Calculate start and end indexes for current page
  const start = currentPage * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  // Get only the problems for the current page
  const paginatedData = data.slice(start, end);

  return (
    <>
      {paginatedData.map((problem, i) => (
        <Link key={problem._id} to={`/codingScreen/${problem._id}`} style={{ textDecoration: "none" }}>
        <ProblemsCard
          key={start + i} // Unique key
          problem={problem}
          index={start + i} // Pass global index if needed
        />
        </Link>
      ))}
    </>
  );
};

export default Pagination;
