import './Pagination.css'
import ProblemsCard from './ProblemsCard';
const Pagination = ({ data, currentPage, setCurrentPage }) => {
  const PAGE_SIZE = 2; // items per page

  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  const page_arr = new Array(totalPages).fill(0);
  function RenderList({ start, data }) {
    const items = [];
    for (let i = start; i < start + PAGE_SIZE && i < data.length; i++) {
      items.push(<ProblemsCard problem={data[i]} index={i} />);
    }
    return <>{items}</>;
  }
  return (
    <>
      <div className="pagination-container">
        {page_arr.map((_, index) => (
          <div
            key={index}
            className="pagination-number"
            onClick={() => setCurrentPage(index)}
          >
            {index + 1}
          </div>
        ))}
      </div>
      <RenderList start={currentPage * PAGE_SIZE} data={data} />
    </>
  );
};

export default Pagination;
