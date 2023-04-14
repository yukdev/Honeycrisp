import Session from '../../components/Session';

const SessionPage = ({ params: { id } }) => {
  return (
    <div className="card">
      <Session id={id} />
    </div>
  );
};

export default SessionPage;
