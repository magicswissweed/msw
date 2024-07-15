import './404.scss';

export const ErrorNotFound = () => {
    return <>
        <div className="container">
            <p className="status-code row">404</p>
            <h1 className="status-title row">Not found</h1>
            <p className="status-explanation row">Sorry, we couldn't find what you're looking for.</p>
        </div>
    </>
}